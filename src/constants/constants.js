const PLAYERS = ['X', 'O']; // have fun with this. Emojis!
const DEFAULT_COMPUTER_TOKEN = PLAYERS[1];

// Note: can also create these on the fly
// but this is much easier to read and debug
const ROWS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8]
];
const COLUMNS = [
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8]
];
const DIAGONALS = [
  [0, 4, 8],
  [6, 4, 2]
];

const LINES = [...ROWS, ...COLUMNS, ...DIAGONALS];

const DIFFICULTY = {
  DEFAULT: 'easy',
  SUPER_EASY: 'easyPeasy',
  EASY: 'easy',
  HARD: 'hard'
};

export {
  PLAYERS,
  DEFAULT_COMPUTER_TOKEN,
  ROWS,
  COLUMNS,
  DIAGONALS,
  LINES,
  DIFFICULTY
};
