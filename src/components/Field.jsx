import '../styles/Field.css';

import React from 'react';
// this component will display just a single field
// think about accessibility - should these be checkboxes?
function Field({ playedBy, onClick, position }) {
  return (
    <button className="Field" disabled={!!playedBy} onClick={onClick}>
      <span className="visually-hidden">
        {/* announce field position and playedBy to screen reader users */}
        {`Field ${position}: ${playedBy ? '' : 'empty'}`}
      </span>
      {playedBy}
    </button>
  );
}

export default Field;
