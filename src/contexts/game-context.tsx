import { createContext, useCallback, useEffect, useReducer, useState } from "react";
import { NUMBER_OF_COLS, NUMBER_OF_ROWS } from "../constants";
import { Cell, GridSize, TileDirection } from "../types";
import {
	ADD_CELL,
	cellReducer,
	GAME_OVER,
	GameState,
	INITIALIZE_GRID,
	MOVE_TILES,
	RESET_GAME,
} from "../reducers/game-reducer";

type GameContextType = {
	state: GameState;
	resetGame: () => void;
	gridSize: GridSize;
	addCell(): void;
	moveTiles(direction: TileDirection): void;
};

export const GameContext = createContext<GameContextType>(
	{} as GameContextType
);

function GameProvider({
	children,
	gridSize = { rows: NUMBER_OF_ROWS, columns: NUMBER_OF_COLS },
}: {
	children: React.ReactNode;
	gridSize: GridSize;
}) {
	const initialState = {
		grid: [],
		score: 0,
		bestScore: 0,
		gridSize,
		isGameOver: false
	};

	const [state, dispatch] = useReducer(cellReducer, initialState);
	const [moveInitiated, setMoveInitiated] = useState(false);

	const moveTiles = useCallback((direction: TileDirection) => {
		setMoveInitiated(true);
		dispatch(MOVE_TILES(direction));
	}, []);

	useEffect(() => {
		if (moveInitiated) {
			setMoveInitiated(false);

			if(didCellsMove(state.grid)) {
				dispatch(ADD_CELL);
			}
			if(isGameOver(state)) {
				dispatch(GAME_OVER);
			}
		}
	}, [state.grid, moveInitiated]);

	const didCellsMove = (grid: Cell[]) => {
		for (let cell of grid) {
			if (cell.row != cell.previousPos.row || cell.col != cell.previousPos.col) {
				return true;
			}
		}
		return false;
	}

	function addCell() {
		dispatch(ADD_CELL);
	}

	function resetGame() {
		dispatch(RESET_GAME(gridSize));
		dispatch(INITIALIZE_GRID(gridSize));
	}

	function isGameOver({grid, gridSize}: GameState): boolean {
		
		if (grid.some((cell) => cell.value === 0 || cell.id === "")) {
			return false;
		}
		for (const cell of grid) {
			if (cell.col < gridSize.columns - 1) {
				const rightCell = grid[cell.row * gridSize.rows + cell.col + 1];
				if (rightCell.value === cell.value) {
					return false;
				}
			}
			if (cell.row < gridSize.rows - 1) {
				const bottomCell = grid[(cell.row + 1) * gridSize.rows + cell.col];
				if (bottomCell.value === cell.value) {
					return false;
				}
			}
			if (cell.col > 0) {
				const leftCell = grid[cell.row * gridSize.rows + cell.col - 1];
				if (leftCell.value === cell.value) {
					return false;
				}
			}
			if (cell.row > 0) {
				const topCell = grid[(cell.row - 1) * gridSize.rows + cell.col];
				if (topCell.value === cell.value) {
					return false;
				}
			}
		}
		return true;
	}

	useEffect(() => {
		resetGame();
	}, []);

	const value = {
		state,
		resetGame,
		gridSize,
		addCell,
		moveTiles,
	};

	return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export default GameProvider;
