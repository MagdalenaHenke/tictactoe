import React, { useState } from 'react';
import Board from './Board.jsx';
import { getNextPlayer, findWinner, isBoardFull } from '../utils/boardUtil';
import { DIFFICULTY, autoPlayerTurn } from '../utils/autoPlayerUtil';

// This component will
// - keep track of board state
// - keep track of whose turn it is
// - keep track of whether someone won
// - keep track of whether the game is over
// - allow starting a new game for now, except maybe I'll move that out later if I want a leaderboard
// - for now there is no computer, but eventually, who is the computer, and who plays first
// - allow extending this to bigger boards?
// - some cool thing, highlight the winning row?
// X will always start, but who will be the first player?
// assumption I'm making: you all double down on arrow functions
// - choices made: I'm letting prettier make all of my choices

function Game({ difficulty = DIFFICULTY.EASY, firstPlayer }) {
  // maybe these live on state, depends
  // LEENA: use the firstPlayer
  // LEENA: for now, human is always first player, allow passing in who is first player
  // choice I'm making: only keep things on state that can't be derived from state
  const [board, setBoard] = useState(Array(9).fill(null)); // LEENA: possibly dry empty array creation

  const startNewGame = () => {
    // LEENA: if computer starts, fill one of the fields
    setBoard(Array(9).fill(null));
  };

  // playing a field is the same as also the computer playing a field
  const playField = (index) => {
    // immediately play the computers turn for now, but maybe wait a moment
    const nextPlayer = getNextPlayer(board);
    setBoard((oldBoard) => {
      const newBoard = oldBoard.map((val, i) =>
        i === index ? nextPlayer : val
      );
      if (!findWinner(newBoard)) {
        // only let the computer play if we haven't won
        // Leena: this is mildly gross redo this
        const fieldToPlayByComputer = autoPlayerTurn[difficulty](newBoard); // pull this out and add a delay
        newBoard[fieldToPlayByComputer] = 'O'; // LEENA: don't hardcode this
      }
      return newBoard;
    });
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
