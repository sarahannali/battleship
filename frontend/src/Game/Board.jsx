/* eslint-disable no-restricted-syntax */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Backdrop,
  Button,
  CircularProgress,
  Grid, Paper, Stack, Typography,
} from '@mui/material';
import client from '@urturn/client';
import Ship from './Ship';
import {
  AttackTypes, MoveTypes, ships, Status,
} from '../Helpers/Types';
import { useGameContext } from '../Contexts/GameContext';
import AttackCell from './AttackCell';
import { usePlayerContext } from '../Contexts/PlayerContext';
import { EMPTY_BOARD, BOX_SIZE } from '../Helpers/Utils';
import { useErrorContext } from '../Contexts/ErrorContext';

function Board({
  opponent,
}) {
  const {
    board, attackBoard, status, players,
  } = useGameContext();
  const { player } = usePlayerContext();
  const { setError } = useErrorContext();

  const [localBoard, setLocalBoard] = useState(EMPTY_BOARD);
  const [ready, setReady] = useState(false);

  const Item = styled(Paper)(() => ({
    height: `${BOX_SIZE}px`,
    width: `${BOX_SIZE}px`,
    textAlign: 'center',
    borderRadius: '0',
    boxSizing: 'border-box',
    backgroundColor: 'transparent',
  }));

  useEffect(() => {
    if (player && board) {
      setLocalBoard(board[player.id]);
    }
  }, [player, board]);

  const boardSize = localBoard && localBoard.length;

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
      setError(error.message);
    } else {
      setReady(true);
    }
  };

  const opponentName = players ? players.find((p) => p.id !== player.id).username : null;

  return (
    <div style={{ position: 'relative' }}>
      <Backdrop
        sx={{ color: '#fff', zIndex: 100 }}
        open={!players || (ready && status === Status.PreGame)}
      >
        <Stack margin={2} spacing={1} justifyContent="center" alignItems="center">
          <CircularProgress color="inherit" />
          <Typography variant="h5" textAlign="center" color="text.primary">Waiting on other player...</Typography>
        </Stack>
      </Backdrop>
      <Stack justifyContent="center" alignItems="center" spacing={3}>
        <Typography variant="h5" textAlign="center" color="text.primary">{opponent ? `${opponentName}'s Fleet` : 'Your Fleet' }</Typography>
        <div style={{ boxShadow: `0px 0px 10px 1px${opponent ? '#d5b1ff' : '#08F7FE'}` }}>
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
                  <Item sx={{ backgroundColor: colNum % 2 === 1 && 'rgba(0,0,0,.5)', display: 'flex' }}>
                    { opponent
                      ? (
                        <AttackCell
                          x={rowNum}
                          y={colNum}
                          attackState={attackBoard && player
                            ? attackBoard[player.id][rowNum][colNum]
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
        </div>
        { status === Status.PreGame && !opponent
          && (
          <Button
            sx={{ width: '200px' }}
            variant="outlined"
            onClick={startBattle}
          >
            Start Battle
          </Button>
          )}
      </Stack>
    </div>
  );
}

Board.defaultProps = {
  opponent: false,
};

export default Board;
