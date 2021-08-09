import { Box, Button, Center, Stack } from "@chakra-ui/react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useQuery } from "react-query";
import { api } from "./api";
import { BestGame } from "./pages/BestGame";
import { makeGrid, makeLine, TetrisGrid } from "./Tetris";
import { clone, CURRENT_CELL, EMPTY_CELL, Grid } from "./utils";

interface Move {
    cells: { x: number; y: number }[];
    piece: string;
}

const getLinesToClear = (grid: Grid) => {
    return grid.reduce((arr, currentRow, currentIndex) => {
        if (
            currentRow.every(
                (cell) => cell !== EMPTY_CELL && cell !== CURRENT_CELL
            )
        ) {
            arr.push(currentIndex);
        }
        return arr;
    }, [] as number[]);
};

const getBestGame = async () => (await api.get("/game/best")).data;

const interval = 200;
export const Game = () => {
    const { data: bestGame } = useQuery("bestGame", getBestGame);

    if (!bestGame) return <Box>no data</Box>;

    return (
        <Center>
            <BestGame bestGame={bestGame} />
        </Center>
    );
};
