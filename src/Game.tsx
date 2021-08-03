import { Box, Button, Center, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { useQuery } from "react-query";
import { api } from "./api";
import { makeGrid, makeLine, TetrisGrid } from "./Tetris";
import { clone, CURRENT_CELL, EMPTY_CELL, Grid } from "./utils";

interface Move {
    cells: { x: number; y: number }[];
    piece: string;
}

const getLinesToClear = (grid: Grid) => {
    return grid.reduce((arr, currentRow, currentIndex) => {
        if (currentRow.every((cell) => cell !== EMPTY_CELL && cell !== CURRENT_CELL)) {
            arr.push(currentIndex);
        }
        return arr;
    }, [] as number[]);
};

const getBestGame = async () => (await api.get("/game/best")).data;

export const Game = () => {
    const [grid, setGrid] = useState(makeGrid());
    const [currentMove, setCurrentMove] = useState(0);

    const { data: bestGame } = useQuery("bestGame", getBestGame);
    const playMove = (move: Move) => {
        const newGrid = clone(grid);
        move.cells.forEach((coord) => (newGrid[coord.x][coord.y] = move.piece));
        checkTetrisAndDisplay(newGrid);
    };

    const checkTetrisAndDisplay = (grid: Grid) => {
        const newGrid = clone(grid);
        const linesToClear = getLinesToClear(newGrid);

        linesToClear.forEach((lineIndex) => {
            newGrid.splice(lineIndex, 1);
            newGrid.unshift(makeLine());
        });

        setGrid(newGrid);
    };

    const nextMove = () => {
        if (currentMove >= bestGame.moves.length) return;
        playMove(bestGame?.moves[currentMove]);
        setCurrentMove((currentMove) => currentMove + 1);
    };

    const reset = () => {
        setGrid(makeGrid());
        setCurrentMove(0);
    };

    if (!bestGame) return <Box>no data</Box>;

    return (
        <Center>
            <Stack>
                <Box>
                    Generation no {bestGame.generation} - {bestGame.score}
                </Box>
                <TetrisGrid grid={grid} />
                <Button onClick={() => nextMove()}>Next move</Button>
                <Button onClick={() => reset()}>Reset</Button>
            </Stack>
        </Center>
    );
};
