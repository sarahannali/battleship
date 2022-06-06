const ships = {
  Carrier: 5,
  Battleship: 4,
  Cruiser: 3,
  Submarine: 3,
  Destroyer: 2,
};

function getRandomGameState() {
  const getRandomValue = (max) => Math.floor(Math.random() * max);

  const playerBoard = Array.from({ length: 10 }, () => Array(10).fill(null));

  const setBoatPosition = (ship) => {
    let startPosition = [
      getRandomValue(playerBoard.length),
      getRandomValue(playerBoard[0].length),
    ];

    const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    const startDirection = getRandomValue(directions.length);
    const shipLength = ships[ship];

    const getNextDirection = (direction) => (direction + 1) % directions.length;

    const isValidStartPosition = (position, direction) => {
      const [x, y] = direction;

      for (let i = 0; i < shipLength; i += 1) {
        const nextX = position[0] + (i * x);
        const nextY = position[1] + (i * y);
        if (!(
          nextX >= 0 && nextX < playerBoard.length
          && nextY >= 0 && nextY < playerBoard[0].length
            && playerBoard[nextX][nextY] === null)) {
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

  Object.keys(ships).forEach((ship) => {
    setBoatPosition(ship);
  });

  return playerBoard;
}

module.exports = {
  getRandomGameState,
};
