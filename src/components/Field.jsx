import React from 'react';
import classNames from 'classnames';
import '../styles/Field.css';

// LEENA: think about accessibility - should these be checkboxes?
function Field({ token, onClick, position, computerToken }) {
  return (
    <button
      className={classNames('Field', {
        'Field--filled': token,
        'Field--autoFilled': token === computerToken
      })}
      disabled={!!token}
      onClick={onClick}
    >
      <span className="visually-hidden">
        {/* announce field position and token to screen reader users */}
        {`Field ${position}: ${token ? '' : 'empty'}`}
      </span>
      {token}
    </button>
  );
}

export default Field;
