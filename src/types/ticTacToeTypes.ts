export interface HistoryType {
  result: WinCondition;
  timestamp: Date;
}

export type TicTacToeBoardType = TicTacToeCellType[];

export type TicTacToeCellType = null | TicTacToePlayerSymbol;

export type TicTacToePlayerSymbol = "O" | "X";

export type WinCondition = "Lose" | "Tie" | "Win";

export type WinningLine = [number, number, number];
