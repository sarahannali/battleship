/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Box, Stack } from '@mui/material';
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

  const squareSize = boxSize * 0.4;
  const offset = boxSize * 0.2;

  const defaultCursor = status === Status.PreGame ? 'grab' : 'default';

  return (
    <Draggable
      grid={[boxSize, boxSize]}
      onDrag={onDrag}
      onStop={onStop}
      disabled={status === Status.InGame}
    >
      <Box
        sx={{
          height: '100%', width: '1000px', padding: '5px', cursor: dragging ? 'grabbing' : defaultCursor,
        }}
      >
        <Stack direction={rotated ? 'column' : 'row'}>
          {
          [...Array(length)]
            .map(() => (
              <Box
                sx={({
                  height: `${squareSize}px`,
                  width: `${squareSize}px`,
                  marginBottom: `${offset}px`,
                  marginRight: `${offset}px`,
                  padding: '10px',
                  borderRadius: '2px',
                  backgroundColor: valid ? VALID_COLOR : INVALID_COLOR,
                  transition: 'background-color .1s ease',
                })}
              >
                <Box sx={({
                  height: `${squareSize}px`,
                  width: `${squareSize}px`,
                  backgroundColor: '#000',
                  margin: 'auto',
                  opacity: '50%',
                  transition: 'background-color .1s ease',
                })}
                />
              </Box>
            ))
        }
        </Stack>
      </Box>
    </Draggable>
  );
}

export default Ship;
