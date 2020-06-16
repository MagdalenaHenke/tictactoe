import { takeTurn } from './autoPlayerUtil';
const PLAYERS = ['X', 'O'];
const DEFAULT_COMPUTER_TOKEN = PLAYERS[1];

const ROWS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8]
];
const COLUMNS = [
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8]
];
const DIAGNOALS = [
  [0, 4, 8],
  [6, 4, 2]
];

const LINES = [...ROWS, ...COLUMNS, ...DIAGNOALS];

// LEENA: change it all back to regular good old functions

const numTurnsPlayed = (board) => {
  return board.reduce((sum, value) => (!!value ? sum + 1 : sum), 0);
};

// LEENA: comment on all of these functions
const nextPlayer = (board) => {
  const turnsPlayed = numTurnsPlayed(board);
  return PLAYERS[turnsPlayed % 2]; // X for odd number of fields played, O otherwise
};

const isFull = (board) => {
  return numTurnsPlayed(board) === board.length;
};

const isCatsGame = (board) => {
  // it's a cats game if all valid lines have at least one X and O
  for (const line of LINES) {
    const tokens = getTokens(board, line);
    if (!(tokens.includes(PLAYERS[0]) && tokens.includes(PLAYERS[1])))
      return false;
  }
  return true;
};

const newBoard = (computerToken, difficulty) => {
  const newBoard = Array(9).fill(null);

  // if computer starts, fill one of the fields
  return PLAYERS.indexOf(computerToken) === 0
    ? takeTurn(newBoard, difficulty)
    : newBoard;
};

const getTokens = (board, line) => {
  return [board[line[0]], board[line[1]], board[line[2]]];
};

const lineWinner = (board, line) => {
  const [a, b, c] = getTokens(board, line);
  if (!!a && a === b && b === c) return a;
  return null;
};

const getWinner = (board) => {
  let winner = null;
  for (const line of LINES) {
    winner = lineWinner(board, line);
    if (winner) return winner;
  }
  return null;
};

// if X (/O) fills all three fields, return X (/O). Otherwise return null
const getWinningLine = (board) => {
  let winner = null;
  for (let i = 0; i < ROWS.length; i++) {
    const row = ROWS[i];
    winner = lineWinner(board, row);
    if (winner) return `r${i}`;
  }

  for (let i = 0; i < COLUMNS.length; i++) {
    const col = COLUMNS[i];
    winner = lineWinner(board, col);
    if (winner) return `c${i}`;
  }

  for (let i = 0; i < DIAGNOALS.length; i++) {
    const diagonal = DIAGNOALS[i];
    winner = lineWinner(board, diagonal);
    if (winner) return `d${i}`;
  }
};

// Leena: these really could/should be javascript classes
// LEENA: maybe don't require player in here
// LEENA: be more thoughtful about what treats the board as
// immutable and what doesn't
const playField = (board, field) => {
  const token = nextPlayer(board);
  const newBoard = board.slice();
  newBoard[field] = token;
  return newBoard;
};

export {
  numTurnsPlayed,
  isFull,
  isCatsGame,
  nextPlayer,
  newBoard,
  getWinner,
  getWinningLine,
  playField,
  PLAYERS,
  DEFAULT_COMPUTER_TOKEN
};
