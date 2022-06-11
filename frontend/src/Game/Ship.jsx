/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Box } from '@mui/material';
import Draggable from 'react-draggable';
import isValidShipPlacement from '../Helpers/ValidShipPlacement';
import { ships, Status } from '../Helpers/Types';
import { useGameContext } from '../Contexts/GameContext';

const VALID_COLOR = '#08F7FE';
const INVALID_COLOR = '#E92746';

function Ship({
  ship, board, boxSize, vertical, rowOffset, colOffset, updateBoard,
}) {
  const { status } = useGameContext();

  const [rotated, setRotated] = useState(vertical);
  const [valid, setValid] = useState(
    isValidShipPlacement(board, rowOffset, colOffset, ships[ship], vertical),
  );
  const [dragging, setDragging] = useState(false);

  const length = ships[ship];

  const onDrag = (e, data) => {
    setDragging(true);
    const newRow = rowOffset + (data.y / boxSize);
    const newCol = colOffset + (data.x / boxSize);

    setValid(isValidShipPlacement(board, newRow, newCol, length, rotated));
  };

  const rotateShip = () => {
    updateBoard(ship, rowOffset, colOffset, !rotated);
    setRotated(!rotated);
  };

  const onStop = (e, data) => {
    if (dragging) {
      const newRow = rowOffset + (data.y / boxSize);
      const newCol = colOffset + (data.x / boxSize);

      updateBoard(ship, newRow, newCol, rotated);
    } else {
      rotateShip();
    }
    setDragging(false);
  };

  const shipSize = boxSize * 0.8;
  const offset = boxSize * 0.2;

  const longSide = `${(shipSize * length + offset * (length - 1))}px`;
  const shortSide = `${shipSize}px`;

  return (
    <Draggable
      grid={[boxSize, boxSize]}
      onDrag={onDrag}
      onStop={onStop}
      disabled={status === Status.InGame}
    >
      <Box
        sx={{
          height: `${shipSize}px`, width: `${shipSize}px`, padding: '5px', cursor: dragging ? 'grabbing' : 'grab',
        }}
      >
        <Box sx={{
          height: rotated ? longSide : shortSide,
          width: rotated ? shortSide : longSide,
          borderRadius: '10px',
          backgroundColor: valid ? VALID_COLOR : INVALID_COLOR,
          transition: 'background-color .1s ease',
          cursor: status === Status.PreGame ? 'hand' : 'default',
          margin: '0px auto',
        }}
        />
      </Box>
    </Draggable>
  );
}

export default Ship;
