import {
  GameMode,
  TicTacToeBoardType,
  TicTacToeCellType,
  TicTacToePlayerSymbol,
  WinningLine,
} from "../types/ticTacToeTypes";

const WIN_LINES: WinningLine[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const OPTIMAL_FIRST_MOVES = [0, 2, 4, 6, 8];

interface GetBestMoveParams {
  aiSymbol?: TicTacToePlayerSymbol;
  board: TicTacToeBoardType;
  difficulty: GameMode;
  humanSymbol?: TicTacToePlayerSymbol;
}

interface MinimaxParams extends Omit<GetBestMoveParams, "difficulty"> {
  maxMovesAhead?: number;
  movesAhead: number;
  turn: TicTacToePlayerSymbol;
}

export const getWinner = (
  board: TicTacToeBoardType,
): { line?: WinningLine; winner: TicTacToeCellType } => {
  for (const [a, b, c] of WIN_LINES) {
    const v = board[a];

    // A winning line will have the same non-null value in all three positions.
    if (v && v === board[b] && v === board[c])
      return { line: [a, b, c], winner: v };
  }
  return { winner: null };
};

export const isDraw = (board: TicTacToeBoardType): boolean => {
  // The board is full but no winning lines exist
  return !getWinner(board).winner && board.every((c) => c !== null);
};

const availableMoves = (board: TicTacToeBoardType): number[] => {
  const moves: number[] = [];
  board.forEach((cell, index) => {
    if (board[index] === null) {
      moves.push(index);
    }
  });
  return moves;
};

const miniMax = ({
  aiSymbol = "O",
  board,
  humanSymbol = "X",
  maxMovesAhead = Infinity,
  movesAhead,
  turn,
}: MinimaxParams): { move: null | number; score: number } => {
  const boardCopy = [...board];

  const { winner } = getWinner(boardCopy);
  if (movesAhead >= maxMovesAhead) {
    return { move: null, score: 0 };
  }
  if (winner === aiSymbol) return { move: null, score: 10 - movesAhead };
  if (winner === humanSymbol) return { move: null, score: movesAhead - 10 };
  if (boardCopy.every((c) => c !== null)) return { move: null, score: 0 };

  const moves = availableMoves(boardCopy);

  // AI tries to maximize score; human tries to minimize score.
  let best =
    turn === aiSymbol
      ? { move: null as null | number, score: -Infinity }
      : { move: null as null | number, score: Infinity };

  moves.forEach((m) => {
    boardCopy[m] = turn;
    const next = miniMax({
      aiSymbol,
      board: boardCopy,
      humanSymbol,
      maxMovesAhead,
      movesAhead: movesAhead + 1,
      turn: turn === "X" ? "O" : "X", // next player's turn
    });
    boardCopy[m] = null;

    if (turn === aiSymbol) {
      if (next.score > best.score) best = { move: m, score: next.score };
    } else {
      if (next.score < best.score) best = { move: m, score: next.score };
    }
  });

  return best;
};

export const getBestMove = ({
  aiSymbol = "O",
  board,
  difficulty,
  humanSymbol = "X",
}: GetBestMoveParams): null | number => {
  // If the board is empty, just take the middle. No need to run the minimax algorithm.
  if (board.every((c) => c === null))
    if (difficulty === "Hard") {
      return OPTIMAL_FIRST_MOVES[
        Math.floor(Math.random() * OPTIMAL_FIRST_MOVES.length)
      ];
    } else {
      return Math.floor(Math.random() * 9);
    }

  if (getWinner(board).winner || board.every((c) => c !== null)) {
    return null;
  }

  return miniMax({
    aiSymbol,
    board,
    humanSymbol,
    maxMovesAhead: difficulty === "Hard" ? Infinity : 2,
    movesAhead: 0,
    turn: aiSymbol,
  }).move;
};

export const getStrike = (boardSquareDimension: number, line: WinningLine) => {
  const cell = boardSquareDimension / 3;

  const rows = line.map((i) => Math.floor(i / 3));
  const cols = line.map((i) => i % 3);

  const sameRow = rows.every((r) => r === rows[0]);
  const sameCol = cols.every((c) => c === cols[0]);

  // Horizontal line in a row
  if (sameRow) {
    const row = rows[0];
    return {
      angle: "0deg",
      cx: boardSquareDimension / 2,
      cy: (row + 0.5) * cell,
      length: boardSquareDimension,
    };
  }

  // Vertical line in a column
  if (sameCol) {
    const col = cols[0];
    return {
      angle: "90deg",
      cx: (col + 0.5) * cell,
      cy: boardSquareDimension / 2,
      length: boardSquareDimension,
    };
  }

  // Diagonals
  const isTopLeftToBottomRight =
    line[0] === 0 && line[1] === 4 && line[2] === 8;

  return {
    angle: isTopLeftToBottomRight ? "45deg" : "-45deg",
    cx: boardSquareDimension / 2,
    cy: boardSquareDimension / 2,
    length: boardSquareDimension * Math.SQRT2,
  };
};
