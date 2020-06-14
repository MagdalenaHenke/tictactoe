import React, { useState } from 'react';
import Board from './Board.jsx';
import * as brd from '../utils/boardUtil';
import * as autoPlayer from '../utils/autoPlayerUtil';
import '../styles/Game.css';

// This component will
// - keep track of board state
// - keep track of whose turn it is
// - keep track of whether someone won
// - keep track of whether the game is over
// - allow starting a new game for now, except maybe I'll move that out later if I want a leaderboard
// - for now there is no computer, but eventually, who is the computer, and who plays first
// - allow extending this to bigger boards?
// - some cool thing, highlight/color the winning row? draw a line through winning three?
// X will always start, but who will be the first player?
// assumption I'm making: you all double down on arrow functions
// - choices made: I'm letting prettier make all of my choices
// - maybe add keyboard interactions? up and down and stuff
// - on click, set focus back to the first free element in the board
// - considered using styled components because that would have been fuuuuuun
// - I'm choosing to define all my css myself instead of using bootstrap / bulma...cause I think then there's less bloat
// - on game end, move focus to "start new game" button
// - maybe FINALLY get to play with focus-visible
// - I'm chosing to only care about this in chrome
// - I'm not concerned about performance here, because...I don't have to be concerned
// - I started out with easy being just random...that was very boring
// - for forcing a draw / being unbeatable: both always make me cross my threes, and always make him not cross his threes
// - choice: handling display logic in css and leveraging the power of html over introducing react
// - choice: waiting for a moment before displaying computer turn all happens through css - the board state is updated all in one

function Game({ difficulty = autoPlayer.DIFFICULTY.EASY, firstPlayer }) {
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
  // LEENA: maybe this should be a good old use Reducer
  const playField = (index) => {
    setBoard((oldBoard) => {
      const newBoard = oldBoard.slice();
      newBoard[index] = brd.nextPlayer(oldBoard);

      // only let the computer play if we haven't won
      if (brd.winner(newBoard) || brd.isFull(newBoard)) {
        return newBoard;
      } else {
        const fieldToPlayByComputer = autoPlayer.takeTurn(newBoard, difficulty);
        newBoard[fieldToPlayByComputer] = brd.nextPlayer(newBoard);
        return newBoard;
      }
    });
  };

  // maybe just fold these under below?
  const winner = brd.winner(board);
  const isBoardFull = brd.isFull(board);
  const nextPlayer = brd.nextPlayer(board);
  const isGameOver = winner || isBoardFull;

  // LEENA: make this prettier
  // LEENA: disable entire board when someone won
  // LEENA: maybe state machine this?
  let statusText = `Next up: ${nextPlayer}`; // LEENA: edit this, just make it indicator of who you're playing as
  if (winner) statusText = `${winner} won!`;
  else if (isBoardFull) statusText = 'We have a tie!';

  return (
    <div className="Game">
      <h1 className="Game-title">Tic Tac Toe</h1>
      <div>{statusText}</div>
      <Board board={board} playField={playField} isGameOver={isGameOver} />
      <button className="Game-button" onClick={startNewGame}>
        Start New Game
      </button>
    </div>
  );
}

export default Game;
