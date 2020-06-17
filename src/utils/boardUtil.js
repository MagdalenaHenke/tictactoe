import {
  PLAYERS,
  ROWS,
  COLUMNS,
  DIAGONALS,
  LINES
} from '../constants/constants';
import { takeTurn } from './autoPlayerUtil';

// creates an empty board, or, if the computer makes the first move,
// a board with one move made
function getNewBoard(computerToken, difficulty) {
  const getNewBoard = Array(9).fill(null);

  // if computer starts, fill one of the fields
  return PLAYERS.indexOf(computerToken) === 0
    ? takeTurn(getNewBoard, difficulty)
    : getNewBoard;
}

// return number of turns played so far
function numTurnsPlayed(board) {
  return board.reduce((sum, value) => (!!value ? sum + 1 : sum), 0);
}

// returns token of the player making the next move
function getNextPlayer(board) {
  const turnsPlayed = numTurnsPlayed(board);
  return PLAYERS[turnsPlayed % 2]; // X for odd number of fields played, O otherwise
}

// returns true if all fields are filled
function isFull(board) {
  return numTurnsPlayed(board) === board.length;
}

// returns tokens played for a set of board indices
function getTokens(board, line) {
  return [board[line[0]], board[line[1]], board[line[2]]];
}

// it's a cats game if all valid lines have at least one X and one O
function isCatsGame(board) {
  for (const line of LINES) {
    const tokens = getTokens(board, line);
    if (!(tokens.includes(PLAYERS[0]) && tokens.includes(PLAYERS[1])))
      return false;
  }
  return true;
}

// for a given line, check whether each three fields contain the same token
// if so, return that token
function getLineWinner(board, line) {
  const [a, b, c] = getTokens(board, line);
  if (!!a && a === b && b === c) return a;
  return null;
}

// if any token has filled a line, returns that token
// otherwise returns nulls
function getWinner(board) {
  let winner = null;
  for (const line of LINES) {
    winner = getLineWinner(board, line);
    if (winner) return winner;
  }
  return null;
}

// figure out which line needs to be crossed through
// rows are labelled r0, r1, r2
// columns are labelled c0, c1, c2
// diagonals are labelled d0 and d1
// these align with the classnames used to position the
// cross-through line in Board.css
function getWinningLine(board) {
  for (let i in ROWS) {
    if (getLineWinner(board, ROWS[i])) return `r${i}`;
  }

  for (let i in COLUMNS) {
    if (getLineWinner(board, COLUMNS[i])) return `c${i}`;
  }

  for (let i in DIAGONALS) {
    if (getLineWinner(board, DIAGONALS[i])) return `d${i}`;
  }
}

// Leena: these really could/should be javascript classes
// LEENA: be more thoughtful about what treats the board as immutable and what doesn't

// returns a new board with the next move made at the given index
const playField = (board, i) => {
  const token = getNextPlayer(board);
  const getNewBoard = board.slice();
  getNewBoard[i] = token;
  return getNewBoard;
};

// debugging helper method for printing boards to the console
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
  getNextPlayer,
  getNewBoard,
  getWinner,
  getWinningLine,
  playField,
  printBoard
};
