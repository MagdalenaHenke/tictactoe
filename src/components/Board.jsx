import React from 'react';
import Field from './Field.jsx';
import '../styles/Board.css';

// this component will display all the fields
function Board({ board, playField, isGameOver }) {
  return (
    <fieldset className="Board" disabled={isGameOver}>
      {/* disabled all buttons when game is over to prevent further moves */}
      <legend className="visually-hidden">
        TicTacToe fields, numbered 1 - 9
      </legend>
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
    </fieldset>
  );
}

export default Board;
