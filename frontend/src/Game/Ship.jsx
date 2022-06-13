/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Box, Stack } from '@mui/material';
import Draggable from 'react-draggable';
import isValidShipPlacement from '../Helpers/ValidShipPlacement';
import { AttackTypes, ships, Status } from '../Helpers/Types';
import { useGameContext } from '../Contexts/GameContext';
import { BOX_SIZE, SHAKE_KEYFRAMES } from '../Helpers/Utils';
import { usePlayerContext } from '../Contexts/PlayerContext';

const VALID_COLOR = '#08F7FE';
// const INVALID_COLOR = '#E92746';

function Ship({
  ship, board, vertical, rowOffset, colOffset, updateBoard, sunk,
}) {
  const { status, attackBoard, players } = useGameContext();
  const { player } = usePlayerContext();

  const otherPlayer = players ? players.find((plr) => plr.id !== player.id) : null;

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
      const newRow = rowOffset + (data.y / BOX_SIZE);
      const newCol = colOffset + (data.x / BOX_SIZE);

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

  const squareSize = BOX_SIZE * 0.4;
  const offset = BOX_SIZE * 0.1;

  const defaultCursor = status === Status.PreGame ? 'grab' : 'default';

  const getAttackColor = (x, y) => {
    // console.log('X: ', x, ' Y: ', y);
    if (otherPlayer && attackBoard[otherPlayer.id]) {
      const attackCell = attackBoard[otherPlayer.id][x][y];

      if (attackCell === AttackTypes.Miss) return '#08f7fe50';
      if (attackCell === AttackTypes.Hit) return '#de344f';
      if (attackCell === AttackTypes.Sunk) return '#00000080';
    }
    return '#00000080';
  };

  return (
    <Draggable
      grid={[BOX_SIZE, BOX_SIZE]}
      onDrag={onDrag}
      onStop={onStop}
      disabled={status === Status.InGame}
      bounds={bounds}
    >
      <Box
        sx={{
          height: '100%',
          cursor: dragging ? 'grabbing' : defaultCursor,
          marginTop: '-15px',
          marginLeft: '-15px',
        }}
      >
        <Stack direction={rotated ? 'column' : 'row'}>
          {
          [...Array(length)]
            .map((i, idx) => (
              <Box
                sx={({
                  height: `${squareSize}px`,
                  width: `${squareSize}px`,
                  margin: `${offset}px`,
                  padding: '10px',
                  borderRadius: '2px',
                  backgroundColor: sunk ? '#de344f' : VALID_COLOR,
                  animation: valid ? 'none' : 'shake 1s linear infinite',
                  transition: 'background-color .1s ease',
                  '@keyframes shake': SHAKE_KEYFRAMES,
                })}
              >
                <Box sx={({
                  height: `${squareSize}px`,
                  width: `${squareSize}px`,
                  backgroundColor: getAttackColor(
                    rowOffset + (vertical ? idx : 0),
                    colOffset + (vertical ? 0 : idx),
                  ),
                  margin: 'auto',
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
