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
import {
  AttackTypes, MoveTypes, ships, Status,
} from '../Helpers/Types';
import { useGameContext } from '../Contexts/GameContext';
import AttackCell from './AttackCell';
import { usePlayerContext } from '../Contexts/PlayerContext';
import { EMPTY_BOARD, BOX_SIZE, SHAKE_KEYFRAMES } from '../Helpers/Utils';
import { useErrorContext } from '../Contexts/ErrorContext';
import FleetCell from './FleetCell';

function Board({
  opponent,
}) {
  const {
    board, attackBoard, status, players,
  } = useGameContext();
  const { player } = usePlayerContext();
  const { setError } = useErrorContext();

  // const getOtherPlayer = () => players && players
  //   .find((plr) => plr.id !== player.id);

  const [localBoard, setLocalBoard] = useState(EMPTY_BOARD);
  const [ready, setReady] = useState(false);
  const [shake, setShake] = useState(false);

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

  const shakeBoard = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
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

  const opponentName = players ? players.find((p) => p.id !== player.id).username : 'Opponent';

  console.log(players, ready, status);
  console.log(!players || (ready && status === Status.PreGame));
  return (
    <div style={{ position: 'relative' }}>
      <Backdrop
        sx={{ color: '#fff', zIndex: 100 }}
        open={!players || (ready && status === Status.PreGame)}
      >
        <Stack margin={2} spacing={2} justifyContent="center" alignItems="center">
          <CircularProgress color="inherit" />
          <Typography variant="h5" textAlign="center" color="text.primary">Waiting on other player...</Typography>
        </Stack>
      </Backdrop>
      <Stack justifyContent="center" alignItems="center" spacing={3}>
        <Typography variant="h5" textAlign="center" color="text.primary">{opponent ? `${opponentName}'s Fleet` : 'Your Fleet' }</Typography>
        <div style={{
          boxShadow: `0px 0px 10px 1px${opponent ? '#d5b1ff' : '#08F7FE'}`,
          animation: shake ? 'shake 1s linear infinite' : 'none',
          '@keyframes shake': SHAKE_KEYFRAMES,
        }}
        >
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
                  <Item sx={{
                    backgroundColor: colNum % 2 === 1 && 'rgba(0,0,0,.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
                  }}
                  >
                    {opponent
                      ? (
                        <AttackCell
                          x={rowNum}
                          y={colNum}
                          attackState={attackBoard && player
                            ? attackBoard[player.id][rowNum][colNum]
                            : AttackTypes.None}
                          shakeBoard={shakeBoard}
                        />
                      )
                      : (
                        <FleetCell
                          x={rowNum}
                          y={colNum}
                          localBoard={localBoard}
                          updateBoard={updateBoard}
                        />
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
