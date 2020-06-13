import React, { useState } from 'react';
import Board from './Board.jsx';
import { getNextPlayer, findWinner, isBoardFull } from '../utils/gameUtil';

// This component will
// - keep track of board state
// - keep track of whose turn it is
// - keep track of whether someone won
// - keep track of whether the game is over
// - allow starting a new game for now, except maybe I'll move that out later if I want a leaderboard
// - for now there is no computer, but eventually, who is the computer, and who plays first
// - allow extending this to bigger boards?
// X will always start, but who will be the first player?

function Game() {
  // choice I'm making: only keep things on state that can't be derived from state
  const [board, setBoard] = useState(Array(9).fill(null)); // LEENA: possibly dry empty array creation

  const startNewGame = () => {
    setBoard(Array(9).fill(null));
  };

  const playField = (index) => {
    const nextPlayer = getNextPlayer(board);
    setBoard((oldBoard) =>
      oldBoard.map((val, i) => (i === index ? nextPlayer : val))
    );
  };

  const winner = findWinner(board);
  const boardIsFull = isBoardFull(board);

  // LEENA: make this prettier
  // LEENA: disable entire board when someone won
  return (
    <div>
      {winner && `${winner} won!`}
      {!winner && boardIsFull && 'We have a tie!'}
      <Board board={board} playField={playField} />
      <button onClick={startNewGame}>Start New Game</button>
    </div>
  );
}

export default Game;
