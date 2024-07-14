import { createContext, useEffect, useState } from "react";
import { NUMBER_OF_CELLS } from "../constants";

type TileDirection = 'up' | 'down' | 'left' | 'right';

type GameContextType = {
  score: number;
  setScore: (score: number) => void;
  bestScore: number;
  setBestScore: (bestScore: number) => void;
  grid: number[][];
  setGrid: (grid: number[][]) => void;
  addTile: () => void;
  moveTiles: (direction: TileDirection) => void;
  checkGameOver: () => boolean;
  resetGame: (numberOfCells? : number) => void;
}

export const GameContext = createContext<GameContextType>({} as GameContextType);

function GameProvider({ children }: { children: React.ReactNode }) {
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [grid, setGrid] = useState<number[][]>([]);

  function addTileToGrid(grid: number[][]): void {
    const emptyCells: { row: number; col: number }[] = [];
    grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];
      const newGrid = [...grid];
      newGrid[row][col] = 2;
      setGrid(newGrid);
    }
  }

  function initializeGrid(numberOfCells? : number) {
    numberOfCells = numberOfCells || NUMBER_OF_CELLS;
    let newGrid = Array.from({ length: numberOfCells }, () => Array(numberOfCells).fill(0));
    addTileToGrid(newGrid);
    addTileToGrid(newGrid);

    return newGrid;
  }

  function addTile() {
    addTileToGrid(grid);
  }

  function moveTiles(direction: TileDirection) {
    throw new Error("Function not implemented.");
  }

  function checkGameOver() : boolean {
    throw new Error("Function not implemented.");
  }

  function resetGame(numberOfCells? : number) {
    setScore(0);
    setGrid(initializeGrid(numberOfCells));
  }

  useEffect(() => {
    resetGame();
  }, []);

  const value = {
    score,
    setScore,
    bestScore,
    setBestScore,
    grid,
    setGrid,
    addTile,
    moveTiles,
    checkGameOver,
    resetGame
  }

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export default GameProvider;