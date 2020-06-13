import React from 'react';
import Field from './Field.jsx';

// this component will display all the fields
// LEENA: obviously, make this better
function Board({ board, playField }) {
  const getField = (i) => {
    return <Field key={i} value={board[i]} onClick={() => playField(i)} />;
  };

  // LEENA: maybe automate rendering rows
  return (
    <div>
      <div>
        {getField(0)}
        {getField(1)}
        {getField(2)}
      </div>
      <div>
        {getField(3)}
        {getField(4)}
        {getField(5)}
      </div>
      <div>
        {getField(6)}
        {getField(7)}
        {getField(8)}
      </div>
    </div>
  );
}

export default Board;
