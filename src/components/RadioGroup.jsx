import React from 'react';
import '../styles/RadioGroup.css';

function RadioGroup({ legendText, checkedValue, name, options, onChange }) {
  return (
    <fieldset className="RadioGroup">
      <legend className="RadioGroup-legend">{legendText}</legend>
      {options.map((option) => (
        <label className="RadioGroup-label" key={option.label}>
          <input
            type="radio"
            name={name}
            className="visually-hidden"
            value={option.value}
            checked={option.value === checkedValue}
            onChange={(evt) => onChange(evt.target.value)}
          />
          <span className="RadioGroup-check" />
          {option.label}
        </label>
      ))}
    </fieldset>
  );
}

export default RadioGroup;
