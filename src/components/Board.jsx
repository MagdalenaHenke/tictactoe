import React from 'react';
import Field from './Field.jsx';
import '../styles/Board.css';

// this component will display all the fields
function Board({ board, playField }) {
  return (
    <div className="Board">
      {board.map((value, i) => (
        <Field key={i} value={board[i]} onClick={() => playField(i)} />
      ))}
    </div>
  );
}

export default Board;
