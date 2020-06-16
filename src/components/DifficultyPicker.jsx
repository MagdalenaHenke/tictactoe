import React from 'react';
import { DIFFICULTY } from '../utils/autoPlayerUtil';
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
          label: 'Superduper Easypeasy',
          value: DIFFICULTY.SUPER_EASY
        },
        {
          label: 'Easy',
          value: DIFFICULTY.EASY
        },
        {
          label: 'Impossibly Hard',
          value: DIFFICULTY.HARD
        }
      ]}
    />
  );
}

export default DifficultyPicker;
