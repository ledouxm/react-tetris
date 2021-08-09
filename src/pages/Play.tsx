import { Game } from "@/game/game";
import { makeGrid, TetrisGrid } from "@/Tetris";
import { Stack } from "@chakra-ui/react";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export const PlayGame = () => {
    const [grid, setGrid] = useState(makeGrid());
    const gameRef = useRef(new Game());

    const game = gameRef.current;
    useEffect(() => {
        gameRef.current.start((game) => setGrid(game.grid));
    }, []);

    useHotkeys("q", () => game.moveLeft());
    useHotkeys("d", () => game.moveRight());
    useHotkeys("s", () => void game.dropPiece());
    useHotkeys("r", () => game.rotate());

    return (
        <Stack>
            <TetrisGrid grid={grid} />
        </Stack>
    );
};
