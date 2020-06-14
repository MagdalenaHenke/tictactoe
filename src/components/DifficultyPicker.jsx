import React from 'react';
import RadioGroup from './RadioGroup.jsx';

function DifficultyPicker({ difficulty, setDifficulty }) {
  return (
    <RadioGroup
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
