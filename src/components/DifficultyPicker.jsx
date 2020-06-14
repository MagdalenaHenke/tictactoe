import React from 'react';
import Picker from './Picker.jsx';

function DifficultyPicker({ difficulty, setDifficulty }) {
  return (
    <Picker
      legendText="How hard do you want this to be?"
      name="difficultyPicker"
      checkedValue={difficulty}
      onChange={setDifficulty}
      options={[
        {
          label: 'Easy',
          value: 'easy' // LEENA: don't use strings
        },
        {
          label: 'Impossibly Hard',
          value: 'hard'
        }
      ]}
    />
  );
}

export default DifficultyPicker;
