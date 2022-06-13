/* eslint-disable react/prop-types */
import { Box } from '@mui/material';
import React from 'react';
import { useGameContext } from '../Contexts/GameContext';
import { usePlayerContext } from '../Contexts/PlayerContext';
import { ATTACK_COLOR, SHIP_SIZE } from '../Helpers/Constants';
import { AttackTypes } from '../Helpers/Types';
import Ship from './Ship';

function FleetCell({
  x, y, localBoard, updateBoard,
}) {
  const { attackBoard, getOtherPlayer } = useGameContext();
  const { player } = usePlayerContext();

  const otherPlayer = getOtherPlayer(player);

  const isStartPosition = () => {
    const shipType = localBoard[x][y];

    return (
      shipType != null
      && (
        (x === 0 || localBoard[x - 1][y] !== shipType)
        && (y === 0 || localBoard[x][y - 1] !== shipType)
      ));
  };

  const getIsVertical = () => {
    if (x === localBoard.length - 1) return false;
    return localBoard[x + 1][y] === localBoard[x][y];
  };

  const getAttackColor = () => {
    if (otherPlayer) {
      const attackCell = attackBoard[otherPlayer.id][x][y];

      if (attackCell !== AttackTypes.None) return ATTACK_COLOR;
    }
    return 'transparent';
  };

  if (isStartPosition()) {
    return (
      <Box sx={{
        height: SHIP_SIZE,
        width: SHIP_SIZE,
      }}
      >
        <Ship
          ship={localBoard[x][y]}
          board={localBoard}
          vertical={getIsVertical()}
          rowOffset={x}
          colOffset={y}
          updateBoard={updateBoard}
        />
      </Box>
    );
  }

  return (
    <Box sx={{
      height: SHIP_SIZE,
      width: SHIP_SIZE,
      backgroundColor: getAttackColor(),
      borderRadius: '50%',
    }}
    />
  );
}

export default FleetCell;
