/* eslint-disable no-restricted-syntax */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Button,
  Grid, Paper,
} from '@mui/material';
import client from '@urturn/client';
import Ship from './Ship';
import { AttackTypes, MoveTypes, ships } from '../Helpers/Types';
import useGameStatus from '../Hooks/useGameStatus';
import AttackCell from './AttackCell';

function Board({
  board, mini, minify, opponent, attackBoard,
}) {
  const [gameStarted, setGameStarted] = useGameStatus();
  const [localBoard, setLocalBoard] = useState(board);

  const BOX_SIZE = mini ? 10 : 50;

  const Item = styled(Paper)(() => ({
    height: `${BOX_SIZE}px`,
    width: `${BOX_SIZE}px`,
    textAlign: 'center',
    borderRadius: '0',
    boxSizing: 'border-box',
    backgroundColor: 'transparent',
  }));

  useEffect(() => {
    setLocalBoard(board);
  }, [board]);

  const boardSize = localBoard.length;

  const isStartPosition = (x, y) => {
    const shipType = localBoard[x][y];

    return (
      shipType != null
      && (
        (x === 0 || localBoard[x - 1][y] !== shipType)
        && (y === 0 || localBoard[x][y - 1] !== shipType)
      ));
  };

  const getIsVertical = (x, y) => {
    if (x === localBoard.length - 1) return false;
    return localBoard[x + 1][y] === localBoard[x][y];
  };

  const updateBoard = (ship, startX, startY, vertical) => {
    const endX = vertical ? startX + ships[ship] - 1 : startX;
    const endY = vertical ? startY : startY + ships[ship] - 1;

    const newBoard = localBoard.map((row, i) => row.map((cell, j) => {
      if (startX <= i && i <= endX && startY <= j && j <= endY) {
        return ship;
      }
      if (cell === ship) {
        return null;
      }

      return cell;
    }));

    setLocalBoard(newBoard);
  };

  const startBattle = async (event) => {
    event.preventDefault();
    const move = { moveType: MoveTypes.InitializeBoard, playerBoard: localBoard };
    const { error } = await client.makeMove(move);

    if (error) {
      console.log('ERROR: ', error);
    } else {
      minify(true);
      setGameStarted(true);
    }
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
        {localBoard.map((row, rowNum) => (
          row.map((cell, colNum) => (
            <Grid item key={(rowNum, colNum)} sx={{ backgroundColor: rowNum % 2 === 1 && 'rgba(0,0,0,.5)' }}>
              <Item sx={{ backgroundColor: colNum % 2 === 1 && 'rgba(0,0,0,.5)' }}>
                { opponent
                  ? (
                    <AttackCell
                      x={rowNum}
                      y={colNum}
                      attackState={!mini && attackBoard
                        ? attackBoard[rowNum][colNum]
                        : AttackTypes.None}
                    />
                  )
                  : (isStartPosition(rowNum, colNum)
                    && (
                    <Ship
                      ships={ships}
                      ship={cell}
                      board={localBoard}
                      boxSize={BOX_SIZE}
                      vertical={getIsVertical(rowNum, colNum)}
                      rowOffset={rowNum}
                      colOffset={colNum}
                      updateBoard={updateBoard}
                    />
                    )
                  )}
              </Item>
            </Grid>
          ))
        ))}
      </Grid>
      { !gameStarted && !mini
          && (
          <Button
            sx={{ width: '200px', mt: 10 }}
            variant="outlined"
            onClick={startBattle}
          >
            Start Battle
          </Button>
          )}
    </div>
  );
}

export default Board;
