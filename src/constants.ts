export const NUMBER_OF_ROWS = 4;
export const NUMBER_OF_COLS = 4;
export const CHANCE_OF_FOUR = 0.1; // 10% chance of spawning a 4


const cellColorDict: { [key: number]: string } = {
  0: "bg-cell1_color text-text_color",
  2: "bg-cell2_color text-text_color",
  4: "bg-cell4_color text-background_color",
  8: "bg-cell8_color text-background_color",
  16: "bg-cell16_color text-background_color",
  32: "bg-cell32_color text-background_color",
  64: "bg-cell64_color text-background_color",
  128: "bg-cell128_color text-background_color",
  256: "bg-cell256_color text-background_color",
  512: "bg-cell512_color text-background_color",
  1024: "bg-cell1024_color text-background_color",
  2048: "bg-cell2048_color text-background_color",
}

export const cellColor = (value: number) => {
  return cellColorDict[value];
}