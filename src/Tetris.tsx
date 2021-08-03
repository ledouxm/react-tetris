import { Flex, Square } from "@chakra-ui/react";
import { makeArrayOf } from "@pastable/core";
import { EMPTY_CELL, Grid } from "./utils";

export const makeLine = () => makeArrayOf(10).map(() => EMPTY_CELL);
export const makeGrid = () => makeArrayOf(20).map(makeLine);

export const TetrisGrid = ({ grid }: { grid?: Grid }) => {
    return (
        <Flex direction="column">
            {(grid || makeGrid()).map((row, x) => (
                <Flex key={x}>
                    {row.map((cell, y) => (
                        <Square
                            key={y}
                            size="30px"
                            bgColor={colorByPieceName[cell]}
                            color="black"
                            border="1px solid black"
                        ></Square>
                    ))}
                </Flex>
            ))}
        </Flex>
    );
};

const colorByPieceName: Record<string, string> = {
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
