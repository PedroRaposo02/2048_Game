import { CHANCE_OF_FOUR } from "../constants";
import { Cell, GridSize, TCanMove, TileDirection, TMoved } from "../types";
import { v4 as uuid } from "uuid";

export type GameAction =
	| { type: "ADD_CELL" }
	| { type: "MOVE_TILES"; direction: TileDirection }
	| { type: "UPDATE_CELL"; cell: Cell }
  | { type: "INITIALIZE_GRID"; gridSize: GridSize }
	| { type: "SET_SCORE"; score: number }
	| { type: "SET_BEST_SCORE"; bestScore: number }
	| { type: "ADD_SCORE"; score: number }
	| { type: "RESET_GAME"; gridSize: GridSize }
  | { type: "GAME_OVER" };

export const ADD_CELL: GameAction = ({ type: "ADD_CELL" });
export const MOVE_TILES = (direction: TileDirection): GameAction => ({ type: "MOVE_TILES", direction });
export const UPDATE_CELL = (cell: Cell): GameAction => ({ type: "UPDATE_CELL", cell });
export const INITIALIZE_GRID = (gridSize: GridSize): GameAction => ({ type: "INITIALIZE_GRID", gridSize });
export const SET_SCORE = (score: number): GameAction => ({ type: "SET_SCORE", score });
export const SET_BEST_SCORE = (bestScore: number): GameAction => ({ type: "SET_BEST_SCORE", bestScore });
export const ADD_SCORE = (score: number): GameAction => ({ type: "ADD_SCORE", score });
export const RESET_GAME = (gridSize: GridSize): GameAction => ({ type: "RESET_GAME", gridSize });
export const GAME_OVER: GameAction = ({ type: "GAME_OVER" });

export type GameState = {
	grid: Cell[];
	score: number;
	bestScore: number;
	gridSize: GridSize;
  isGameOver: boolean;
};

const initialState: GameState = {
  grid: [],
  score: 0,
  bestScore: 0,
  gridSize: { rows: 4, columns: 4 },
  isGameOver: false
};

export const cellReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "ADD_CELL":
      const newCell = addTileToGrid(state.grid, state.gridSize);
      
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
      let movedObj : TMoved;
      switch (action.direction) {
        case "up":
          movedObj = moveTilesUp(state);
          break;
        case "down":
          movedObj = moveTilesDown(state);
          break;
        case "left":
          movedObj = moveTilesLeft(state);
          break;
        case "right":
          movedObj = moveTilesRight(state);
          break;
      }

      movedObj.mergedCache.forEach((cell) => {
        state.score += cell.value;
        state.bestScore = Math.max(state.bestScore, state.score);
      });
      return {
        ...state,
        grid: movedObj.grid
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
    case "GAME_OVER":
      state.isGameOver = true;
      if (state.score > state.bestScore) {
        state.bestScore = state.score
      }
      return state;
    default:
      throw new Error("Unknown action type!");
  }
};

function getEmptyCells(currentGrid: Cell[], gridSize: GridSize) : Cell[] {
  let array = [...Array(gridSize.rows * gridSize.columns)]
    .map((_, i) => {
      const row = Math.floor(i / 4);
      const col = i % 4;

      return { row, col, value: 0, id: "", isNew: false, previousPos: {row, col} } as Cell;
    })
    .filter((cell) => {
      return !currentGrid.some((gridCell) => {
        return gridCell.id !== '' && gridCell.value !== 0 && gridCell.row === cell.row && gridCell.col === cell.col;
      });
    });
  return array;
  
} 

function addTileToGrid(grid: Cell[], gridSize: GridSize): Cell {
  const isFour = Math.random() < CHANCE_OF_FOUR;
  let newCell : Cell = { row: 0, col: 0, value: 0, id: "", isNew: false, previousPos: { row: 0, col: 0 } };

  const emptyCells: Cell[] = getEmptyCells(grid, gridSize);

  if (emptyCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    const { row, col } = emptyCells[randomIndex];
    newCell = {
      row,
      col,
      value: isFour ? 4 : 2,
      id: uuid(),
      isNew: true,
      previousPos: { row, col }
    };
  }
  return newCell;
}

function initializeGrid(gridSize: GridSize): Cell[] {
  let newGrid: Cell[] = [];
  let randomNumberOfCells = Math.floor(Math.random() * 2) + 1;
    
  for (let filled = 0; filled < gridSize.rows * gridSize.columns; filled++) {
    if (!newGrid[filled]) {
      let row = Math.floor(filled / gridSize.rows);
      let col = filled % gridSize.columns;
      newGrid[filled] = { row, col, value: 0, id: "", isNew: false, previousPos: { row: 0, col: 0 } };
    }
  }
  for (let i = 0; i < randomNumberOfCells; i++) {
    let newCell = addTileToGrid(newGrid, gridSize)
    newGrid[newCell.row * gridSize.rows + newCell.col] = newCell;
  }

  return newGrid;
}

