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

function Board({ board, ships, setBoard }) {
  const boardSize = board.length;

  const isStartPosition = (x, y) => {
    const shipType = board[x][y];

    return (
      shipType != null
      && (
        (x === 0 || board[x - 1][y] !== shipType)
        && (y === 0 || board[x][y - 1] !== shipType)
      ));
  };

  const getIsVertical = (x, y) => {
    if (x === board.length - 1) return false;
    return board[x + 1][y] === board[x][y];
  };

  const updateBoard = (ship, newX, newY, vertical) => {
    const newBoard = board.map((row) => row.map((cell) => {
      if (cell === ship) {
        return null;
      } return cell;
    }));

    console.log('NEW BOARD: ', newBoard);
    console.log(newX, newY, vertical);
    setBoard(newBoard);
  };

  console.log('BOARD: ', board);

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
                      ships={ships}
                      ship={cell}
                      board={board}
                      boxSize={BOX_SIZE}
                      vertical={getIsVertical(rowNum, colNum)}
                      rowOffset={rowNum}
                      colOffset={colNum}
                      updateBoard={updateBoard}
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
