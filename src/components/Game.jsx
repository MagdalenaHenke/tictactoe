import React, { useState } from 'react';
import { DEFAULT_COMPUTER_TOKEN, DIFFICULTY } from '../constants/constants';
import * as autoPlayer from '../utils/autoPlayerUtil';
import * as brd from '../utils/boardUtil';
import Board from './Board.jsx';
import StartPlayerPicker from './StartPlayerPicker.jsx';
import DifficultyPicker from './DifficultyPicker.jsx';
import '../styles/Game.css';

/* Choices I made
- choice: x always starts
- choices made: I'm letting prettier make all of my choices
- I'm choosing to define all my css myself instead of using bootstrap / bulma...cause I think then there's less bloat
- I'm not concerned about performance here, because...I don't have to be concerned
- choice: waiting for a moment before displaying computer turn all happens through css - the board state is updated all in one
- choice: handling display logic in css and leveraging the power of html over introducing react
- choice: I'm chosing to only build this for chrome because then I could selfishly use this for learning
- I'm recalculating things all over. Cause I can.
*/

/* Things to do
- make layout work on mobile!
- looks like you can use sass. nifty. do that.
- on click, set focus back to the first free element in the board
- maybe add keyboard interactions? up and down and stuff
- on game end, move focus to "start new game" button
- maybe FINALLY get to play with focus-visible
- think throuhg all accessibility concerns
- keep some tally/leaderboard of how many games were won?
- push something to local state to allow for refresh?
- comment in all the components what they do, if you feel like it
- fix things on firefox at least a little...custom focus states and stuff to look better on firefox
*/

/* Maybe things to do
- allow extending this to bigger boards?
- considered using styled components because that would have been fuuuuuun
*/

// This component will
// - keep track of board state
// - keep track of whose turn it is
// - keep track of whether someone won
// - keep track of whether the game is over
function Game() {
  // choice I'm making: only keep things on state that can't be derived from state
  const [board, setBoard] = useState(
    brd.getNewBoard(DEFAULT_COMPUTER_TOKEN, DIFFICULTY.DEFAULT)
  );
  const [difficulty, setDifficulty] = useState(DIFFICULTY.DEFAULT);
  const [computerToken, setComputerToken] = useState(DEFAULT_COMPUTER_TOKEN);
  const [nextGameComputerToken, setNextGameComputerToken] = useState(
    DEFAULT_COMPUTER_TOKEN
  );

  const startNewGame = () => {
    setComputerToken(nextGameComputerToken); // LEENA: this really might be nicer with a state reducer
    setBoard(brd.getNewBoard(nextGameComputerToken, difficulty));
  };

  // playing a field is the same as also the computer playing a field
  // LEENA: maybe this should be a good old use Reducer
  const pickField = (index) => {
    setBoard((oldBoard) => {
      const newBoard = oldBoard.slice();
      newBoard[index] = brd.getNextPlayer(oldBoard);

      // if the game isn't over, let the computer also make a move
      if (!brd.getWinner(newBoard) && !brd.isFull(newBoard)) {
        return autoPlayer.takeTurn(newBoard, difficulty);
      } else {
        return newBoard;
      }
    });
  };

  // maybe just fold these under below?
  const winner = brd.getWinner(board);
  const isBoardFull = brd.isFull(board);

  // LEENA: maybe state machine this?
  let statusText = `You're playing as: ${autoPlayer.getOpponent(
    computerToken
  )}`;
  if (winner)
    statusText = `${winner === computerToken ? 'The computer' : 'You'} won!`;
  else if (isBoardFull) statusText = 'We have a tie!';
  else if (brd.isCatsGame(board)) statusText = "...cat's game";

  return (
    <div className="Game">
      <h1 className="Game-title">Tic Tac Toe</h1>
      <div>
        <div className="Game-layout">
          <div className="Game-layout--status">{statusText}</div>
          <div className="Game-layout--board">
            <Board
              board={board}
              pickField={pickField}
              computerToken={computerToken}
            />
          </div>
          <div className="Game-layout--button">
            <button className="Game-button" onClick={startNewGame}>
              Start New Game
            </button>
          </div>
          <div className="Game-layout--options">
            <DifficultyPicker
              difficulty={difficulty}
              setDifficulty={setDifficulty}
            />
            <StartPlayerPicker
              nextGameComputerToken={nextGameComputerToken}
              setNextGameComputerToken={setNextGameComputerToken}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