function moveTilesDown(state: GameState): TMoved {
  let mergedCache = new Set<Cell>();
  let gridCopy = [...state.grid];

  gridCopy = gridCopy.map((cell) => ({
    ...cell,
    previousPos: { row: cell.row, col: cell.col }
  }))

  for (let rowIndex = state.gridSize.rows - 1; rowIndex >= 0; rowIndex--) {
    for (let colIndex = 0; colIndex < state.gridSize.columns; colIndex++) {
      if(!gridCopy[rowIndex * state.gridSize.rows + colIndex]) {
        continue;
      }
      let currentCell = gridCopy[rowIndex * state.gridSize.rows + colIndex];

      if (!currentCell.value || currentCell.value === 0 || currentCell.id === "") {
        continue;
      }

      currentCell.isNew = false;
      
      const canMoveCell = canMove(gridCopy, state.gridSize, currentCell, "down", mergedCache);
      unassignCell(rowIndex, colIndex, gridCopy, state.gridSize);
      const newRowIndex = rowIndex + canMoveCell.spaces;
      currentCell = {
        ...currentCell,
        value: canMoveCell.merge ? currentCell.value * 2 : currentCell.value,
        row: newRowIndex,
        previousPos: { row: rowIndex, col: colIndex }
      };
      gridCopy[newRowIndex * state.gridSize.rows + colIndex] = currentCell;
      if (canMoveCell.merge) {
        mergedCache.add(currentCell);
      }
    }
  }
  return {
    grid: gridCopy,
    mergedCache: mergedCache
  };
}

function moveTilesUp(state: GameState): TMoved {
  let mergedCache = new Set<Cell>();
  let gridCopy = [...state.grid];

  gridCopy = gridCopy.map((cell) => ({
    ...cell,
    previousPos: { row: cell.row, col: cell.col }
  }))

  for (let rowIndex = 0; rowIndex < state.gridSize.rows; rowIndex++) {
    for (let colIndex = 0; colIndex < state.gridSize.columns; colIndex++) {
      if(!gridCopy[rowIndex * state.gridSize.rows + colIndex]) {
        continue;
      }
      let currentCell = gridCopy[rowIndex * state.gridSize.rows + colIndex];

      if (!currentCell.value || currentCell.value === 0 || currentCell.id === "") {
        continue;
      }

      currentCell.isNew = false;
      
      const canMoveCell = canMove(gridCopy, state.gridSize, currentCell, "up", mergedCache);
      unassignCell(rowIndex, colIndex, gridCopy, state.gridSize);
      const newRowIndex = rowIndex - canMoveCell.spaces;
      currentCell = {
        ...currentCell,
        value: canMoveCell.merge ? currentCell.value * 2 : currentCell.value,
        row: newRowIndex,
        previousPos: { row: rowIndex, col: colIndex }
      };
      gridCopy[newRowIndex * state.gridSize.rows + colIndex] = currentCell;
      if (canMoveCell.merge) {
        mergedCache.add(currentCell);
      }
    }
  }

  return {
    grid: gridCopy,
    mergedCache: mergedCache
  };
}

function moveTilesLeft(state: GameState): TMoved {
  let mergedCache = new Set<Cell>();
  let gridCopy = [...state.grid];

  gridCopy = gridCopy.map((cell) => ({
    ...cell,
    previousPos: { row: cell.row, col: cell.col }
  }))

  for (let colIndex = 0; colIndex < state.gridSize.columns; colIndex++) {
    for (let rowIndex = 0; rowIndex < state.gridSize.rows; rowIndex++) {
      if(!gridCopy[rowIndex * state.gridSize.rows + colIndex]) {
        continue;
      }
      let currentCell = gridCopy[rowIndex * state.gridSize.rows + colIndex];

      if (!currentCell.value || currentCell.value === 0 || currentCell.id === "") {
        continue;
      }

      currentCell.isNew = false;
      
      const canMoveCell = canMove(gridCopy, state.gridSize, currentCell, "left", mergedCache);
      unassignCell(rowIndex, colIndex, gridCopy, state.gridSize);
      const newColIndex = colIndex - canMoveCell.spaces;
      currentCell = {
        ...currentCell,
        value: canMoveCell.merge ? currentCell.value * 2 : currentCell.value,
        col: newColIndex,
        previousPos: { row: rowIndex, col: colIndex }
      };
      gridCopy[rowIndex * state.gridSize.rows + newColIndex] = currentCell;
      if (canMoveCell.merge) {
        mergedCache.add(currentCell);
      }
    }
  }

  return {
    grid: gridCopy,
    mergedCache: mergedCache
  };
}

