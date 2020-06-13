import React from 'react';
import Field from './Field.jsx';

// this component will display all the fields
// LEENA: obviously, make this better
function Board({ board, playField }) {
  return (
    <div>
      {board.map((fieldValue, index) => (
        <Field
          key={index}
          value={fieldValue}
          onClick={() => playField(index)}
        />
      ))}
    </div>
  );
}

export default Board;
