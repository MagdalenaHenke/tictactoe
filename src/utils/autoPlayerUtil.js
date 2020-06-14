import * as brd from '../utils/boardUtil';

const DIFFICULTY = {
  // export these?
  EASY: 'easy',
  HARD: 'hard'
};

const pickRandomField = (board) => {
  const numberOfEmptyFields = 9 - brd.numTurnsPlayed(board);
  const r = Math.floor(Math.random() * numberOfEmptyFields);
  let count = 0;
  let i = 0;
  while (i <= board.length) {
    if (!board[i] && count === r) return i;
    if (!board[i]) count++;
    i++;
  }
};

const pickBestField = (board) => {}; // Think about algorithm for this

const takeTurn = function(board, difficulty = DIFFICULTY.EASY) {
  if (difficulty === DIFFICULTY.EASY) return pickRandomField(board);
  if (difficulty === DIFFICULTY.HARD) return pickBestField(board);
  console.log("Check your difficulties, you're using one I don't know of.");
};

export { DIFFICULTY, pickRandomField, takeTurn };