function moveTilesRight(state: GameState): TMoved {
  let mergedCache = new Set<Cell>();
  let gridCopy = [...state.grid];

  gridCopy = gridCopy.map((cell) => ({
    ...cell,
    previousPos: { row: cell.row, col: cell.col }
  }))

  for (let colIndex = state.gridSize.columns - 1; colIndex >= 0; colIndex--) {
    for (let rowIndex = 0; rowIndex < state.gridSize.rows; rowIndex++) {
      if(!gridCopy[rowIndex * state.gridSize.rows + colIndex]) {
        continue;
      }
      let currentCell = gridCopy[rowIndex * state.gridSize.rows + colIndex];

      if (!currentCell.value || currentCell.value === 0 || currentCell.id === "") {
        continue;
      }

      currentCell.isNew = false;
      
      const canMoveCell = canMove(gridCopy, state.gridSize, currentCell, "right", mergedCache);
      unassignCell(rowIndex, colIndex, gridCopy, state.gridSize);
      const newColIndex = colIndex + canMoveCell.spaces;
      currentCell = {
        ...currentCell,
        value: canMoveCell.merge ? currentCell.value * 2 : currentCell.value,
        col: newColIndex,
        previousPos: { row: rowIndex, col: colIndex }
      };
      gridCopy[rowIndex * state.gridSize.rows + newColIndex] = currentCell;
      if (canMoveCell.merge) {
        mergedCache.add(currentCell);
      }
    }
  }

  return {
    grid: gridCopy,
    mergedCache: mergedCache
  };
}

function unassignCell(row: number, col: number, grid: Cell[], gridSize: GridSize) {
  grid[row * gridSize.rows + col] = { row, col, value: 0, id: "", previousPos : { row, col }, isNew: false };
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

  if (cell.row === 0) {
    return canMove;
  }
  let sameNumber = 0;

  for (let rowIndex = cell.row - 1; rowIndex >= 0; rowIndex--) {
    const currentCell = grid[rowIndex * gridSize.rows + cell.col];

    if (!currentCell) {
      canMove.spaces++;
      continue;
    }
    if (mergedCache.has(currentCell)) {
      break;
    }

    if ((currentCell.value === 0 || currentCell.value === cell.value) && currentCell.id !== cell.id ) {
      canMove.spaces++;
      if (currentCell.value === cell.value) {
        sameNumber++;
      }
    } else {
      break;
    }
  }
  if (sameNumber % 2 === 1) {
    canMove.merge = true;
  }
  return canMove;
}

function canMoveLeft(grid: Cell[], gridSize: GridSize, cell: Cell, mergedCache: Set<Cell>): TCanMove {
  let canMove: TCanMove = { spaces: 0, merge: false };

  if (cell.col === 0) {
    return canMove;
  }
  let sameNumber = 0;

  for (let colIndex = cell.col - 1; colIndex >= 0; colIndex--) {
    const currentCell = grid[cell.row * gridSize.rows + colIndex];

    if (!currentCell) {
      canMove.spaces++;
      continue;
    }
    if (mergedCache.has(currentCell)) {
      break;
    }

    if ((currentCell.value === 0 || currentCell.value === cell.value) && currentCell.id !== cell.id ) {
      canMove.spaces++;
      if (currentCell.value === cell.value) {
        sameNumber++;
      }
    } else {
      break;
    }
  }
  if (sameNumber % 2 === 1) {
    canMove.merge = true;
  }
  return canMove;
}

function canMoveRight(grid: Cell[], gridSize: GridSize, cell: Cell, mergedCache: Set<Cell>): TCanMove {
  let canMove: TCanMove = { spaces: 0, merge: false };

  if (cell.col === gridSize.columns - 1) {
    return canMove;
  }
  let sameNumber = 0;

  for (let colIndex = cell.col + 1; colIndex < gridSize.columns; colIndex++) {
    const currentCell = grid[cell.row * gridSize.rows + colIndex];

    if (!currentCell) {
      canMove.spaces++;
      continue;
    }
    if (mergedCache.has(currentCell)) {
      break;
    }

    if ((currentCell.value === 0 || currentCell.value === cell.value) && currentCell.id !== cell.id ) {
      canMove.spaces++;
      if (currentCell.value === cell.value) {
        sameNumber++;
      }
    } else {
      break;
    }
  }
  if (sameNumber % 2 === 1) {
    canMove.merge = true;
  }
  return canMove;
}