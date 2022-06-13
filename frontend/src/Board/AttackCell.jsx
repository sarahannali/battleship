import { Box } from '@mui/material';
import client from '@urturn/client';
import React from 'react';
import { useErrorContext } from '../Contexts/ErrorContext';
import { AttackTypes, MoveTypes } from '../Helpers/Types';
import { ATTACK_COLOR, OPPONENT_COLOR, SHIP_SIZE } from '../Helpers/Constants';

function AttackCell({
  x, y, attackState, shakeBoard,
}) {
  const { setError } = useErrorContext();

  const attack = async (event) => {
    event.preventDefault();
    const move = { moveType: MoveTypes.Attack, attack: [x, y] };
    const { error } = await client.makeMove(move);

    if (error) {
      shakeBoard();
      setError(error.message);
    }
  };

  const getColor = () => {
    if (attackState === AttackTypes.Miss) return OPPONENT_COLOR;
    if (attackState === AttackTypes.Hit) return ATTACK_COLOR;
    if (attackState === AttackTypes.Sunk) return '#00000080';
    return 'transparent';
  };

  return (
    <Box
      sx={({
        height: `${SHIP_SIZE}px`,
        width: `${SHIP_SIZE}px`,
        padding: '10px',
        borderRadius: '2px',
        backgroundColor: attackState === AttackTypes.Sunk ? OPPONENT_COLOR : 'transparent',
        margin: 'auto',
      })}
      onClick={attack}
    >
      <div
        style={{
          backgroundColor: getColor(),
          height: `${SHIP_SIZE}px`,
          width: `${SHIP_SIZE}px`,
          margin: 'auto',
          borderRadius: '50%',
        }}
      />
    </Box>
  );
}

export default AttackCell;
