import useGame from "../hooks/useGame";

const Score = () => {
  const {score, bestScore} = useGame();

  return (
    <div className="font-body flex items-center justify-center gap-1 w-full child:px-5 child:pt-2">
      <div className="bg-grid_color flex items-center justify-center flex-col rounded-md">
        <p className="text-cell2_color font-semibold text-[12px]">SCORE</p>
        <p className="font-bold text-background_color text-2xl">{score}</p>
      </div>
      <div className="bg-grid_color flex items-center justify-center flex-col rounded-md">
        <p className="text-cell2_color font-semibold text-[12px]">BEST</p>
        <p className="font-bold text-background_color text-2xl">{bestScore}</p>
      </div>
    </div>
  );
};

export default Score;
