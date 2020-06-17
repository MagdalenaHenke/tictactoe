import {
  PLAYERS,
  ROWS,
  COLUMNS,
  DIAGONALS,
  LINES
} from '../constants/constants';
import { takeTurn } from './autoPlayerUtil';

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

  for (let i = 0; i < DIAGONALS.length; i++) {
    const diagonal = DIAGONALS[i];
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

// debugging helper method
const printBoard = (board, ...message) => {
  const testBoard = board.map((val) => val || '.');

  console.log(`
     ${message}
     ${testBoard.slice(0, 3).join('')}
     ${testBoard.slice(3, 6).join('')}
     ${testBoard.slice(6).join('')}`);
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
  printBoard
};
