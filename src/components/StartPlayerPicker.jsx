import React from 'react';
import RadioGroup from './RadioGroup.jsx';

function StartPlayerPicker({
  nextGameComputerToken,
  setNextGameComputerToken
}) {
  return (
    <RadioGroup
      legendText="Who starts new games?"
      name="startPlayerPicker"
      checkedValue={nextGameComputerToken}
      onChange={setNextGameComputerToken}
      options={[
        {
          label: 'Me',
          value: 'O' // LEENA: don't use strings
        },
        {
          label: 'The computer',
          value: 'X'
        }
      ]}
    />
  );
}

export default StartPlayerPicker;
