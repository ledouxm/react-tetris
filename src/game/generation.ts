import { getRandomIntIn, makeArrayOf, sortBy } from "@pastable/utils";

import { Game } from "./game";
import { Ia } from "./ia";
import { IAConfig, random, randomWeight } from "./iaConfig";

const POPULATION_SIZE = 100;
const ELITISM_PERCENTAGE = 0.5;
const MUTATION_PERCENTAGE = 0.1;
const PARALLEL_GAME = 1;

const LAST_GENERATION_KEY = "lastGeneration";

interface JsonGeneration {
    configs: IAConfig[];
    generation: number;
}

export class Generation {
    public genNumber = 0;
    public oldPop: Population;
    public population: Population;
    public lastGeneration: JsonGeneration;

    constructor() {
        try {
            // retrieve last generation from localstorage if any
            const lastGenerationStr = localStorage.getItem(LAST_GENERATION_KEY);
            this.lastGeneration = JSON.parse(lastGenerationStr);

            this.genNumber = this.lastGeneration.generation + 1;

            // create a new population with retrieve configs
            this.oldPop = new Population(null);
            this.oldPop.initIndividuals(this.lastGeneration.configs);
        } catch (e) {
            console.log("no previous generation");
        }
    }

    async start() {
        while (true) {
            await this.startOnePopulation();
        }
    }

    async startOnePopulation(update?: (game: Game) => void) {
        // create current population based on last population
        this.population = new Population(this.oldPop, update);

        // process every agent of the population
        const results = await this.population.start();

        console.log(
            `generation no ${this.genNumber} - ${this.population.individuals.length}` +
                "\n" +
                `best score: ${results.bestScore}\naverage: ${results.average}\nnbPiece: ${results.best.bestGame.nbPiece}\ncleared rows: ${results.best.bestGame.nbClearedLines}` +
                "\n" +
                `\nbest: ${results.best.config.toString()}
                \n
                scores: ${results.scores.join(", ")}`
        );

        // store current generation data as last generation
        localStorage.setItem(
            LAST_GENERATION_KEY,
            JSON.stringify(
                {
                    generation: this.genNumber,
                    configs: this.population.individuals.map((agent) => agent.config),
                },
                null,
                4
            )
        );

        this.oldPop = this.population;

        this.genNumber++;
    }
}

const createGame = (update?: (game: Game) => void) => {
    const game = new Game();
    game.start(update);
    return game;
};
export const makeClone = (update?: (game: Game) => void) =>
    makeArrayOf(PARALLEL_GAME).map(() => createGame(update));

export class Population {
    public individuals: Ia[] = [];

    constructor(public oldPopulation: Population, public update?: (game: Game) => void) {
        this.crossover();
        this.mutate();
    }

    initIndividuals(configs?: Partial<IAConfig>) {
        this.individuals = makeArrayOf(POPULATION_SIZE).map(
            (_, index) => new Ia(makeClone(index === 0 ? this.update : null), configs?.[index])
        );
    }

    crossover() {
        if (!this.oldPopulation) {
            this.initIndividuals();
            return;
        }

        const sorted = sortBy(this.oldPopulation.individuals, "avgScore", "desc");
        const bestHalf = sorted.slice(0, Math.round(sorted.length / 2));
        // console.log(sorted.map(individual => individual.avgScore));

        // const totalScore = bestHalf.reduce((acc, current) => acc + current.avgScore, 0);
        // const probs = bestHalf.map((agent) => agent.avgScore / totalScore);

        this.individuals = [];

        for (let i = 0; i < POPULATION_SIZE; i++) {
            if (i < POPULATION_SIZE * ELITISM_PERCENTAGE) {
                this.individuals.push(new Ia(makeClone(), sorted[i].config));
            } else {
                const a = Math.floor(random() * bestHalf.length);
                const b = Math.floor(random() * bestHalf.length);

                const parentA = bestHalf[a];
                const parentB = bestHalf[b];

                const configData = { ...parentA.config };
                Object.keys(parentA.config).map((key) => {
                    const r = random();
                    //@ts-ignore
                    if (r >= 0.5) configData[key] = parentB.config[key];
                });

                const config = new IAConfig(configData);

                this.individuals.push(new Ia(makeClone(), config));
            }
        }
    }

    mutate() {
        this.individuals = this.individuals.map((individual) => {
            const { config } = individual;

            Object.keys(config).map((key) => {
                if (random() < MUTATION_PERCENTAGE) {
                    //@ts-ignore
                    config[key] = randomWeight();
                }
            });

            individual.config = config;

            return individual;
        });
    }

    async start() {
        const results = this.individuals.map((individual) => individual.playWholeGame());

        const sorted = sortBy(results, "score", "desc");
        const best = sorted[0];

        const average = results.reduce((acc, current) => acc + current.score, 0) / results.length;

        return {
            best,
            average,
            bestScore: best.score,
            scores: sorted.map((result) => result.score),
        };
    }
}

export const randomWithProbs = (probs: number[], riggedRandom?: number) => {
    const randomNb = riggedRandom || random();
    let i = 0;
    let acc = probs[i];
    while (randomNb > acc) {
        i++;
        acc += probs[i];
    }

    return i;
};
