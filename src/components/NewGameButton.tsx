import React from "react";
import useGame from "../hooks/useGame";

const NewGameButton = () => {
	const { resetGame } = useGame();

	function handleNewGame() {
		resetGame();
	}

	return (
		<button
			className="bg-new_game_color text-background_color font-semibold rounded-md w-fit px-[7px] py-1"
			onClick={handleNewGame}
		>
			New Game
		</button>
	);
};

export default NewGameButton;
