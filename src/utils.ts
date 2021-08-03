export const clone = (obj: any) => JSON.parse(JSON.stringify(obj));
export const EMPTY_CELL = "*";
export const CURRENT_CELL = "#";

export type Grid = string[][];
