import { IoMdSettings } from "react-icons/io";
import "./App.css";
import Game from "./components/Game";
import Title from "./components/Title";
import Score from "./components/Score";
import NewGameButton from "./components/NewGameButton";
import GameProvider from "./contexts/game-context";

function App() {
	return (
		<main className="h-full w-screen bg-background_color text-text_color flex flex-col items-center justify-center">
			<p className="fixed opacity-65 bg-cell1_color text-background_color rounded-bl-md px-5 py-1 text-center font-bold text-[12px] top-0 right-0 font-sans cursor-pointer">
				Send Feedback
			</p>
			<div className="fixed top-[78%] left-0 text-center rounded-r-md p-[5px] flex items-center justify-center bg-grid_color">
				<IoMdSettings className=" text-background_color" />
			</div>
			<GameProvider>
				<div className="h-full w-[500px] flex flex-col items-center justify-center gap-5 my-10">
					<div className="flex w-full justify-between items-center">
						<Title />
						<div className="flex flex-col gap-5">
							<Score />
							<div className="flex items-center justify-end">
								<NewGameButton />
							</div>
						</div>
					</div>
					<Game />
					<div className="flex flex-col">
						<span>
							<span className="font-bold">HOW TO PLAY: </span>
							Use your <span className="font-bold">arrow keys</span> to move the
							tiles. When two tiles with the same number touch, they{" "}
							<span className="font-bold">merge into one!</span> Add them up to
							reach <span className="font-bold">2048! </span>
						</span>
						<p className="underline font-bold">
							Start playing <span className="text-lg">→</span>
						</p>
					</div>
					<div className="flex flex-col mt-96">
						<p className="">
							You're playing a <span className="font-bold">clone of the 2048 game.</span> The original game was
							created by  <span className="font-bold">Gabriele Cirulli.</span> You can find the original game at <a className="font-bold underline" href="https://play2048.co/">play2048.co</a>.
						</p>
					</div>
				</div>
			</GameProvider>
		</main>
	);
}

export default App;
