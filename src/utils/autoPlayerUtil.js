import * as brd from '../utils/boardUtil';

const DIFFICULTY = {
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

const determineSmartField = (board) => {
  // Note on performance: iterating through all possible fields is _not_ the fastest, it's pretty
  // poor on theoretical runtime. But, since this is only 9 fields, and not intended to be extendable,
  // it runs plenty fast enough. I'm chosing not to overoptimize performance here, especially because
  // that would be harder to read code.
  const nextPlayer = brd.nextPlayer(board);
  const opponent = getOpponent(nextPlayer);

  const nextPlayerWinInOneFields = [];
  const opponentWinInOneFields = [];

  // check each free field
  // does taking that field make nextPlayer win?
  // does taking that field prevent opponent from crossing a three in their next move?
  for (let i = 0; i < board.length; i++) {
    // only check free fields
    if (!board[i]) {
      const testBoard = brd.playField(board, i);
      if (brd.getWinner(testBoard) === nextPlayer) {
        nextPlayerWinInOneFields.push(i);
      } else {
        testBoard[i] = opponent;
        if (brd.getWinner(testBoard) === opponent) {
          opponentWinInOneFields.push(i);
        }
      }
    }
  }

  // if we can win in one, do that
  if (nextPlayerWinInOneFields.length > 0) {
    return getRandomElement(nextPlayerWinInOneFields);
  }

  // else if we can prevent opponent from winning in one, do that
  if (opponentWinInOneFields.length > 0) {
    return getRandomElement(opponentWinInOneFields);
  }

  // no "looking only one step ahead" obvious smart field exists
  return null;
};

// Note: instead of generating all relevant board options on the fly, we could just
// do it once and pass in a big old dictionary that already has this precomputed.
// We'd be trading space against runtime. At this scale, neither one is really a concern.
// But definitely something to keep in mind
const whoWillWinThis = (function() {
  const memo = {}; // for memoization

  const memoAndReturn = (board, winner) => {
    memo[board] = winner;
    return winner;
  };

  const whoDefinitelyWins = (board) => {
    if (memo[board] !== undefined) return memo[board];

    const nextPlayer = brd.nextPlayer(board);

    if (brd.isCatsGame(board)) {
      return memoAndReturn(board, null);
    }

    const winner = brd.getWinner(board);
    if (winner) {
      return memoAndReturn(board, winner);
    }

    // make the obvious move if there is one
    const smartField = determineSmartField(board);
    if (smartField !== null) {
      const testBoard = brd.playField(board, smartField);
      const winner = whoDefinitelyWins(testBoard);
      return memoAndReturn(board, winner);
    }

    let whoWinsIfIPlay = [];
    for (let i = 0; i < board.length; i++) {
      // only consider empty fields
      if (!board[i]) {
        const testBoard = board.slice();
        testBoard[i] = nextPlayer;
        whoWinsIfIPlay.push(whoDefinitelyWins(testBoard));
      }
    }

    // if any of them are a definite win for the current player,
    // we'd play that one and force a win
    if (whoWinsIfIPlay.some((winner) => winner === nextPlayer)) {
      return memoAndReturn(board, nextPlayer);
    }

    // LEENA: Maybe I don't need this!
    // if regardless of what the current player does, they definitely lose
    if (whoWinsIfIPlay.every((winner) => winner === nextPlayer)) {
      return memoAndReturn(board, nextPlayer);
    }

    // both players will do their best and have a draw
    return memoAndReturn(board, null);
  };

  return whoDefinitelyWins;
})();

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

// if nextPlayer can win in one move, make that move
// otherwise check whether there's a move that would prevent the opponent from winning
// otherwise pick a random open field
const playSmartField = (board) => {
  const smartField = determineSmartField(board);
  if (smartField !== null) return brd.playField(board, smartField);
  return playRandomField(board);
};

// any move that makes me win definitely, do that one
// avoid moves that make me lose definitely
// pick from the remaining ones at random
const playBestField = (board) => {
  const nextPlayer = brd.nextPlayer(board);

  const definiteWinsForNextPlayer = [];
  const draws = [];
  for (let i = 0; i < board.length; i++) {
    // only consider empty boards
    if (!board[i]) {
      const testBoard = brd.playField(board, i);
      const winner = whoWillWinThis(testBoard);
      if (winner === nextPlayer) {
        definiteWinsForNextPlayer.push(testBoard);
      } else if (winner === null) {
        draws.push(testBoard);
      }
    }
  }

  if (definiteWinsForNextPlayer.length > 0) {
    return getRandomElement(definiteWinsForNextPlayer);
  }

  if (draws.length > 0) {
    return getRandomElement(draws);
  }

  console.log(
    'It thinks that there is no move that allows forcing a draw. We should not have gotten here.'
  );
};

const takeTurn = function(board, difficulty = DIFFICULTY.EASY) {
  if (difficulty === DIFFICULTY.SUPER_EASY) return playRandomField(board);
  if (difficulty === DIFFICULTY.EASY) return playSmartField(board);
  if (difficulty === DIFFICULTY.HARD) return playBestField(board);
  console.log("Check your difficulties, you're using one I don't know of.");
};

export { DIFFICULTY, getOpponent, takeTurn };
