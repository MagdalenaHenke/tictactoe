import React, { useState } from 'react';
import { DEFAULT_COMPUTER_TOKEN, DIFFICULTY } from '../constants/constants';

import * as autoPlayer from '../utils/autoPlayerUtil';
import * as brd from '../utils/boardUtil';
import Board from './Board.jsx';
import StatusText from './StatusText.jsx';
import StartPlayerPicker from './StartPlayerPicker.jsx';
import DifficultyPicker from './DifficultyPicker.jsx';
import '../styles/Game.css';

function Game() {
  const [board, setBoard] = useState(
    brd.getNewBoard(DEFAULT_COMPUTER_TOKEN, DIFFICULTY.DEFAULT)
  );

  // current difficulty and token the computer plays (e.g. 'O')
  const [difficulty, setDifficulty] = useState(DIFFICULTY.DEFAULT);
  const [computerToken, setComputerToken] = useState(DEFAULT_COMPUTER_TOKEN);

  // difficulty and computerToken for the next game (you can switch difficulty / who
  // you're playing as while you have a game going on, but it'll only kick in with
  // the beginning of the next round)
  const [nextGameDifficulty, setNextGameDifficulty] = useState(
    DIFFICULTY.DEFAULT
  );
  const [nextGameComputerToken, setNextGameComputerToken] = useState(
    DEFAULT_COMPUTER_TOKEN
  );

  const startNewGame = () => {
    setDifficulty(nextGameDifficulty);
    setComputerToken(nextGameComputerToken);
    setBoard(brd.getNewBoard(nextGameComputerToken, difficulty));
  };

  // playing a field is the same as also the computer playing a field
  const pickField = (index) => {
    setBoard((oldBoard) => {
      const newBoard = brd.playField(oldBoard, index);

      // if the game isn't over, let the computer also make a move
      if (!brd.getWinner(newBoard) && !brd.isFull(newBoard)) {
        return autoPlayer.takeTurn(newBoard, difficulty);
      }
      return newBoard;
    });
  };

  return (
    <div className="Game">
      <h1 className="Game-title">Tic Tac Toe</h1>
      <div>
        <div className="Game-layout">
          <div className="Game-layout--status">
            <StatusText board={board} computerToken={computerToken} />
          </div>
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
              difficulty={nextGameDifficulty}
              setDifficulty={setNextGameDifficulty}
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
