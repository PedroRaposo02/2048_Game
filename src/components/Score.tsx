import useGame from "../hooks/useGame";

const Score = () => {
  const {state} = useGame();

  return (
    <div className="font-body flex items-center justify-center gap-1 w-full child:px-5 child:pt-2 child:pb-1">
      <div className="bg-grid_color flex items-center justify-center flex-col rounded-md">
        <p className="text-cell2_color font-semibold text-[12px]">SCORE</p>
        <p className="font-bold text-background_color text-2xl">{state.score}</p>
      </div>
      <div className="bg-grid_color flex items-center justify-center flex-col rounded-md">
        <p className="text-cell2_color font-semibold text-[12px]">BEST</p>
        <p className="font-bold text-background_color text-2xl">{state.bestScore}</p>
      </div>
    </div>
  );
};

export default Score;
