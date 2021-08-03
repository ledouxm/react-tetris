import {
    Box,
    Button,
    Flex,
    Input,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Spinner,
    Square,
    Stack,
} from "@chakra-ui/react";
import { useQuery } from "react-query";
import { api } from "./api";
import { makeArrayOf, omit } from "@pastable/core";
import { useState } from "react";
import { useRef } from "react";
import { Game, Piece } from "./game/game";
import { useEffect } from "react";
import { computeScore, findAllMoves, findBestMove, getNbHoles, getPeaks, Ia } from "./game/ia";
import { Controller, useForm } from "react-hook-form";
import { ConfigData } from "./game/iaConfig";
import { getHoles } from "./game/pomped";
import { Generation } from "./game/generation";

export type Grid = string[][];
export const EMPTY_CELL = "*";
export const makeLine = () => makeArrayOf(10).map(() => EMPTY_CELL);
export const makeGrid = () => makeArrayOf(20).map(makeLine);

const logGrid = (grid: Grid) => grid.forEach((row) => console.log(row.join(" ")));
// const getBestGame = async () => (await api.get("/game/best")).data;
export const Tetris = () => {
    const [currentGame, setCurrentGame] = useState<Game>();

    const generationRef = useRef<Generation>(new Generation());

    const update = (game: Game) => {
        setCurrentGame(game);
    };

    return (
        <Stack>
            <Stack direction="row">
                {/* <TetrisGame game={currentGame} /> */}
                <Stack>
                    <TetrisGrid grid={currentGame?.grid} />
                    <Button onClick={() => generationRef.current.startOnePopulation(update)}>
                        Play
                    </Button>
                </Stack>
                <Stack></Stack>
            </Stack>
        </Stack>
    );
};

export const TetrisConfig = ({
    ia,
    onSubmit,
}: {
    ia: Ia;
    onSubmit?: (config: ConfigData) => void;
}) => {
    const defaultValues = { ...omit(ia.config, ["toString"]) };
    const { handleSubmit, control, watch, setValue } = useForm({ defaultValues });

    const isEditable = !!onSubmit;

    useEffect(() => {
        if (!defaultValues) return;
        Object.entries({ ...omit(ia.config, ["toString"]) }).map(([key, value]) =>
            setValue(key as any, value)
        );
    }, [ia]);

    const submit = (newConfig: ConfigData) => {
        onSubmit(newConfig);
    };

    return (
        <form onSubmit={handleSubmit(submit)}>
            <Stack width="500px">
                {Object.entries(defaultValues).map(([key, value]) => (
                    <Stack key={key}>
                        <Box>
                            {key} ({watch(key as any)})
                        </Box>
                        <Controller
                            render={({ field }) => (
                                <Slider
                                    defaultValue={value}
                                    min={-1}
                                    max={1}
                                    step={0.01}
                                    disabled={!isEditable}
                                    {...field}
                                >
                                    <SliderTrack bg="red.100">
                                        <Box position="relative" right={10} />
                                        <SliderFilledTrack bg="tomato" />
                                    </SliderTrack>
                                    <SliderThumb boxSize={6} />
                                </Slider>
                            )}
                            name={key as any}
                            control={control}
                            defaultValue={value}
                        />
                    </Stack>
                ))}
                {isEditable && <Button type="submit">Update</Button>}
            </Stack>
        </form>
    );
};

const TetrisGame = ({ game }: { game?: Game }) => {
    return (
        <Stack>
            <Box>Status: {game?.status}</Box>
            <Box>Score: {game?.score}</Box>
            <Box>Nb cleared lines: {game?.nbClearedLines}</Box>
            <Box>Nb piece: {game?.nbPiece}</Box>
            <Box>Calculated holes: {getNbHoles(game?.grid).nbHoles}</Box>
            <Box>Calculated peaks: {getPeaks(game?.grid).join(", ")}</Box>
        </Stack>
    );
};

const useGrid = () => {
    const [grid, setGrid] = useState(makeGrid());

    const clear = () => setGrid(makeGrid());

    // const setPiece = ()
};

export const TetrisGrid = ({ grid }: { grid?: Grid }) => {
    return (
        <Flex direction="column">
            {(grid || makeGrid()).map((row, x) => (
                <Flex key={x}>
                    {row.map((cell, y) => (
                        <Square key={y} size="40px" bgColor={colorByPieceName[cell]} color="black">
                            {x} {y}
                        </Square>
                    ))}
                </Flex>
            ))}
        </Flex>
    );
};

const colorByPieceName: Record<Piece["name"], string> = {
    I: "#264653",
    J: "#2a9d8f",
    L: "#8AB17D",
    Z: "#BABB74",
    S: "#E9C46A",
    O: "#F4A261",
    T: "#E76F51",
    "*": "white",
    "#": "orange",
};
