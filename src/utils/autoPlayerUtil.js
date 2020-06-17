import * as brd from '../utils/boardUtil';

const DIFFICULTY = {
  // export these?
  DEFAULT: 'hard',
  SUPER_EASY: 'easyPeasy',
  EASY: 'easy',
  HARD: 'hard'
};

const getRandomElement = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
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

// LEENA: some debugging setup
function printBoard(board, canWin, message) {
  const testBoard = [];
  for (let i in board) {
    testBoard[i] = board[i] ? board[i] : '.';
  }

  // console.log(`
  //   ${message}
  //   canWin: ${JSON.stringify(canWin)}:
  //   ${testBoard.slice(0, 3).join('')}
  //   ${testBoard.slice(3, 6).join('')}
  //   ${testBoard.slice(6).join('')}`);
}

const memo = {};

const whoDefinitelyWins = (board) => {
  if (memo[board] !== undefined) return memo[board];
  const nextPlayer = brd.nextPlayer(board);

  if (brd.isCatsGame(board)) {
    const definiteWinner = null; // LEENA: make these independent of "X" and "O"
    memo[board] = definiteWinner;
    return definiteWinner;
  }

  const winner = brd.getWinner(board);
  if (winner) {
    const definiteWinner = winner;
    memo[board] = definiteWinner;
    return definiteWinner;
  }

  // make the obvious move if there is one
  const smartField = determineSmartField(board);
  if (smartField !== null) {
    const testBoard = brd.playField(board, smartField);
    const definiteWinner = whoDefinitelyWins(testBoard);
    memo[board] = definiteWinner;
    return definiteWinner;
  }

  let whoDefinitelyWinsIfIPlay = {}; // LEENA: could also just be an array
  for (let i = 0; i < board.length; i++) {
    // only consider empty fields
    if (!board[i]) {
      const testBoard = board.slice();
      testBoard[i] = nextPlayer;
      whoDefinitelyWinsIfIPlay[i] = whoDefinitelyWins(testBoard);
    }
  }

  const possiblePlays = Object.values(whoDefinitelyWinsIfIPlay);
  // if any of them are a definite win for the current player, we'd play that one
  // and force a win
  if (possiblePlays.some((winner) => winner === nextPlayer)) {
    const definiteWinner = nextPlayer;
    printBoard(
      board,
      definiteWinner,
      `after trying all
      ${whoDefinitelyWinsIfIPlay}`
    );
    memo[board] = definiteWinner;
    return definiteWinner;
  }

  // if regardless of what the current player does, they definitely lose
  if (possiblePlays.every((winner) => winner === nextPlayer)) {
    const definiteWinner = nextPlayer;
    printBoard(
      board,
      definiteWinner,
      `after trying all
      ${whoDefinitelyWinsIfIPlay}`
    );
    memo[board] = definiteWinner;
    return definiteWinner;
  }

  // LEENA: be more specific about this, maybe do a possible draw
  // also add in randomness when it doesn't matter - for fun!
  const definiteWinner = null;
  printBoard(
    board,
    definiteWinner,
    `after trying all
    ${whoDefinitelyWinsIfIPlay}`
  );
  memo[board] = definiteWinner;
  return definiteWinner;
};

// const TRY = ['X', 'O', 'X', '', '', '', 'X', '', 'O'];
// const TRY2 = ['X', 'O', 'X', 'O', '', '', 'X', '', 'O'];
// const TRY3 = ['X', 'O', '', '', '', 'O', '', 'X', ''];
// console.log('one');
// whoDefinitelyWins(TRY);
// console.log('two');
// whoDefinitelyWins(TRY2);
// console.log('three');
// whoDefinitelyWins(TRY3);

// Think about algorithm for this
// any move that makes me win definitely, do that one
// avoid moves that make me lose definitely
// pick from the remaining ones at random
const playBestField = (board) => {
  // if there is a smart field, you gotta play that one
  const smartField = determineSmartField(board);
  if (smartField !== null) return brd.playField(board, smartField);

  const nextPlayer = brd.nextPlayer(board);

  const boardsWithMovesThatDefinitelyMakeNextPlayerWin = [];
  const boardsWithMovesThatEndInDraws = [];
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      // only consider empty boards
      const testBoard = board.slice();
      testBoard[i] = nextPlayer;
      const definiteWinner = whoDefinitelyWins(testBoard);
      if (definiteWinner === nextPlayer) {
        boardsWithMovesThatDefinitelyMakeNextPlayerWin.push(testBoard);
      } else if (definiteWinner === null) {
        boardsWithMovesThatEndInDraws.push(testBoard);
      }
    }
  }

  if (boardsWithMovesThatDefinitelyMakeNextPlayerWin.length > 0) {
    return getRandomElement(boardsWithMovesThatDefinitelyMakeNextPlayerWin);
  }

  if (boardsWithMovesThatEndInDraws.length > 0) {
    return getRandomElement(boardsWithMovesThatEndInDraws);
  }

  console.log('we got here, somehow, but should not have');
};

const takeTurn = function(board, difficulty = DIFFICULTY.EASY) {
  // LEENA: maybe a switch?
  if (difficulty === DIFFICULTY.SUPER_EASY) return playRandomField(board);
  if (difficulty === DIFFICULTY.EASY) return playSmartField(board);
  if (difficulty === DIFFICULTY.HARD) return playBestField(board);
  console.log("Check your difficulties, you're using one I don't know of.");
};

export { DIFFICULTY, getOpponent, takeTurn };
