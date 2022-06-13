/* eslint-disable react/prop-types */
import { Box } from '@mui/material';
import React from 'react';
import { useGameContext } from '../Contexts/GameContext';
import { usePlayerContext } from '../Contexts/PlayerContext';
import { AttackTypes } from '../Helpers/Types';
import Ship from './Ship';

function FleetCell({
  x, y, localBoard, updateBoard,
}) {
  const { attackBoard, players } = useGameContext();
  const { player } = usePlayerContext();

  const otherPlayer = players ? players.find((plr) => plr.id !== player.id) : null;

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

      if (attackCell === AttackTypes.Miss) return '#de344f';
      if (attackCell === AttackTypes.Hit) return '#de344f';
      if (attackCell === AttackTypes.Sunk) return '#de344f';
    }
    return 'transparent';
  };

  if (isStartPosition()) {
    return (
      <Box sx={{
        height: '20px',
        width: '20px',
      }}
      >
        <Ship
          ship={localBoard[x][y]}
          board={localBoard}
          vertical={getIsVertical()}
          rowOffset={x}
          colOffset={y}
          updateBoard={updateBoard}
          sunk={attackBoard[otherPlayer.id][x][y] === AttackTypes.Sunk}
        />
      </Box>
    );
  }

  return (
    <Box sx={{
      height: '20px',
      width: '20px',
      backgroundColor: getAttackColor(),
      borderRadius: '50%',
    }}
    />
  );
}

export default FleetCell;
