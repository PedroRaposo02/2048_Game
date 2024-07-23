import { createContext, useEffect, useReducer } from "react";
import { NUMBER_OF_COLS, NUMBER_OF_ROWS } from "../constants";
import { GridSize, TileDirection } from "../types";
import {
	ADD_CELL,
	cellReducer,
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
	};

	const [state, dispatch] = useReducer(cellReducer, initialState);

	function addCell() {
		dispatch(ADD_CELL);
	}

	function resetGame() {
		dispatch(RESET_GAME(gridSize));
		dispatch(INITIALIZE_GRID(gridSize));
	}

	function moveTiles(direction: TileDirection) {
		dispatch(MOVE_TILES(direction));
		dispatch(ADD_CELL);
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
