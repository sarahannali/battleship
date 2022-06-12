/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Box, Stack } from '@mui/material';
import Draggable from 'react-draggable';
import isValidShipPlacement from '../Helpers/ValidShipPlacement';
import { ships, Status } from '../Helpers/Types';
import { useGameContext } from '../Contexts/GameContext';
import { SHAKE_KEYFRAMES } from '../Helpers/Utils';

const VALID_COLOR = '#08F7FE';
// const INVALID_COLOR = '#E92746';

function Ship({
  ship, board, boxSize, vertical, rowOffset, colOffset, updateBoard,
}) {
  const { status } = useGameContext();
  const length = ships[ship];

  const [rotated, setRotated] = useState(vertical);
  const [valid, setValid] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [bounds, setBounds] = useState({
    top: (-50 * rowOffset),
    left: (-50 * colOffset),
    bottom: ((10 - (vertical ? rowOffset + length : rowOffset + 1)) * 50),
    right: ((10 - (vertical ? colOffset + 1 : colOffset + length)) * 50),
  });

  const onDrag = () => {
    setDragging(true);
  };

  const flashInvalid = () => {
    setValid(false);
    setTimeout(() => setValid(true), 500);
  };

  const rotateShip = () => {
    if (isValidShipPlacement(board, rowOffset, colOffset, length, !rotated, ship)) {
      updateBoard(ship, rowOffset, colOffset, !rotated);
      setRotated(!rotated);
    } else {
      flashInvalid();
    }
  };

  const onStop = (e, data) => {
    if (dragging) {
      const newRow = rowOffset + (data.y / boxSize);
      const newCol = colOffset + (data.x / boxSize);

      if (isValidShipPlacement(board, newRow, newCol, length, rotated, ship)) {
        updateBoard(ship, newRow, newCol, rotated);
        setBounds({
          top: (-50 * newRow),
          left: (-50 * newCol),
          bottom: ((10 - (rotated ? rowOffset + length : rowOffset + 1)) * 50),
          right: ((10 - (rotated ? colOffset + 1 : colOffset + length)) * 50),
        });
      } else {
        updateBoard(ship, rowOffset, colOffset, rotated);
      }
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
      bounds={bounds}
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
                  backgroundColor: VALID_COLOR,
                  animation: valid ? 'none' : 'shake 1s linear infinite',
                  transition: 'background-color .1s ease',
                  '@keyframes shake': SHAKE_KEYFRAMES,
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
