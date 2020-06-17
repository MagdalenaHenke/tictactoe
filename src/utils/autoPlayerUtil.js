import { PLAYERS, DIFFICULTY } from '../constants/constants';
import * as brd from '../utils/boardUtil';

// returns a random element from an array
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// returns opponent of player
function getOpponent(player) {
  return player === PLAYERS[0] ? PLAYERS[1] : PLAYERS[0];
}

// checks whether there are "obvious" fields to play and
// returns one of those.
// Checks whether next player can win in one,
// or else whether next player can prevent opponent from winning in one
function determineSmartField(board) {
  // Note on performance: iterating through all possible fields is _not_ the fastest, it's pretty
  // poor on theoretical runtime. But, since this is only 9 fields, and not intended to be extendable,
  // it runs plenty fast enough. I'm chosing not to overoptimize performance here, and prioritizing eaier
  // to read code
  const nextPlayer = brd.getNextPlayer(board);
  const opponent = getOpponent(nextPlayer);

  const nextPlayerWinInOneFields = [];
  const opponentWinInOneFields = [];

  // check each free field
  for (let i = 0; i < board.length; i++) {
    // only check free fields
    if (!board[i]) {
      // does taking that field make nextPlayer win?
      const testBoard = brd.playField(board, i);
      if (brd.getWinner(testBoard) === nextPlayer) {
        nextPlayerWinInOneFields.push(i);
      } else {
        // does taking that field prevent opponent from crossing a three in their next move?
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
}

// Note: instead of generating all relevant board options on the fly, we could just
// do it once and pass in a big old dictionary that already has this precomputed.
// We'd be trading space against runtime. At this scale, neither one is really a concern.
// But definitely something to keep in mind.
const whoWillWinThis = (function() {
  const memo = {}; // for memoization

  const memoAndReturn = (board, winner) => {
    memo[board] = winner;
    return winner;
  };

  function whoWillWinThis(board) {
    if (memo[board] !== undefined) return memo[board];

    const nextPlayer = brd.getNextPlayer(board);

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
      const winner = whoWillWinThis(testBoard);
      return memoAndReturn(board, winner);
    }

    let whoWinsIfIPlay = [];
    for (let i = 0; i < board.length; i++) {
      // consider only empty fields
      if (!board[i]) {
        const testBoard = brd.playField(board, i);
        const winner = whoWillWinThis(testBoard);
        whoWinsIfIPlay.push(winner);
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
  }

  return whoWillWinThis;
})();

// play a random open field
function playRandomField(board) {
  const numEmptyFields = 9 - brd.numTurnsPlayed(board);
  const r = Math.floor(Math.random() * numEmptyFields);
  let count = 0;
  let i = 0;

  // play the r-th empty field
  while (i <= board.length) {
    if (!board[i] && count === r) return brd.playField(board, i);
    if (!board[i]) count++;
    i++;
  }
}

// if there is an obvious "smart field" for the next move, play it
// otherwise pick a random open field
function playSmartField(board) {
  const smartField = determineSmartField(board);
  if (smartField !== null) return brd.playField(board, smartField);
  return playRandomField(board);
}

// if there are moves that make the next player win the game for sure, use one of those
// avoid moves that for sure make the next player lose
// pick from the remaining ones at random
function playBestField(board) {
  const nextPlayer = brd.getNextPlayer(board);

  const boardsWithDefiniteWinsForNextPlayer = [];
  const boardsWithDraws = [];
  for (let i = 0; i < board.length; i++) {
    // only consider empty boards
    if (!board[i]) {
      const testBoard = brd.playField(board, i);
      const winner = whoWillWinThis(testBoard);
      if (winner === nextPlayer) {
        boardsWithDefiniteWinsForNextPlayer.push(testBoard);
      } else if (winner === null) {
        boardsWithDraws.push(testBoard);
      }
    }
  }

  if (boardsWithDefiniteWinsForNextPlayer.length > 0) {
    return getRandomElement(boardsWithDefiniteWinsForNextPlayer);
  }

  if (boardsWithDraws.length > 0) {
    return getRandomElement(boardsWithDraws);
  }

  console.log(
    'It thinks that there is no move that allows forcing a draw. We should not have gotten here.'
  );
}

// take a turn based on the selected difficulty
function takeTurn(board, difficulty = DIFFICULTY.EASY) {
  if (difficulty === DIFFICULTY.SUPER_EASY) return playRandomField(board);
  if (difficulty === DIFFICULTY.EASY) return playSmartField(board);
  if (difficulty === DIFFICULTY.HARD) return playBestField(board);
  console.log("Check your difficulties, you're using one I don't know of.");
}

export { getOpponent, takeTurn };
