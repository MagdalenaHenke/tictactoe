import React from 'react';
import {
  getWinner,
  isFull,
  isCatsGame,
  numTurnsPlayed
} from '../utils/boardUtil';
import { getOpponent } from '../utils/gameLogicUtil';

// aria-live region to read changes to the screen reader to inform about computer moves.
// Each move is announced by player move, then computer move, eg: "X 5, O 9"
function StatusText({ board, computerToken }) {
  let statusText = `You're playing as: ${getOpponent(computerToken)}`;

  const winner = getWinner(board);
  if (winner)
    statusText = `${winner === computerToken ? 'The computer' : 'You'} won!`;
  else if (isFull(board)) statusText = 'We have a tie!';
  else if (isCatsGame(board)) statusText = "...cat's game";

  return (
    <div aria-live="polite">
      {numTurnsPlayed(board) === 0 && (
        <span className="visually-hidden">A new game started</span>
      )}
      {board
        .map((field, i) => [field, i])
        // sorting to always announce the player's move first
        .sort((a, b) => (a[0] === computerToken ? 1 : -1))
        .map(([field, i]) => (
          <span className="visually-hidden" key={i}>
            {field ? `${field} ${i + 1}` : ''}
          </span>
        ))}
      <span>{statusText}</span>
    </div>
  );
}

export default StatusText;
