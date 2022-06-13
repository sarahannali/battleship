/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Box } from '@mui/material';
import client from '@urturn/client';
import React from 'react';
import { useErrorContext } from '../Contexts/ErrorContext';
import { AttackTypes, MoveTypes } from '../Helpers/Types';
import { BOX_SIZE } from '../Helpers/Utils';

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
    if (attackState === AttackTypes.None) return 'transparent';
    if (attackState === AttackTypes.Miss) return '#d5b1ff';
    if (attackState === AttackTypes.Hit) return '#de344f';
    if (attackState === AttackTypes.Sunk) return '#00000080';
    return 'transparent';
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <Box
      sx={({
        height: `${BOX_SIZE * 0.4}px`,
        width: `${BOX_SIZE * 0.4}px`,
        padding: '10px',
        borderRadius: '2px',
        backgroundColor: attackState === AttackTypes.Sunk ? '#d5b1ff' : 'transparent',
        margin: 'auto',
      })}
      onClick={attack}
    >
      <div
        style={{
          backgroundColor: getColor(),
          height: `${BOX_SIZE * 0.4}px`,
          width: `${BOX_SIZE * 0.4}px`,
          margin: 'auto',
          borderRadius: '50%',
        }}
      />
    </Box>
  );
}

export default AttackCell;
