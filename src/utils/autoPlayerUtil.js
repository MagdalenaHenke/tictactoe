import * as brd from '../utils/boardUtil';

const DIFFICULTY = {
  // export these?
  DEFAULT: 'hard',
  SUPER_EASY: 'easyPeasy',
  EASY: 'easy',
  HARD: 'hard'
};

// LEENA: rename them all to like "getWinner and stuff"
const getOpponent = (player) => {
  return player === brd.PLAYERS[0] ? brd.PLAYERS[1] : brd.PLAYERS[0];
};

// pick a random open field
const playRandomField = (board) => {
  const numEmptyFields = 9 - brd.numTurnsPlayed(board);
  const r = Math.floor(Math.random() * numEmptyFields);
  let count = 0;
  let i = 0;

  // playe the r-th empty field
  while (i <= board.length) {
    if (!board[i] && count === r) return brd.playField(board, i);
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
  const opponent = getOpponent(nextPlayer);

  // check whether nextPlayer can win by...literally checking each field
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      const testBoard = brd.playField(board, i);
      if (brd.getWinner(testBoard) === nextPlayer) return i;
    }
  }

  // check whether nextPlayer can prevent opponent from winning
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      const testBoard = board.slice();
      testBoard[i] = opponent;
      if (brd.getWinner(testBoard) === opponent) return i;
    }
  }

  return null;
};

// if nextPlayer can win in one move, make that move
// otherwise check whether there's a move that would prevent the opponent from winning
// otherwise pick a random open field
const playSmartField = (board) => {
  const smartField = determineSmartField(board);
  if (smartField !== null) return brd.playField(board, smartField);
  return playRandomField(board);
};

// a cats game is not a win for the other person
// I'm just trying to avoid definite losses
// maybe improve this to favor plays that make you win
const memo = {};

const whoCanWin = (board) => {
  if (memo[board] !== undefined) return memo[board];
  const canWin = { X: false, O: false };
  if (brd.isCatsGame(board)) return canWin;
  const winner = brd.getWinner(board);
  if (winner) {
    canWin[winner] = true;
    memo[board] = canWin;
    console.log('whoCanWin', board, canWin);
    return canWin;
  }

  // if there is a smart field, you gotta play that one
  const smartField = determineSmartField(board);
  if (smartField !== null) {
    const testBoard = brd.playField(board, smartField);
    if (brd.isCatsGame(testBoard)) return canWin;
    const winner = brd.getWinner(testBoard);
    if (winner) {
      canWin[winner] = true;
      memo[board] = canWin;
      console.log('whoCanWin', board, canWin);
      return canWin;
    }
  }

  let whoDefinitelyLosesIfIPlay = {};
  const nextPlayer = brd.nextPlayer(board);
  for (let i = 0; i < board.length; i++) {
    // only consider empty boards
    if (!board[i]) {
      const testBoard = board.slice();
      testBoard[i] = nextPlayer;
      whoDefinitelyLosesIfIPlay[i] = whoCanWin(testBoard);
    }
  }

  let xLosesAll = true;
  let oLosesAll = true;
  let possibleWinners = Object.values(whoDefinitelyLosesIfIPlay);
  for (let i = 0; i < possibleWinners.length; i++) {
    const winner = possibleWinners[i];
    if (winner === 'X') xLosesAll = false;
    if (winner === 'O') oLosesAll = false;
  }

  canWin.X = !xLosesAll;
  canWin.O = !oLosesAll;
  memo[board] = canWin;
  console.log('whoCanWin', board, canWin);
  return canWin;
};

// Think about algorithm for this
// I don't wanna make any move where the other person _can_ win
const playBestField = (board) => {
  // if there is a smart field, you gotta play that one
  const smartField = determineSmartField(board);
  if (smartField !== null) return brd.playField(board, smartField);

  const nextPlayer = brd.nextPlayer(board);
  for (let i = 0; i < board.length; i++) {
    const testBoard = board.slice();
    if (!testBoard[i]) {
      // only consider empty boards
      testBoard[i] = nextPlayer;
      // if this prevents the other person from winning, make that move
      if (!whoCanWin(testBoard)[getOpponent(nextPlayer)]) return testBoard;
    }
  }

  console.log('we got here, somehow');
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

export { DIFFICULTY, getOpponent, takeTurn };
