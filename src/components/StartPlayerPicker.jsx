import React from 'react';
import RadioGroup from './RadioGroup.jsx';

function StartPlayerPicker({
  nextGameComputerPlays,
  setNextGameComputerPlays
}) {
  return (
    <RadioGroup
      legendText="Who starts new games?"
      name="startPlayerPicker"
      checkedValue={nextGameComputerPlays}
      onChange={setNextGameComputerPlays}
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
