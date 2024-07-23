import classNames from "classnames";
import { useEffect, useState } from "react";
import useGame from "../hooks/useGame";
import { cellColor } from "../constants";
import { Cell, GridSize } from "../types";

const Game = () => {
	let cellSize = 100;

	const { state, addCell, gridSize, moveTiles } = useGame();

	const [isKeyPressed, setIsKeyPressed] = useState(false);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isKeyPressed) {
				setIsKeyPressed(true);
				if (e.key === "ArrowUp" || e.key === "w") {
					moveTiles("up");
				} else if (e.key === "ArrowDown" || e.key === "s") {
					moveTiles("down");
				} else if (e.key === "ArrowLeft" || e.key === "a") {
					moveTiles("left");
				} else if (e.key === "ArrowRight" || e.key === "d") {
					moveTiles("right");
				}
			}
		};

		const handleKeyUp = () => {
			setIsKeyPressed(false);
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [isKeyPressed, moveTiles]);

	const handleAddTile = () => {
		addCell();
	};

	const renderEmptyGrid = (grid: GridSize) => {
		return [...Array(grid.rows * grid.columns)].map((_, i) => (
			<div
				key={i}
				className={classNames(
					cellColor(0),
					"text-center font-bold",
					"rounded-md",
					"flex",
					"items-center",
					"justify-center"
				)}
				style={{
					width: `${cellSize}px`,
					height: `${cellSize}px`,
				}}
			/>
		));
	};

	const renderGameGrid = (grid: Cell[]) => {
		const renderableGrid = grid.filter(
			(cell) =>
				cell &&
				cell.value &&
				cell.value !== 0 &&
				cell.value !== null &&
				cell.id &&
				cell.id !== ""
		);
		return renderableGrid.map((cell, i) => (
			<div
				key={cell.id}
				className={classNames(
					cellColor(cell.value),
					"absolute",
					"text-center font-bold",
					"rounded-md",
					"flex",
					"items-center",
					"justify-center",
					"transition-all"
				)}
				style={{
					width: `${cellSize}px`,
					height: `${cellSize}px`,
					top: `${cell.row * (cellSize + 16) + 16}px`,
					left: `${cell.col * (cellSize + 16) + 16}px`,
				}}
			>
				{cell.value !== 0 && cell.value}
			</div>
		));
	};

	return (
		<div className="relative grid grid-cols-4 grid-rows-4 content-center bg-grid_color aspect-square text-5xl p-4 rounded-md gap-4">
			{renderEmptyGrid(gridSize)}
			{renderGameGrid(state.grid)}
			{/* <button className="bg-black w-40 h-20" onClick={handleAddTile}>addTile</button> */}
		</div>
	);
};

export default Game;
