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

export type Cell = { row: number; col: number; value: number; id: string };