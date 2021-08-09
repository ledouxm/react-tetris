import { Button, Spinner, Stack } from "@chakra-ui/react";
import { chunk } from "@pastable/core";
import { useState } from "react";
import { useQuery } from "react-query";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { api } from "../api";

const getEvolutions = async () => (await api.get("/evolutions")).data;

const makeSample = (sample: any[], key: string) =>
    sample.reduce((acc, current) => acc + current[key], 0) / sample.length;

export const Evolutions = () => {
    const { data: evolutions, isLoading } = useQuery(
        "evolutions",
        getEvolutions,
        {
            refetchInterval: 1000,
        }
    );
    const [nbSample, setNbSample] = useState(1);

    if (isLoading) return <Spinner />;
    const chunks = chunk(evolutions, nbSample);

    const sampled = chunks.map((sample) => ({
        bestScore: makeSample(sample, "bestScore"),
        average: makeSample(sample, "average"),
        median: makeSample(sample, "median"),
        worstScore: makeSample(sample, "worstScore"),
        generation: sample[0].generation,

        nbClearedRowsFactor: makeSample(sample, "nbClearedRowsFactor"),
        nbHolesFactor: makeSample(sample, "nbHolesFactor"),
        cumulativeHeightFactor: makeSample(sample, "cumulativeHeightFactor"),
        bumpinessFactor: makeSample(sample, "bumpinessFactor"),
        relativeHeightFactor: makeSample(sample, "relativeHeightFactor"),
        heightFactor: makeSample(sample, "heightFactor"),
    }));

    return (
        <Stack>
            <Button onClick={() => setNbSample((nbSample) => nbSample - 1)}>
                -
            </Button>
            <Button onClick={() => setNbSample((nbSample) => nbSample + 1)}>
                +
            </Button>
            <Stack w="1280px" h="720px">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart width={500} height={300} data={sampled}>
                        <XAxis dataKey="generation" />
                        <YAxis />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="bestScore"
                            stroke="#8884d8"
                        />
                        <Line
                            type="monotone"
                            dataKey="average"
                            stroke="#f8bacc"
                        />
                        <Line
                            type="monotone"
                            dataKey="median"
                            stroke="#abcdef"
                        />
                        <Line
                            type="monotone"
                            dataKey="worstScore"
                            stroke="#fbcfbc"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Stack>
            <Stack w="1280px" h="720px">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart width={500} height={300} data={sampled}>
                        <XAxis dataKey="generation" />
                        <YAxis />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="nbClearedRowsFactor"
                            stroke="#8884d8"
                        />
                        <Line
                            type="monotone"
                            dataKey="nbHolesFactor"
                            stroke="#f8bacc"
                        />
                        <Line
                            type="monotone"
                            dataKey="cumulativeHeightFactor"
                            stroke="#abcdef"
                        />
                        <Line
                            type="monotone"
                            dataKey="bumpinessFactor"
                            stroke="#fbcfbc"
                        />
                        <Line
                            type="monotone"
                            dataKey="relativeHeightFactor"
                            stroke="#934903"
                        />
                        <Line
                            type="monotone"
                            dataKey="heightFactor"
                            stroke="#237487"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Stack>
        </Stack>
    );
};
