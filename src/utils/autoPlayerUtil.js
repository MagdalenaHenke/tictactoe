import * as brd from '../utils/boardUtil';

const DIFFICULTY = {
  // export these?
  SUPER_EASY: 'easyPeasy',
  EASY: 'easy',
  HARD: 'hard'
};

// pick a random open field
const playRandomField = (board) => {
  const nextPlayer = brd.nextPlayer(board);

  const numberOfEmptyFields = 9 - brd.numTurnsPlayed(board);
  const r = Math.floor(Math.random() * numberOfEmptyFields);
  let count = 0;
  let i = 0;
  while (i <= board.length) {
    if (!board[i] && count === r) return brd.playField(board, i, nextPlayer);
    if (!board[i]) count++;
    i++;
  }
};

const determineSmartField = (board) => {
  // Note on performance: iterating through all possible fields is _not_ the fastest, it's pretty
  // poor on theoretical runtime. But, since this is only 9 fields, and not intended to be extendable,
  // it runs plenty fast enough. I see no need to overoptimize performance here, especially when that
  // would give us a less debuggable outcome.
  const nextPlayer = brd.nextPlayer(board);
  const opponent = brd.opponent(nextPlayer);

  // check whether we can win by...literally checking each field
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      const testBoard = brd.playField(board, i, nextPlayer);
      if (brd.winner(testBoard) === nextPlayer) return i;
    }
  }

  // check whether we can prevent opponent from winning
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      const testBoard = board.slice();
      testBoard[i] = opponent;
      if (brd.winner(testBoard) === opponent) return i;
    }
  }

  return null;
};

// if I can win in one move, make that move
// otherwise check whether there's a move that would prevent the opponent from winning
// otherwise pick a random open field
const playSmartField = (board) => {
  const nextPlayer = brd.nextPlayer(board);
  const smartField = determineSmartField(board);
  if (smartField !== null) return brd.playField(board, smartField, nextPlayer);
  return playRandomField(board);
};

// Think about algorithm for this
const playBestField = (board) => {
  return board;
};

const takeTurn = function(board, difficulty = DIFFICULTY.EASY) {
  // LEENA: maybe a switch?
  if (difficulty === DIFFICULTY.SUPER_EASY) return playRandomField(board);
  if (difficulty === DIFFICULTY.EASY) return playSmartField(board);
  if (difficulty === DIFFICULTY.HARD) return playBestField(board);
  console.log("Check your difficulties, you're using one I don't know of.");
};

// function hash(board) {
//   return board.join('-');
// }

export { DIFFICULTY, playRandomField, takeTurn };
