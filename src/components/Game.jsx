import React, { useState } from 'react';
import Board from './Board.jsx';
import StartPlayerPicker from './StartPlayerPicker.jsx';
import DifficultyPicker from './DifficultyPicker.jsx';
import * as brd from '../utils/boardUtil';
import * as autoPlayer from '../utils/autoPlayerUtil';
import '../styles/Game.css';

// This component will
// - keep track of board state
// - keep track of whose turn it is
// - keep track of whether someone won
// - keep track of whether the game is over
// - allow extending this to bigger boards?
// - choice: x always starts
// - assumption I'm making: you all double down on arrow functions
// - choices made: I'm letting prettier make all of my choices
// - maybe add keyboard interactions? up and down and stuff
// - on click, set focus back to the first free element in the board
// - considered using styled components because that would have been fuuuuuun
// - I'm choosing to define all my css myself instead of using bootstrap / bulma...cause I think then there's less bloat
// - on game end, move focus to "start new game" button
// - maybe FINALLY get to play with focus-visible
// - I'm not concerned about performance here, because...I don't have to be concerned
// - I started out with easy being just random...that was very boring
// - for forcing a draw / being unbeatable: both always make me cross my threes, and always make him not cross his threes
// - choice: handling display logic in css and leveraging the power of html over introducing react
// - choice: waiting for a moment before displaying computer turn all happens through css - the board state is updated all in one
// - choice: I'm chosing to only build this for chrome because that was fun
// - keep some tally/leaderboard of how many games were won?
// - push something to local state to allow for refresh?
// - for now just on laptop, but make layout work on mobile!
// - accessibility concerns
// - I don't think I'm minifying anything

function Game() {
  // choice I'm making: only keep things on state that can't be derived from state
  const [difficulty, setDifficulty] = useState(autoPlayer.DIFFICULTY.EASY);
  const [nextGameComputerPlays, setNextGameComputerPlays] = useState('O');
  const [computerPlays, setComputerPlays] = useState('O'); // LEENA: rename this
  const [board, setBoard] = useState(brd.newBoard(computerPlays, difficulty));

  const startNewGame = () => {
    setComputerPlays(nextGameComputerPlays); // LEENA: this really might be nicer with a state reducer
    setBoard(brd.newBoard(nextGameComputerPlays, difficulty));
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
        const fieldToPlayByComputer = autoPlayer.takeTurn(
          newBoard,
          computerPlays,
          difficulty
        );
        newBoard[fieldToPlayByComputer] = brd.nextPlayer(newBoard);
        return newBoard;
      }
    });
  };

  // maybe just fold these under below?
  const { winner, winningLine } = brd.winner(board) || {};
  const isBoardFull = brd.isFull(board);

  // LEENA: make this prettier
  // LEENA: disable entire board when someone won
  // LEENA: maybe state machine this?
  let statusText = `You're playing as: ${computerPlays === 'X' ? 'O' : 'X'}`; // LEENA: use some const for who's who
  if (winner)
    statusText = `${winner === computerPlays ? 'The computer' : 'You'} won!`;
  // LEENA: more encouragement?
  else if (isBoardFull) statusText = 'We have a tie!';

  return (
    <div className="Game">
      <h1 className="Game-title">Tic Tac Toe</h1>
      <div>
        <div className="Game-layout">
          <div className="Game-layout--status">{statusText}</div>
          <div className="Game-layout--board">
            <Board
              board={board}
              playField={playField}
              winningLine={winningLine}
              computerPlays={computerPlays}
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
              nextGameComputerPlays={nextGameComputerPlays}
              setNextGameComputerPlays={setNextGameComputerPlays}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
