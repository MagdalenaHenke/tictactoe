import React from 'react';
// this component will display just a single field
function Field({ value, onClick }) {
  return (
    <button disabled={!!value} onClick={onClick}>
      {value}
    </button>
  );
}

export default Field;
