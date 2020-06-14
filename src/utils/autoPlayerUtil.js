import * as brd from '../utils/boardUtil';

const DIFFICULTY = {
  // export these?
  SUPER_EASY: 'easyPeasy',
  EASY: 'easy',
  HARD: 'hard'
};

// pick a random open field
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

// if I can win in one move, make that move
// otherwise check whether there's a move that would prevent the opponent from winning
// otherwise pick a random open field
const pickSmartField = (board) => {
  // LEENA: allow passing in player

  // Note on performance: iterating through all possible fields is _not_ the fastest, it's pretty
  // poor on theoretical runtime. But, since this is only 9 fields, and not intended to be extendable,
  // it runs plenty fast enough. I see no need to overoptimize performance here, especially when that
  // would give us a less debuggable outcome.

  // check whether we can win by...literally checking each field
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      const testBoard = board.map((val, index) => (index === i ? 'O' : val)); // LEENA: don't hardcode the O here
      if (brd.winner(testBoard)?.winner === 'O') return i;
    }
  }

  // check whether we can prevent opponent from winning
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      const testBoard = board.map((val, index) => (index === i ? 'X' : val)); // LEENA: don't hardcode the X here
      if (brd.winner(testBoard)?.winner === 'X') return i;
    }
  }

  return pickRandomField(board);
};

const pickBestField = (board) => {}; // Think about algorithm for this

const takeTurn = function(board, difficulty = DIFFICULTY.EASY) {
  // LEENA: maybe a switch?
  if (difficulty === DIFFICULTY.SUPER_EASY) return pickRandomField(board);
  if (difficulty === DIFFICULTY.EASY) return pickSmartField(board);
  if (difficulty === DIFFICULTY.HARD) return pickBestField(board);
  console.log("Check your difficulties, you're using one I don't know of.");
};

export { DIFFICULTY, pickRandomField, takeTurn };
