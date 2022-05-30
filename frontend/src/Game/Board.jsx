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
        {Object.keys(ships).map((ship) => (
          <Ship
            length={ships[ship]}
            boxSize={BOX_SIZE}
          />
        ))}
        {board.map((row, rowNum) => (
          row.map((col, colNum) => (
            <Grid item key={(row, col)} sx={{ backgroundColor: rowNum % 2 === 1 && 'rgba(0,0,0,.5)' }}>
              {colNum === 0
                ? (
                  <Item sx={{ backgroundColor: colNum % 2 === 1 && 'rgba(0,0,0,.5)' }} />
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
