import React from 'react';
import '../styles/Picker.css';

function Picker({ legendText, checkedValue, name, options, onChange }) {
  return (
    <fieldset>
      <legend className="Picker-legend">{legendText}</legend>
      {options.map((option) => (
        <label className="Picker-label" key={option.label}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={option.value === checkedValue}
            onChange={(evt) => onChange(evt.target.value)}
          />
          {option.label}
        </label>
      ))}
    </fieldset>
  );
}

export default Picker;
