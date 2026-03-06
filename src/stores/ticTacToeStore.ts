import { create } from "zustand";

import {
  GameMode,
  TicTacToeBoardType,
  TicTacToePlayerSymbol,
  WinningLine,
} from "../types/ticTacToeTypes";
import { getBestMove, getWinner, isDraw } from "../utils/ticTacToeUtils";

export interface TicTacToeStore extends TicTacToeFunctions, TicTacToeState { }

interface TicTacToeFunctions {
  makeAiMove: () => void;
  passTurn: () => void;
  resetStore: () => void;
  setGameFinished: (gameFinished: boolean) => void;
  startGame: (player: TicTacToePlayerSymbol, gameMode: GameMode) => void;
}

interface TicTacToeState {
  board: TicTacToeBoardType;
  currentPlayer: null | TicTacToePlayerSymbol;
  gameFinished: boolean;
  gameMode: GameMode;
  isDraw: boolean;
  winner: null | TicTacToePlayerSymbol;
  winningLine?: WinningLine;
}

const getNewBoard = (): TicTacToeBoardType => Array(9).fill(null);

const defaultState: TicTacToeState = {
  board: getNewBoard(),
  currentPlayer: null,
  gameFinished: false,
  gameMode: "Hard",
  isDraw: false,
  winner: null,
  winningLine: undefined,
};

export const useTicTacToeStore = create<TicTacToeStore>((set, get) => {
  return {
    ...defaultState,
    makeAiMove: () => {
      const { board, gameMode } = get();
      const aiMove = getBestMove({ board, difficulty: gameMode });

      if (aiMove !== null) {
        set((state) => {
          const newBoard = [...state.board];
          newBoard[aiMove] = "O";
          return { board: newBoard };
        });

        get().passTurn();
      }
    },
    passTurn: () => {
      // Determine if the game has been won or drawn before passing the turn to the next player.
      const { board, currentPlayer } = get();
      const { line, winner } = getWinner(board) || {};
      const draw = isDraw(board);
      const nextPlayer = currentPlayer === "X" ? "O" : "X";

      set({ isDraw: draw, winner, winningLine: line });

      if (!winner && !draw) {
        set(() => {
          return { currentPlayer: nextPlayer };
        });

        if (nextPlayer === "O") {
          get().makeAiMove();
        }
      }
    },
    // TODO: We shouldn't need the call to `getNewBoard`, but we're currently mutating the board directly
    // in the `TicTacToeBoard` component, so we need to ensure that we're resetting to a new array
    // reference here to trigger re-renders.
    resetStore: () => set({ ...defaultState, board: getNewBoard() }),
    setGameFinished: (gameFinished: boolean) => set({ gameFinished }),
    startGame: (
      player: TicTacToePlayerSymbol,
      gameMode: GameMode = defaultState.gameMode,
    ) => set({ currentPlayer: player, gameMode }),
  };
});
