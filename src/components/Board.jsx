import React from 'react';
import Field from './Field.jsx';
import '../styles/Board.css';
import classNames from 'classnames';

// this component will display all the fields
function Board({ board, playField, winningLine }) {
  // LEENA: maybe I don't need winner
  return (
    <fieldset className="Board" disabled={!!winningLine}>
      {/* disabled all buttons when game is over to prevent further moves */}
      <legend className="visually-hidden">
        TicTacToe fields, numbered 1 - 9
      </legend>
      <div className="Board-grid-wrapper">
        <div className="Board-grid">
          {board.map((value, i) => (
            <Field
              key={i}
              position={i + 1}
              playedBy={board[i]}
              onClick={() => playField(i)}
            />
          ))}
        </div>
        {/* line that crosses through winning fields */}
        <div
          className={classNames('Board-line', {
            [`Board-line--${winningLine}`]: !!winningLine
          })}
        ></div>
      </div>
    </fieldset>
  );
}

export default Board;
