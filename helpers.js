const { Ships } = require('./types');

const getEmptyHitCountsObject = () => {
  const hitCounts = { ...Ships };

  Object.keys(hitCounts).forEach((ship) => {
    hitCounts[ship] = 0;
  });

  return hitCounts;
};

const getEmptyBoard = (defaultValue) => Array
  .from({ length: 10 }, () => Array(10)
    .fill(defaultValue));

const validCell = (x, y, board) => x >= 0 && x < board.length && y >= 0 && y < board[x].length;

const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];

const getRandomGameState = () => {
  const getRandomValue = (max) => Math.floor(Math.random() * max);

  const playerBoard = getEmptyBoard(null);

  const setBoatPosition = (ship) => {
    let startPosition = [
      getRandomValue(playerBoard.length),
      getRandomValue(playerBoard[0].length),
    ];

    const startDirection = getRandomValue(directions.length);
    const shipLength = Ships[ship];

    const getNextDirection = (direction) => (direction + 1) % directions.length;

    const isValidStartPosition = (position, direction) => {
      const [x, y] = direction;

      for (let i = 0; i < shipLength; i += 1) {
        const nextX = position[0] + (i * x);
        const nextY = position[1] + (i * y);
        if (!(
          validCell(nextX, nextY, playerBoard) && playerBoard[nextX][nextY] === null)) {
          return false;
        }
      }

      return true;
    };

    let validStart = isValidStartPosition(startPosition, directions[startDirection]);
    let currentDirection = startDirection;

    while (!validStart) {
      currentDirection = getNextDirection(currentDirection);

      if (currentDirection === startDirection) {
        startPosition = [
          getRandomValue(playerBoard.length),
          getRandomValue(playerBoard[0].length),
        ];
      }

      validStart = isValidStartPosition(startPosition, directions[currentDirection]);
    }

    const [x, y] = directions[currentDirection];

    for (let i = 0; i < shipLength; i += 1) {
      const nextX = startPosition[0] + (i * x);
      const nextY = startPosition[1] + (i * y);

      playerBoard[nextX][nextY] = ship;
    }
  };

  Object.keys(Ships).forEach((ship) => {
    setBoatPosition(ship);
  });

  return playerBoard;
};

const isEndGame = (hitCounts) => JSON.stringify(hitCounts) === JSON.stringify(Ships);

const getOtherPlayer = (players, currentPlayerID) => players
  .find((plr) => plr.id !== currentPlayerID);

module.exports = {
  getRandomGameState,
  getEmptyBoard,
  getEmptyHitCountsObject,
  isEndGame,
  getOtherPlayer,
  validCell,
  directions,
};
