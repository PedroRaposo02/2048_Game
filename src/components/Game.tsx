import classNames from "classnames"
import { useState } from "react"
import useGame from "../hooks/useGame"

const Game = () => {
  let cellSize = 100
  let cellPadding = 5
  let numberOfCells = 4
  
  const { grid, setGrid } = useGame();
  return (
    <div className="grid grid-cols-4 grid-rows-4 content-center bg-grid_color aspect-square text-5xl p-4 rounded-md gap-4">
      {grid.map((row, rowIndex) => (
        row.map((cell, cellIndex) => (
          <div
            key={cellIndex}
            className={classNames({
              "bg-cell1_color text-text_color": cell === 0,
              "bg-cell2_color text-text_color": cell === 2,
              "bg-cell4_color text-background_color": cell === 4,
              "bg-cell8_color text-background_color": cell === 8,
              "bg-cell16_color text-background_color": cell === 16,
              "bg-cell32_color text-background_color": cell === 32,
              "bg-cell64_color text-background_color": cell === 64,
              "bg-cell128_color text-background_color": cell === 128,
              "bg-cell256_color text-background_color": cell === 256,
              "bg-cell512_color text-background_color": cell === 512,
              "bg-cell1024_color text-background_color": cell === 1024,
              "bg-cell2048_color text-background_color": cell === 2048
            }, 'text-center font-bold', 'rounded-md', 'flex', 'items-center', 'justify-center')}
            style={{
              width: `${cellSize}px`,
              height: `${cellSize}px`,
            }}
          >
            {cell !== 0 && cell}
          </div>
        ))
      ))}
    </div>
)
}

export default Game