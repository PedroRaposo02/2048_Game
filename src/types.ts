export type GridSize = {
  rows: number,
  columns: number
}

// Game Types
export type TileDirection = "up" | "down" | "left" | "right";

export type TCanMove = {
	merge: boolean;
	spaces: number;
};
type TPosition = {
  row: number;
  col: number;
}

export type TMoved = {
  mergedCache: Set<Cell>;
  grid: Cell[];
}

export type Cell = { row: number; col: number; value: number; id: string; isNew: boolean, previousPos: TPosition };