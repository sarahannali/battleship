const isValidShipPlacement = (board, startRow, startCol, shipLength, vertical) => {
  const direction = vertical ? [1, 0] : [0, 1];
  const [x, y] = direction;

  for (let i = 0; i < shipLength; i += 1) {
    const nextX = startRow + (i * x);
    const nextY = startCol + (i * y);

    if (
      nextX < 0
      || nextX >= board.length
      || nextY < 0
      || nextY >= board[0].length
      || board[nextX][nextY] !== board[startRow][startCol]
    ) {
      return false;
    }
  }

  return true;
};

export default isValidShipPlacement;
