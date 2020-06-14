import React from 'react';

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
      <label>
        Me
        {getRadioButton('O')}
      </label>
      <label>
        The computer
        {getRadioButton('X')}
      </label>
    </fieldset>
  );
}

export default StartPlayerPicker;
