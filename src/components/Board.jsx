import React from 'react';
import Field from './Field.jsx';
import '../styles/Board.css';
import classNames from 'classnames';
import * as brd from '../utils/boardUtil';

// this component will display all the fields
function Board({ board, playField, computerToken }) {
  // I know I know I'm recalculating this
  // but it's because the BOARD is concerned about displaying the
  // winning line. The Game isn't.
  const winningLine = brd.winningLine(board);
  return (
    // disabling all buttons when game is over to prevent further moves
    <fieldset className="Board" disabled={!!winningLine}>
      <legend className="visually-hidden">
        TicTacToe fields, numbered 1 - 9
      </legend>
      <div className="Board-grid-wrapper">
        <div className="Board-grid">
          {board.map((value, i) => (
            <Field
              key={i}
              position={i + 1}
              token={board[i]}
              onClick={() => playField(i)}
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
