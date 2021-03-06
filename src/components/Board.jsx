import React from 'react';
import classNames from 'classnames';
import { getWinningLine } from '../utils/boardUtil';
import Field from './Field.jsx';
import '../styles/Board.css';

function Board({ board, pickField, computerToken }) {
  const winningLine = getWinningLine(board);
  // disabling all buttons when game is over to prevent further moves
  return (
    <fieldset className="Board" disabled={!!winningLine}>
      {/* giving context to button group to screen reader users */}
      <legend className="visually-hidden">
        TicTacToe fields, numbered 1 to 9 from left to right, top to bottom
      </legend>
      <div className="Board-grid-wrapper">
        <div className="Board-grid">
          {board.map((value, i) => (
            <Field
              key={i}
              position={i + 1}
              token={board[i]}
              onClick={() => pickField(i)}
              computerToken={computerToken}
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
