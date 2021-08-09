import { Box, Stack } from "@chakra-ui/react";
import { useEffect } from "react";
import { useState } from "react";
import { makeGrid, makeLine, TetrisGrid } from "../Tetris";
import { clone, CURRENT_CELL, EMPTY_CELL, Grid } from "../utils";

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

export const BestGame = ({ bestGame }) => {
    const [moveCpt, setMoveCpt] = useState(0);
    const [grid, setGrid] = useState(makeGrid());

    const playMove = (move: Move) => {
        console.log("playing", move);
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
        if (moveCpt >= bestGame.moves.length) return console.log("max reached");
        playMove(bestGame.moves[moveCpt]);
        setMoveCpt((cpt) => cpt + 1);
    };

    useEffect(() => {
        const interval = setInterval(() => nextMove(), 100);
        return () => clearInterval(interval);
    }, [moveCpt]);

    return (
        <Stack>
            <Box>Generation: {bestGame.generation}</Box>
            <Box>Score: {bestGame.score}</Box>
            <Box>
                Move {moveCpt}/{bestGame.moves.length}
            </Box>
            <TetrisGrid grid={grid} />
        </Stack>
    );
};
