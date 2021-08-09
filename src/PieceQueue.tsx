import { Stack, Box } from "@chakra-ui/react";
import { Game } from "./game/game";
import { BasePiece } from "./game/utils";
import { colorByPieceName } from "./utils";

const pieceItemSize = 20;
const pieceItemContainerSize = pieceItemSize * 3;

export const PieceQueue = ({ queue }: { queue: Game["queue"] }) => (
    <Stack>
        {queue.map((piece, index) => (
            <PieceItem key={index} piece={piece} />
        ))}
    </Stack>
);

const PieceItem = ({ piece }: { piece: BasePiece }) => {
    const cells = piece.cells.map((coord) => ({
        x: coord.x + 1,
        y: coord.y + 1,
    }));

    return (
        <Box position="relative" boxSize={`${pieceItemContainerSize}px`}>
            {cells.map((coord, index) => (
                <Box
                    key={index}
                    boxSize={`${pieceItemSize}px`}
                    pos="absolute"
                    bgColor={colorByPieceName[piece.name]}
                    top={`${pieceItemSize * coord.x}px`}
                    left={`${pieceItemSize * coord.y}px`}
                    border="1px solid black"
                ></Box>
            ))}
        </Box>
    );
};
