import { createContext, useEffect, useState } from "react";
import { NUMBER_OF_CELLS } from "../constants";

type TileDirection = "up" | "down" | "left" | "right";
type TCanMove = {
	merge: boolean;
	spaces: number;
};

type Cell = { row: number; col: number; number: number };
type Tile = {
  row: number;
  col: number;
  number: number;
  id: string;
}

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
	resetGame: (numberOfCells?: number) => void;
};

export const GameContext = createContext<GameContextType>(
	{} as GameContextType
);

function GameProvider({ children }: { children: React.ReactNode }) {
	const [score, setScore] = useState(0);
	const [bestScore, setBestScore] = useState(0);
	const [grid, setGrid] = useState<number[][]>(Array(NUMBER_OF_CELLS).fill(Array(NUMBER_OF_CELLS).fill(0)));

	const chanceOfFour = 0.1; // 10% chance of spawning a 4

	let emptyCells: Cell[] = grid
		.map((row, rowIndex) => {
			return row.map((cell, colIndex) => {
				if (cell === 0 || cell === undefined) {
					return { row: rowIndex, col: colIndex, number: 0 };
				}
			});
		})
		.flat()
		.filter((cell) => cell !== undefined) as Cell[];

  
	function addTileToGrid(grid: number[][]): void {
		const isFour = Math.random() < chanceOfFour;

		if (emptyCells.length > 0) {
			const randomIndex = Math.floor(Math.random() * emptyCells.length);
      
			const { row, col } = emptyCells[randomIndex];
			const newGrid = [...grid];
			newGrid[row][col] = isFour ? 4 : 2;
			setGrid(newGrid);
		}
	}

	function initializeGrid(numberOfCells?: number): number[][] {
		numberOfCells = numberOfCells || NUMBER_OF_CELLS;
		let newGrid = Array.from({ length: numberOfCells }, () =>
			Array(numberOfCells).fill(0)
		);

		let randomNumberOfCells = Math.floor(Math.random() * 2) + 1;    
		for (let i = 0; i < randomNumberOfCells; i++) {
			addTileToGrid(newGrid);
		}

		return newGrid;
	}

	function addTile() {
		addTileToGrid(grid);
	}

	function canMoveDown(grid: number[][], cell: Cell): TCanMove {
		let canMove: TCanMove = { spaces: 0, merge: false };

		if (cell.row == grid.length - 1) {
			return canMove;
		}
		let sameNumber = 0;

		for (let rowIndex = cell.row + 1; rowIndex < grid.length; rowIndex++) {
			const currentCell = grid[rowIndex][cell.col];
			if (currentCell == 0 || currentCell == cell.number) {
				canMove.spaces++;
				if (currentCell == cell.number) {
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

	function canMoveUp(grid: number[][], cell: Cell): TCanMove {
		let canMove: TCanMove = { spaces: 0, merge: false };

		if (cell.row == 0) {
			return canMove;
		}
		let sameNumber = 0;

		for (let rowIndex = cell.row - 1; rowIndex >= 0; rowIndex--) {
			const currentCell = grid[rowIndex][cell.col];
			if (currentCell == 0 || currentCell == cell.number) {
				canMove.spaces++;
				if (currentCell == cell.number) {
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
	function canMoveLeft(grid: number[][], cell: Cell): TCanMove {
		throw new Error("Function not implemented.");
	}
	function canMoveRight(grid: number[][], cell: Cell): TCanMove {
		throw new Error("Function not implemented.");
	}

	function canMove(
		grid: number[][],
		cell: Cell,
		direction: TileDirection
	): TCanMove {
		switch (direction) {
			case "up":
				return canMoveUp(grid, cell);
			case "down":
				return canMoveDown(grid, cell);
			case "left":
				return canMoveLeft(grid, cell);
			case "right":
				return canMoveRight(grid, cell);
		}
	}

	function moveTilesDown() {
		let gridCopy = [...grid];

		for (let rowIndex = grid.length - 1; rowIndex >= 0; rowIndex--) {
			for (let colIndex = 0; colIndex < grid[rowIndex].length; colIndex++) {
				const currentCell = {
					row: rowIndex,
					col: colIndex,
					number: grid[rowIndex][colIndex],
				} as Cell;
        
        if (currentCell.number === 0) {
          continue;
        }
				const canMoveCell = canMove(gridCopy, currentCell, "down");
				gridCopy[rowIndex + canMoveCell.spaces][colIndex] = canMoveCell.merge
					? currentCell.number * 2
					: currentCell.number;
        if (canMoveCell.spaces > 0) {
          gridCopy[rowIndex][colIndex] = 0;
        }
			}
		}

    setGrid(gridCopy);
	}

	function moveTilesUp() {
		let gridCopy = [...grid];

		for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
			for (let colIndex = 0; colIndex < grid[rowIndex].length; colIndex++) {
				const currentCell = {
					row: rowIndex,
					col: colIndex,
					number: grid[rowIndex][colIndex],
				} as Cell;
        
        if (currentCell.number === 0) {
          continue;
        }
				const canMoveCell = canMove(gridCopy, currentCell, "up");
				gridCopy[rowIndex - canMoveCell.spaces][colIndex] = canMoveCell.merge
					? currentCell.number * 2
					: currentCell.number;
        if (canMoveCell.spaces > 0) {
          gridCopy[rowIndex][colIndex] = 0;
        }
			}
		}

    setGrid(gridCopy);
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
				moveTilesLeft();
				break;
			case "right":
				moveTilesRight();
				break;
		}
	}

	function checkGameOver(): boolean {
		throw new Error("Function not implemented.");
	}

	function resetGame(numberOfCells?: number) {
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
		resetGame,
	};

	return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export default GameProvider;
