/* eslint-disable no-restricted-syntax */
/* eslint-disable react/prop-types */
import React from 'react';
import { styled } from '@mui/material/styles';
import {
  Grid, Paper,
} from '@mui/material';
import Ship from './Ship';

const BOX_SIZE = 50;

const Item = styled(Paper)(() => ({
  height: `${BOX_SIZE}px`,
  width: `${BOX_SIZE}px`,
  textAlign: 'center',
  borderRadius: '0',
  boxSizing: 'border-box',
  backgroundColor: 'transparent',
}));

function Board({ board, ships }) {
  const boardSize = board.length;

  const isStartPosition = (x, y) => {
    const shipType = board[x][y];

    return (
      shipType != null
      && (
        (x === 0 || y === 0)
        || (board[x - 1][y] !== shipType && board[x][y - 1] !== shipType)
      ));
  };

  const getIsVertical = (x, y) => {
    if (x === board.length - 1) return false;
    return board[x + 1][y] === board[x][y];
  };

  return (
    <div style={{ position: 'relative' }}>
      <Grid
        container
        spacing={0}
        sx={{
          height: `${BOX_SIZE * boardSize}px`,
          width: `${BOX_SIZE * boardSize}px`,
          backgroundColor: '#18293b',
        }}
      >
        {board.map((row, rowNum) => (
          row.map((cell, colNum) => (
            <Grid item key={(rowNum, colNum)} sx={{ backgroundColor: rowNum % 2 === 1 && 'rgba(0,0,0,.5)' }}>
              {isStartPosition(rowNum, colNum)
                ? (
                  <Item sx={{ backgroundColor: colNum % 2 === 1 && 'rgba(0,0,0,.5)' }}>
                    <Ship
                      boxSize={BOX_SIZE}
                      length={ships[cell]}
                      vertical={getIsVertical(rowNum, colNum)}
                    />
                  </Item>
                )
                : <Item sx={{ backgroundColor: colNum % 2 === 1 && 'rgba(0,0,0,.5)' }} />}
            </Grid>
          ))
        ))}
      </Grid>
    </div>
  );
}

export default Board;
