// LEENA: pull all of these out into helper functions
const PLAYERS = ['X', 'O']; // maybe share this

// LEENA: comment on all of these functions
const getNextPlayer = (board) => {
  const numberOfFilledFields = board.reduce(
    (sum, value) => (!!value ? sum + 1 : sum),
    0
  );
  const nextPlayer = PLAYERS[numberOfFilledFields % 2]; // X for odd number of fields played, O otherwise
  return nextPlayer;
};

// LEENA: maybe clean this up
const findWinner = (board) => {
  const whoTickedAll = (fields) => {
    if (fields.every((field) => field === PLAYERS[0])) return PLAYERS[0];
    if (fields.every((field) => field === PLAYERS[1])) return PLAYERS[1];
    return null;
  };

  // check all rows and columns
  for (let i = 0; i < 3; i++) {
    const row = board.slice(3 * i, 3 * i + 3);
    const column = [board[i], board[i + 3], board[i + 6]];
    const allTickedBy = whoTickedAll(row) || whoTickedAll(column);
    if (allTickedBy) return allTickedBy;
  }

  // check diagonals
  const diagonal1 = [board[0], board[4], board[8]];
  const diagonal2 = [board[6], board[4], board[2]];

  return whoTickedAll(diagonal1) || whoTickedAll(diagonal2) || null;
};

const isBoardFull = (board) => {
  const gotPlayed = (fieldValue) => !!fieldValue; // if value in a field is truthy, that field got played
  return board.every(gotPlayed);
};

export { getNextPlayer, findWinner, isBoardFull, PLAYERS };
