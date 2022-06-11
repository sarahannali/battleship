/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import client from '@urturn/client';
import React from 'react';
import { useErrorContext } from '../Contexts/ErrorContext';
import { AttackTypes, MoveTypes } from '../Helpers/Types';

function AttackCell({ x, y, attackState }) {
  const { setError } = useErrorContext();

  const attack = async (event) => {
    event.preventDefault();
    const move = { moveType: MoveTypes.Attack, attack: [x, y] };
    const { error } = await client.makeMove(move);

    if (error) {
      setError(error.message);
    }
  };

  const getColor = () => {
    if (attackState === AttackTypes.None) return 'transparent';
    if (attackState === AttackTypes.Miss) return 'blue';
    if (attackState === AttackTypes.Hit) return 'red';
    if (attackState === AttackTypes.Sunk) return 'green';
    return 'transparent';
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      style={{ backgroundColor: getColor(), height: '50px', width: '50px' }}
      onClick={attack}
    />
  );
}

export default AttackCell;
