import useGame from "../hooks/useGame";

const NewGameButton = () => {
	const { resetGame, gridSize } = useGame();

	function handleNewGame() {
		resetGame();
	}

	return (
		<button
			className="bg-new_game_color text-background_color font-semibold rounded-md w-fit px-[7px] py-1 mt-2"
			onClick={handleNewGame}
		>
			New Game
		</button>
	);
};

export default NewGameButton;
