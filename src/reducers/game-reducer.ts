import { CHANCE_OF_FOUR } from "../constants";
import { Cell, GridSize, TCanMove, TileDirection } from "../types";
import { v4 as uuid } from "uuid";

export type GameAction =
	| { type: "ADD_CELL" }
	| { type: "MOVE_TILES"; direction: TileDirection }
	| { type: "UPDATE_CELL"; cell: Cell }
  | { type: "INITIALIZE_GRID"; gridSize: GridSize }
	| { type: "SET_SCORE"; score: number }
	| { type: "SET_BEST_SCORE"; bestScore: number }
	| { type: "ADD_SCORE"; score: number }
	| { type: "RESET_GAME"; gridSize: GridSize };

export const ADD_CELL: GameAction = ({ type: "ADD_CELL" });
export const MOVE_TILES = (direction: TileDirection): GameAction => ({ type: "MOVE_TILES", direction });
export const UPDATE_CELL = (cell: Cell): GameAction => ({ type: "UPDATE_CELL", cell });
export const INITIALIZE_GRID = (gridSize: GridSize): GameAction => ({ type: "INITIALIZE_GRID", gridSize });
export const SET_SCORE = (score: number): GameAction => ({ type: "SET_SCORE", score });
export const SET_BEST_SCORE = (bestScore: number): GameAction => ({ type: "SET_BEST_SCORE", bestScore });
export const ADD_SCORE = (score: number): GameAction => ({ type: "ADD_SCORE", score });
export const RESET_GAME = (gridSize: GridSize): GameAction => ({ type: "RESET_GAME", gridSize });

export type GameState = {
	grid: Cell[];
	score: number;
	bestScore: number;
	gridSize: GridSize;
};

const initialState: GameState = {
  grid: [],
  score: 0,
  bestScore: 0,
  gridSize: { rows: 4, columns: 4 },
};

export const cellReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "ADD_CELL":
      const newCell = addTileToGrid(state.grid, state.gridSize);
      console.log(newCell);
      
      if (newCell.value === 0) {
        return state;
      }
      const updatedGrid = [...state.grid];
      updatedGrid[newCell.row * state.gridSize.rows + newCell.col] = newCell;
      
      return {
        ...state,
        grid: updatedGrid,
      };
    case "MOVE_TILES":
      let movedGrid;
      switch (action.direction) {
        case "up":
          movedGrid = moveTilesUp(state);
          break;
        case "down":
          movedGrid = moveTilesDown(state);
          break;
        case "left":
          movedGrid = moveTilesLeft(state);
          break;
        case "right":
          movedGrid = moveTilesRight(state);
          break;
      }
      return {
        ...state,
        grid: movedGrid
      };
    case "UPDATE_CELL":
      let cell = state.grid.find((cell) => cell.id === action.cell.id);
      if (cell) {
        return {
          ...state,
          grid: state.grid.map((cell) =>
            cell.id === action.cell.id ? action.cell : cell
          )
        }
      }
      return state;
    case "INITIALIZE_GRID":
      const newGrid = initializeGrid(action.gridSize);
      return { ...initialState, gridSize: action.gridSize, grid: newGrid };
    case "SET_SCORE":
      return { ...state, score: action.score };
    case "SET_BEST_SCORE":
      return { ...state, bestScore: action.bestScore };
    case "ADD_SCORE":
      return { ...state, score: state.score + action.score };
    case "RESET_GAME":
      return { ...initialState, gridSize: state.gridSize };
    default:
      throw new Error("Unknown action type!");
  }
};

function getEmptyCells(currentGrid: Cell[], gridSize: GridSize) : Cell[] {
  console.log("Current", currentGrid);
  let array = [...Array(gridSize.rows * gridSize.columns)]
    .map((_, i) => {
      const row = Math.floor(i / 4);
      const col = i % 4;

      return { row, col, value: 0, id: "" } as Cell;
    })
    .filter((cell) => {
      return !currentGrid.some((gridCell) => {
        return gridCell.id !== '' && gridCell.value !== 0 && gridCell.row === cell.row && gridCell.col === cell.col;
      });
    });
  console.log("empty", array);
  return array;
  
} 

