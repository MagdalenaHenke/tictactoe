import React from 'react';
import '../styles/RadioGroup.css';

function RadioGroup({ legendText, checkedValue, name, options, onChange }) {
  return (
    <fieldset>
      <legend className="RadioGroup-legend">{legendText}</legend>
      {options.map((option) => (
        <label className="RadioGroup-label" key={option.label}>
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

export default RadioGroup;
