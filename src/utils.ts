export const clone = (obj: any) => JSON.parse(JSON.stringify(obj));
export const EMPTY_CELL = "*";
export const CURRENT_CELL = "#";

export type Grid = string[][];

export const colorByPieceName: Record<string, string> = {
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
