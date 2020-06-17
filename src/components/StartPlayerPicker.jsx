import React from 'react';
import { PLAYERS } from '../constants/constants';
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
          value: PLAYERS[1]
        },
        {
          label: 'The computer',
          value: PLAYERS[0]
        }
      ]}
    />
  );
}

export default StartPlayerPicker;
