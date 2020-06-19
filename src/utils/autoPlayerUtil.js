import { DIFFICULTY } from '../constants/constants';
import {
  getRandomElement,
  determineSmartField,
  whoWillDefinitelyWinThis
} from '../utils/gameLogicUtil';
import * as brd from '../utils/boardUtil';

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

  // Note: this could have been just stored as a graph that is being traversed instead
  // of calculated on the fly
  const boardsWithDefiniteWinsForNextPlayer = [];
  const boardsWithDraws = [];
  for (let i = 0; i < board.length; i++) {
    // only consider empty boards
    if (!board[i]) {
      const testBoard = brd.playField(board, i);
      const winner = whoWillDefinitelyWinThis(testBoard);
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

  // this could happen if you start with random boards, for example
  // (or if I allowed switching difficulty level mid game).
  // But if the auto player always played optimally from the start,
  // "mathematically" you can always at least force a draw
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

export { takeTurn };
