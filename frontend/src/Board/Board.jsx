import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
  Box,
} from '@mui/material';
import client from '@urturn/client';
import {
  AttackTypes, MoveTypes, ships, Status,
} from '../Helpers/Types';
import { useGameContext } from '../Contexts/GameContext';
import AttackCell from './AttackCell';
import { usePlayerContext } from '../Contexts/PlayerContext';
import {
  EMPTY_BOARD, BOX_SIZE, SHAKE_KEYFRAMES, PLAYER_COLOR, OPPONENT_COLOR,
} from '../Helpers/Constants';
import { useErrorContext } from '../Contexts/ErrorContext';
import FleetCell from './FleetCell';
import useFlash from '../Hooks/useFlash';
import LoadingBackdrop from '../Common/LoadingBackdrop';

const Item = styled(Paper)(() => ({
  height: `${BOX_SIZE}px`,
  width: `${BOX_SIZE}px`,
  textAlign: 'center',
  borderRadius: '0',
  boxSizing: 'border-box',
  backgroundColor: 'transparent',
}));

function Board({ opponent }) {
  const {
    board, attackBoard, status, players, getOtherPlayer,
  } = useGameContext();
  const { player } = usePlayerContext();
  const { setError } = useErrorContext();
  const { flash, flashing } = useFlash();

  const [localBoard, setLocalBoard] = useState(EMPTY_BOARD);
  const [ready, setReady] = useState(false);

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

  const opponentName = getOtherPlayer(player)?.username ?? 'Opponent';

  return (
    <Box style={{ position: 'relative' }}>
      <LoadingBackdrop open={!players || players.length < 2 || (ready && status === Status.PreGame)} text="Waiting on other player..." />
      <Stack justifyContent="center" alignItems="center" spacing={3}>
        <Typography variant="h5" textAlign="center" color="text.primary">{opponent ? `${opponentName}'s Fleet` : 'Your Fleet' }</Typography>
        <Box
          style={{
            boxShadow: `0px 0px 10px 1px${opponent ? OPPONENT_COLOR : PLAYER_COLOR}`,
            animation: flashing ? 'shake 1s linear infinite' : 'none',
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
              row.map((_, colNum) => (
                <Grid item key={(rowNum, colNum)} sx={{ backgroundColor: rowNum % 2 === 1 && 'rgba(0,0,0,.5)' }}>
                  <Item sx={{
                    backgroundColor: colNum % 2 === 1 && 'rgba(0,0,0,.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
                  }}
                  >
                    { opponent
                      ? (
                        <AttackCell
                          x={rowNum}
                          y={colNum}
                          attackState={attackBoard && player
                            ? attackBoard[player.id][rowNum][colNum]
                            : AttackTypes.None}
                          shakeBoard={flash}
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
        </Box>
        { status === Status.PreGame
          && !opponent
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
    </Box>
  );
}

Board.defaultProps = {
  opponent: false,
};

export default Board;
