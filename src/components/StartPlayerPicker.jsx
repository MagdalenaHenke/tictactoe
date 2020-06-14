import React from 'react';
import '../styles/StartPlayerPicker.css';

function StartPlayerPicker({
  nextGameComputerPlays,
  setNextGameComputerPlays
}) {
  const getRadioButton = (player) => (
    <input
      type="radio"
      name="startingPlayer"
      checked={nextGameComputerPlays === player}
      onChange={() => setNextGameComputerPlays(player)}
    />
  );

  return (
    <fieldset>
      <legend>Who starts new games?</legend>
      <label className="StartPlayerPicker-label">
        {getRadioButton('O')}
        Me
      </label>
      <label className="StartPlayerPicker-label">
        {getRadioButton('X')}
        The computer
      </label>
    </fieldset>
  );
}

export default StartPlayerPicker;
