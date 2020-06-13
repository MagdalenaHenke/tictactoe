import React, { useState } from 'react';
import Board from './Board.jsx';

// This component will
// - keep track of board state
// - keep track of whose turn it is
// - keep track of whether someone won
// - keep track of whether the game is over
// - allow starting a new game for now, except maybe I'll move that out later if I want a leaderboard
// - for now there is no computer, but eventually, who is the computer, and who plays first
// X will always start, but who will be the first player?
const PLAYERS = ['X', 'O'];

function Game() {
  const [board, setBoard] = useState(Array(9).fill(null)); // LEENA: possibly dry empty array creation

  const getNextPlayer = () => {
    const numberOfFilledFields = board.reduce(
      (sum, value) => (!!value ? sum + 1 : sum),
      0
    );
    const nextPlayer = PLAYERS[numberOfFilledFields % 2]; // X for odd number of fields played, O otherwise
    return nextPlayer;
  };

  const findWinner = () => {
    return null;
  };

  const isBoardFull = () => {
    const gotPlayed = (fieldValue) => !!fieldValue; // if value in a field is truthy, that field got played
    return board.every(gotPlayed);
  };

  const startNewGame = () => {
    setBoard(Array(9).fill(null));
  };

  const playField = (index) => {
    const nextPlayer = getNextPlayer();
    setBoard((oldBoard) =>
      oldBoard.map((val, i) => (i === index ? nextPlayer : val))
    );
  };

  const winner = findWinner();
  const boardIsFull = isBoardFull();

  // LEENA: make this prettier
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
