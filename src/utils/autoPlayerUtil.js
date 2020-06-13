import { numberOfTurnsPlayed } from '../utils/boardUtil';

const DIFFICULTY = {
  // export these?
  EASY: 'easy',
  HARD: 'hard'
};

const autoPlayerPickRandomField = (board) => {
  const numberOfEmptyFields = 9 - numberOfTurnsPlayed(board);
  const r = Math.floor(Math.random() * numberOfEmptyFields);
  let count = 0;
  let i = 0;
  while (count <= r) {
    if (!board[i] && count === r) return i;
    if (!board[i]) count++;
    i++;
  }
};

const bestField = (board) => {}; // Think about algorithm for this

const autoPlayerTurn = {
  [DIFFICULTY.EASY]: autoPlayerPickRandomField,
  [DIFFICULTY.HARD]: bestField // later turn this into bestField
};

export { DIFFICULTY, autoPlayerPickRandomField, autoPlayerTurn };