function addTileToGrid(grid: Cell[], gridSize: GridSize): Cell {
  const isFour = Math.random() < CHANCE_OF_FOUR;
  let newCell : Cell = { row: 0, col: 0, value: 0, id: "" };

  const emptyCells: Cell[] = getEmptyCells(grid, gridSize);

  if (emptyCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    const { row, col } = emptyCells[randomIndex];
    newCell = {
      row,
      col,
      value: isFour ? 4 : 2,
      id: uuid()
    };
  }
  return newCell;
}

function initializeGrid(gridSize: GridSize): Cell[] {
  let newGrid: Cell[] = [];
  let randomNumberOfCells = Math.floor(Math.random() * 2) + 1;
  for (let i = 0; i < randomNumberOfCells; i++) {
    let newCell = addTileToGrid(newGrid, gridSize)
    newGrid[newCell.row * gridSize.rows + newCell.col] = newCell;
  }

  return newGrid;
}

function moveTilesDown(state: GameState): Cell[] {
  let mergedCache = new Set<Cell>();
  let gridCopy = [...state.grid];
  
  for (let filled = 0; filled < state.gridSize.rows * state.gridSize.columns; filled++) {
    if (!gridCopy[filled]) {
      let row = Math.floor(filled / state.gridSize.rows);
      let col = filled % state.gridSize.columns;
      gridCopy[filled] = { row, col, value: 0, id: "" };
    }
  }

  for (let rowIndex = state.gridSize.rows - 1; rowIndex >= 0; rowIndex--) {
    for (let colIndex = 0; colIndex < state.gridSize.columns; colIndex++) {
      if(!gridCopy[rowIndex * state.gridSize.rows + colIndex]) {
        continue;
      }
      let currentCell = gridCopy[rowIndex * state.gridSize.rows + colIndex];

      if (!currentCell.value || currentCell.value === 0 || !currentCell.id || currentCell.id === "") {
        continue;
      }
      
      const canMoveCell = canMove(gridCopy, state.gridSize, currentCell, "down", mergedCache);
      unassignCell(rowIndex, colIndex, gridCopy, state.gridSize);
      const newRowIndex = rowIndex + canMoveCell.spaces;
      currentCell = {
        ...currentCell,
        value: canMoveCell.merge ? currentCell.value * 2 : currentCell.value,
        row: newRowIndex,
      };
      gridCopy[newRowIndex * state.gridSize.rows + colIndex] = currentCell;
      if (canMoveCell.merge) {
        mergedCache.add(currentCell);
      }
    }
  }

  return gridCopy;
}

function unassignCell(row: number, col: number, grid: Cell[], gridSize: GridSize) {
  grid[row * gridSize.rows + col] = { row, col, value: 0, id: "" };
}

function canMove(
  grid: Cell[],
  gridSize: GridSize,
  cell: Cell,
  direction: TileDirection,
  mergedCache: Set<Cell>
): TCanMove {
  switch (direction) {
    case "up":
      return canMoveUp(grid, gridSize, cell, mergedCache);
    case "down":
      return canMoveDown(grid, gridSize, cell, mergedCache);
    case "left":
      return canMoveLeft(grid, gridSize, cell, mergedCache);
    case "right":
      return canMoveRight(grid, gridSize, cell, mergedCache);
  }
}

function canMoveDown(grid: Cell[], gridSize: GridSize, cell: Cell, mergedCache: Set<Cell>): TCanMove {
  let canMove: TCanMove = { spaces: 0, merge: false };

  if (cell.row == gridSize.rows - 1) {
    return canMove;
  }
  let sameNumber = 0;

  for (let rowIndex = cell.row + 1; rowIndex < gridSize.rows; rowIndex++) {
    const currentCell = grid[rowIndex * gridSize.rows + cell.col];

    if (!currentCell) {
      canMove.spaces++;
      continue;
    }
    if (mergedCache.has(currentCell)) {
      break;
    }

    if ((currentCell.value == 0 || currentCell.value == cell.value) && currentCell.id !== cell.id ) {
      canMove.spaces++;
      if (currentCell.value == cell.value) {
        sameNumber++;
      }
    } else {
      break;
    }
  }
  if (sameNumber % 2 == 1) {
    canMove.merge = true;
  }
  return canMove;
}

