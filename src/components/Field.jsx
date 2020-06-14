import '../styles/Field.css';
import classNames from 'classnames';

import React from 'react';
// this component will display just a single field
// think about accessibility - should these be checkboxes?
function Field({ playedBy, onClick, position }) {
  return (
    <button
      className={classNames('Field', {
        'Field--filled': playedBy,
        'Field--autoFilled': playedBy === 'O' // Leena: fix that logic, autoplayer doesn't have to be O
      })}
      disabled={!!playedBy}
      onClick={onClick}
    >
      <span className="visually-hidden">
        {/* announce field position and playedBy to screen reader users */}
        {`Field ${position}: ${playedBy ? '' : 'empty'}`}
      </span>
      {playedBy}
    </button>
  );
}

export default Field;
