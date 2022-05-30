/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Box } from '@mui/material';
import Draggable from 'react-draggable';
import isValidShipPlacement from '../Helpers/ValidShipPlacement';

const VALID_COLOR = '#08F7FE';
const INVALID_COLOR = '#E92746';

function Ship({
  board, length, boxSize, vertical, rowOffset, colOffset,
}) {
  const [rotated, setRotated] = useState(vertical);
  const [valid, setValid] = useState(
    isValidShipPlacement(board, rowOffset, colOffset, length, vertical),
  );

  const onDrag = () => {
    setValid(true);
  };

  const onStop = (e, data) => {
    const newRow = rowOffset + (data.y / boxSize);
    const newCol = colOffset + (data.x / boxSize);

    setValid(isValidShipPlacement(board, newRow, newCol, length, vertical));
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
    >
      <Box
        sx={{ height: `${shipSize}px`, width: `${shipSize}px`, padding: '5px' }}
        onDoubleClick={() => setRotated(!rotated)}
      >
        <Box sx={{
          height: rotated ? longSide : shortSide,
          width: rotated ? shortSide : longSide,
          borderRadius: '10px',
          backgroundColor: valid ? VALID_COLOR : INVALID_COLOR,
          transition: 'background-color .1s ease',
          cursor: 'hand',
          margin: '0px auto',
        }}
        />
      </Box>
    </Draggable>
  );
}

export default Ship;