function canMoveUp(grid: Cell[], gridSize: GridSize, cell: Cell, mergedCache: Set<Cell>): TCanMove {
  let canMove: TCanMove = { spaces: 0, merge: false };

  if (cell.row == 0) {
    return canMove;
  }
  let sameNumber = 0;

  for (let rowIndex = cell.row - 1; rowIndex >= 0; rowIndex--) {
    const currentCell = grid[rowIndex][cell.col];
    if (currentCell == 0 || currentCell == cell.value) {
      canMove.spaces++;
      if (currentCell == cell.value) {
        sameNumber++;
      }
    } else {
      break;
    }
  }
  if (sameNumber % 2 == 1) {
    canMove.merge = true;
  }
  return canMove;
}
function canMoveLeft(grid: Cell[], gridSize: GridSize, cell: Cell, mergedCache: Set<Cell>): TCanMove {
  throw new Error("Function not implemented.");
}
function canMoveRight(grid: Cell[], gridSize: GridSize, cell: Cell, mergedCache: Set<Cell>): TCanMove {
  throw new Error("Function not implemented.");
}

/* 
	

	

	function testMoveLeft() {
		grid.map((cell, _) => {
			cell.col = cell.col - 1;
		});
	}

	function moveTilesDown() {
		let mergedCache = new Set<Cell>();
		let gridCopy = [...grid];

		for (let rowIndex = gridSize.rows - 1; rowIndex >= 0; rowIndex--) {
			for (let colIndex = 0; colIndex < gridSize.columns; colIndex++) {
				let currentCell = {
					row: rowIndex,
					col: colIndex,
					value: grid[rowIndex * gridSize.rows + colIndex].value,
				} as Cell;

				if (currentCell.value === 0) {
					continue;
				}
				const canMoveCell = canMove(gridCopy, currentCell, "down", mergedCache);
				currentCell = {
					...currentCell,
					value: canMoveCell.merge ? currentCell.value * 2 : currentCell.value,
					row: rowIndex + canMoveCell.spaces,
				};
				if (canMoveCell.merge) {
					mergedCache.add(currentCell);
				}
			}
		}

		setGrid(gridCopy);
	}

	function moveTilesUp() {
		let gridCopy = [...grid]; */

		/* for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
			for (let colIndex = 0; colIndex < grid[rowIndex].length; colIndex++) {
				const currentCell = {
					row: rowIndex,
					col: colIndex,
					value: grid[rowIndex][colIndex],
				} as Cell;

				if (currentCell.value === 0) {
					continue;
				}
				const canMoveCell = canMove(gridCopy, currentCell, "up");
				gridCopy[rowIndex - canMoveCell.spaces][colIndex] = canMoveCell.merge
					? currentCell.value * 2
					: currentCell.value;
				if (canMoveCell.spaces > 0) {
					gridCopy[rowIndex][colIndex] = 0;
				}
			}
		} */

/* 		setGrid(gridCopy);
	}

	function moveTilesLeft() {
		throw new Error("Function not implemented.");
	}
	function moveTilesRight() {
		throw new Error("Function not implemented.");
	}

	function moveTiles(direction: TileDirection) {
		switch (direction) {
			case "down":
				moveTilesDown();
				break;
			case "up":
				moveTilesUp();
				break;
			case "left":
				// moveTilesLeft();
				testMoveLeft();
				break;
			case "right":
				moveTilesRight();
				break;
		}
	}

	function checkGameOver(): boolean {
		throw new Error("Function not implemented.");
	} */