import React from 'react';
// this component will display just a single field
// think about accessibility - should these be checkboxes?
function Field({ value, onClick }) {
  return (
    <button disabled={!!value} onClick={onClick}>
      {value}
    </button>
  );
}

export default Field;
