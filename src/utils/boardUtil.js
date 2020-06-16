import { takeTurn } from './autoPlayerUtil';
const PLAYERS = ['X', 'O']; // maybe share this

const numTurnsPlayed = (board) => {
  return board.reduce((sum, value) => (!!value ? sum + 1 : sum), 0);
};

const opponent = (player) => {
  return player === PLAYERS[0] ? PLAYERS[1] : PLAYERS[0];
};

// LEENA: comment on all of these functions
const nextPlayer = (board) => {
  const turnsPlayed = numTurnsPlayed(board);
  return PLAYERS[turnsPlayed % 2]; // X for odd number of fields played, O otherwise
};

const newBoard = (computerToken, difficulty) => {
  const newBoard = Array(9).fill(null);

  // if computer starts, fill one of the fields
  return PLAYERS.indexOf(computerToken) === 0
    ? takeTurn(newBoard, difficulty)
    : newBoard;
};

// comment these
const lineWinner = (line) => {
  if (!!line[0] && line[0] === line[1] && line[1] === line[2]) return line[0];
  return null;
};

const winnerAndWinningLine = (board) => {
  // check all rows and columns
  for (let i = 0; i < 3; i++) {
    const row = board.slice(3 * i, 3 * i + 3);
    if (lineWinner(row)) return { winner: lineWinner(row), line: `r${i}` }; // LEENA: yeah maybe don't do this twice

    const col = [board[i], board[i + 3], board[i + 6]];
    if (lineWinner(col)) return { winner: lineWinner(col), line: `c${i}` };
  }

  // check diagonals
  const d1 = [board[0], board[4], board[8]];
  const d2 = [board[6], board[4], board[2]];
  if (lineWinner(d1)) return { winner: lineWinner(d1), line: 'd1' };
  if (lineWinner(d2)) return { winner: lineWinner(d2), line: 'd2' };

  return null;
};

const winner = (board) => {
  return winnerAndWinningLine(board)?.winner;
};

const winningLine = (board) => {
  return winnerAndWinningLine(board)?.line;
};

const isFull = (board) => {
  const gotPlayed = (fieldValue) => !!fieldValue; // if value in a field is truthy, that field got played
  return board.every(gotPlayed);
};

// Leena: these really could/should be javascript classes
// LEENA: maybe don't require player in here
// LEENA: be more thoughtful about what treats the board as
// immutable and what doesn't
const playField = (board, field, player) => {
  const newBoard = board.slice();
  newBoard[field] = player;
  return newBoard;
};

export {
  opponent,
  numTurnsPlayed,
  nextPlayer,
  newBoard,
  winner,
  winningLine,
  isFull,
  playField,
  PLAYERS
};
