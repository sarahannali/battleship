/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Box, Stack } from '@mui/material';
import Draggable from 'react-draggable';
import isValidShipPlacement from '../Helpers/ValidShipPlacement';
import { AttackTypes, ships, Status } from '../Helpers/Types';
import { useGameContext } from '../Contexts/GameContext';
import {
  ATTACK_COLOR, BOX_SIZE, PLAYER_COLOR, SHAKE_KEYFRAMES, SHIP_SIZE,
} from '../Helpers/Constants';
import { usePlayerContext } from '../Contexts/PlayerContext';
import useFlash from '../Hooks/useFlash';

const getBounds = (x, y, length, rotated) => ({
  top: (-50 * x),
  left: (-50 * y),
  bottom: ((10 - (rotated ? x + length : x + 1)) * 50),
  right: ((10 - (rotated ? y + 1 : y + length)) * 50),
});

function Ship({
  ship, board, vertical, rowOffset, colOffset, updateBoard,
}) {
  const { status, attackBoard, getOtherPlayer } = useGameContext();
  const { player } = usePlayerContext();
  const { flash, flashing } = useFlash();

  const otherPlayer = getOtherPlayer(player);
  const length = ships[ship];
  const offset = BOX_SIZE * 0.1;
  const defaultCursor = status === Status.PreGame ? 'grab' : 'default';

  const [rotated, setRotated] = useState(vertical);
  const [dragging, setDragging] = useState(false);
  const [bounds, setBounds] = useState(getBounds(rowOffset, colOffset, length, vertical));

  const rotateShip = () => {
    if (isValidShipPlacement(board, rowOffset, colOffset, length, !rotated, ship)) {
      updateBoard(ship, rowOffset, colOffset, !rotated);
      setRotated(!rotated);
    } else {
      flash();
    }
  };

  const onStop = (_, data) => {
    if (dragging) {
      const newRow = rowOffset + (data.y / BOX_SIZE);
      const newCol = colOffset + (data.x / BOX_SIZE);

      if (isValidShipPlacement(board, newRow, newCol, length, rotated, ship)) {
        updateBoard(ship, newRow, newCol, rotated);
        setBounds(getBounds(newRow, newCol, length, rotated));
      } else {
        updateBoard(ship, rowOffset, colOffset, rotated);
      }
    } else {
      rotateShip();
    }
    setDragging(false);
  };

  const getAttackColor = (x, y) => {
    if (otherPlayer && attackBoard[otherPlayer.id]) {
      const attackCell = attackBoard[otherPlayer.id][x][y];

      if (attackCell === AttackTypes.Hit || attackCell === AttackTypes.Sunk) return ATTACK_COLOR;
    }
    return PLAYER_COLOR;
  };

  return (
    <Draggable
      grid={[BOX_SIZE, BOX_SIZE]}
      onDrag={() => setDragging(true)}
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
                  height: `${SHIP_SIZE}px`,
                  width: `${SHIP_SIZE}px`,
                  margin: `${offset}px`,
                  padding: '10px',
                  borderRadius: '2px',
                  backgroundColor: getAttackColor(
                    rowOffset + (vertical ? idx : 0),
                    colOffset + (vertical ? 0 : idx),
                  ),
                  animation: flashing ? 'shake 1s linear infinite' : 'none',
                  transition: 'background-color .1s ease',
                  '@keyframes shake': SHAKE_KEYFRAMES,
                })}
              >
                <Box sx={({
                  height: `${SHIP_SIZE}px`,
                  width: `${SHIP_SIZE}px`,
                  backgroundColor: '#00000080',
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
