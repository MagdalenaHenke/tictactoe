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

function printBoard(board, canWin, message) {
  const testBoard = [];
  for (let i in board) {
    testBoard[i] = board[i] ? board[i] : '.';
  }

  console.log(`
    ${message}
    canWin: ${JSON.stringify(canWin)}:
    ${testBoard.slice(0, 3).join('')}
    ${testBoard.slice(3, 6).join('')}
    ${testBoard.slice(6).join('')}`);
}

const mem = {};

const G = {
  DEFINITE_LOSS: 'definite_loss',
  DEFINITE_DRAW: 'definite_draw',
  DEFINITE_WIN: 'definite_win',
  POSSIBLE_LOSS: 'possible_loss',
  POSSIBLE_WIN: 'possible_win',
  POSSIBLE_DRAW: 'possible_draw'
};

// { xDefinitelyWins, oDefinitelyWins, xCanWin, oCanWin}
const analyzeBoard = (board) => {
  if (mem[board] !== undefined) return mem[board];
  const nextPlayer = brd.nextPlayer(board);
  const opponent = getOpponent(nextPlayer);

  if (brd.isCatsGame(board)) {
    const analysis = { X: G.DEFINITE_DRAW, O: G.DEFINITE_DRAW };
    mem[board] = analysis;
    return analysis;
  }

  const winner = brd.getWinner(board);
  if (winner) {
    const analysis = {
      X: winner === 'X' ? G.DEFINITE_WIN : G.DEFINITE_LOSS,
      O: winner === 'O' ? G.DEFINITE_WIN : G.DEFINITE_LOSS
    };
    mem[board] = analysis;
    return analysis;
  }

  // make the obvious move if there is one
  const smartField = determineSmartField(board);
  if (smartField !== null) {
    const testBoard = brd.playField(board, smartField);
    const analysis = analyzeBoard(testBoard);
    mem[board] = analysis;
    return analysis;
  }

  let whoCanWinIfIPlay = {}; // LEENA: could also just be an array
  for (let i = 0; i < board.length; i++) {
    // only consider empty boards
    if (!board[i]) {
      const testBoard = board.slice();
      testBoard[i] = nextPlayer;
      whoCanWinIfIPlay[i] = analyzeBoard(testBoard);
    }
  }

  const possiblePlays = Object.values(whoCanWinIfIPlay);
  // if any of them are a definite win for the current player, we'd play that one
  // and force a win
  if (possiblePlays.some((outcome) => outcome[nextPlayer] === G.DEFINITE_WIN)) {
    const analysis = {
      [nextPlayer]: G.DEFINITE_WIN,
      [opponent]: G.DEFINITE_LOSS
    };
    printBoard(
      board,
      analysis,
      `after trying all
      ${JSON.stringify(whoCanWinIfIPlay)}`
    );
    mem[board] = analysis;
    return analysis;
  }

  if (
    possiblePlays.every((outcome) => outcome[nextPlayer] === G.DEFINITE_LOSS)
  ) {
    const analysis = {
      [nextPlayer]: G.DEFINITE_LOSS,
      [opponent]: G.DEFINITE_WIN
    };
    printBoard(
      board,
      analysis,
      `after trying all
      ${JSON.stringify(whoCanWinIfIPlay)}`
    );
    mem[board] = analysis;
    return analysis;
  }

  // LEENA: be more specific about this, maybe do a possible draw
  // also add in randomness when it doesn't matter - for fun!

  const analysis = { X: G.DEFINITE_DRAW, O: G.DEFINITE_DRAW };
  printBoard(
    board,
    analysis,
    `after trying all
    ${JSON.stringify(whoCanWinIfIPlay)}`
  );
  mem[board] = analysis;
  return analysis;
};

const whoCanWin = (board) => {
  if (memo[board] !== undefined) return memo[board];
  const canWin = { X: false, O: false };
  if (brd.isCatsGame(board)) {
    printBoard(board, canWin, 'Already Cats Game');
    return canWin;
  }
  const winner = brd.getWinner(board);
  if (winner) {
    canWin[winner] = true;
    memo[board] = canWin;
    printBoard(board, canWin, 'Already Won');
    return canWin;
  }

  // if there is a smart field, you gotta play that one
  const smartField = determineSmartField(board);
  if (smartField !== null) {
    const testBoard = brd.playField(board, smartField);
    if (brd.isCatsGame(testBoard)) {
      printBoard(board, canWin, 'Cats Game In One');
      return canWin;
    }
    const winner = brd.getWinner(testBoard);
    if (winner) {
      canWin[winner] = true;
      memo[board] = canWin;
      printBoard(board, canWin, 'Win in one');
      return canWin;
    }
    const newCanWin = whoCanWin(testBoard);
    printBoard(board, newCanWin, 'Preventing a win in one');

    return newCanWin;
  }

  let whoCanWinIfIPlay = {}; // LEENA: could also just be an array
  const nextPlayer = brd.nextPlayer(board);
  for (let i = 0; i < board.length; i++) {
    // only consider empty boards
    if (!board[i]) {
      const testBoard = board.slice();
      testBoard[i] = nextPlayer;
      whoCanWinIfIPlay[i] = whoCanWin(testBoard);
    }
  }

  let xCanWin = false;
  let oCanWin = false; // LEENA: what are these?
  let possibleWinners = Object.values(whoCanWinIfIPlay);
  for (let i = 0; i < possibleWinners.length; i++) {
    const winners = possibleWinners[i];
    if (winners.O) oCanWin = true;
    if (winners.X) xCanWin = true;
  }

  canWin.X = xCanWin;
  canWin.O = oCanWin;
  memo[board] = canWin;
  printBoard(
    board,
    canWin,
    `
    after trying all
    ${JSON.stringify(whoCanWinIfIPlay)}
  `
  );
  return canWin;
};

const TRY = ['X', 'O', 'X', '', '', '', 'X', '', 'O'];
const TRY2 = ['X', 'O', 'X', 'O', '', '', 'X', '', 'O'];
const TRY3 = ['X', 'O', '', '', '', 'O', '', 'X', ''];
console.log('one');
analyzeBoard(TRY);
console.log('two');
analyzeBoard(TRY2);
console.log('three');
analyzeBoard(TRY3);

// Think about algorithm for this
// I don't wanna make any move where the other person _can_ win
const playBestField = (board) => {
  // if there is a smart field, you gotta play that one
  const smartField = determineSmartField(board);
  if (smartField !== null) return brd.playField(board, smartField);

  const nextPlayer = brd.nextPlayer(board);
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      // only consider empty boards
      const testBoard = board.slice();
      testBoard[i] = nextPlayer;
      const analysis = analyzeBoard(testBoard);
      // if I can win and this prevents the other person from winning, make that move
      if (analysis[nextPlayer] === G.DEFINITE_WIN) return testBoard;
    }
  }

  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      const testBoard = board.slice();
      testBoard[i] = nextPlayer;
      const analysis = analyzeBoard(testBoard);
      // pick the first one that's not a definite loss
      // LEENA: pick a random one that's not a definite loss?
      if (analysis[nextPlayer] !== G.DEFINITE_LOSS) {
        return testBoard;
      }
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
