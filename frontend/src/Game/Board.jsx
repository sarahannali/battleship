/* eslint-disable react/prop-types */
import React from 'react';
import { styled } from '@mui/material/styles';
import {
  Grid, Paper,
} from '@mui/material';
import Ship from './Ship';

const BOX_SIZE = 70;

const Item = styled(Paper)(() => ({
  height: `${BOX_SIZE}px`,
  width: `${BOX_SIZE}px`,
  textAlign: 'center',
  borderRadius: '0',
  boxSizing: 'border-box',
  backgroundColor: 'transparent',
}));

function Board({ board }) {
  return (
    <Grid container spacing={0} sx={{ height: `${BOX_SIZE * 7}px`, width: `${BOX_SIZE * 7}px`, backgroundColor: '#18293b' }}>
      {board.map((row, rowNum) => (
        row.map((col, colNum) => (
          <Grid item key={(row, col)} sx={{ backgroundColor: rowNum % 2 === 1 && 'rgba(0,0,0,.5)' }}>
            {colNum === 0
              ? (
                <Item sx={{ backgroundColor: colNum % 2 === 1 && 'rgba(0,0,0,.5)' }}>
                  <Ship
                    length={Math.floor(Math.random() * 6)}
                    boxSize={BOX_SIZE}
                    vertical
                  />
                </Item>
              )
              : <Item sx={{ backgroundColor: colNum % 2 === 1 && 'rgba(0,0,0,.5)' }} />}
          </Grid>
        ))
      ))}
    </Grid>
  );
}

export default Board;
