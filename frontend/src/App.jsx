import React, { useEffect } from 'react';
import {
  ThemeProvider,
  Typography,
  Stack,
} from '@mui/material';
import client, { events } from '@urturn/client';
import theme from './theme';
import Board from './Board/Board';
import { useGameContext } from './Contexts/GameContext';
import { usePlayerContext } from './Contexts/PlayerContext';
import { Status } from './Helpers/Types';
import ErrorSnackbar from './Common/ErrorSnackbar';
import LoadingBackdrop from './Common/LoadingBackdrop';

function App() {
  const { setGame, status, winner } = useGameContext();
  const { player, setPlayer } = usePlayerContext();

  useEffect(() => {
    const onStateChanged = (newGameState) => {
      setGame(newGameState);
    };
    const getLocalPlayer = async () => {
      setPlayer(await client.getLocalPlayer());
    };

    getLocalPlayer();
    events.on('stateChanged', onStateChanged);
    return () => {
      events.off('stateChanged', onStateChanged);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <LoadingBackdrop
        open={status === Status.EndGame}
        text={player && winner && winner === player.id ? 'You Won!' : 'You Lost.'}
      />
      <Stack spacing={1} sx={{ justifyContent: 'center' }}>
        <Typography variant="h3" textAlign="center" color="text.primary">Battleship</Typography>
        <Stack margin={10} spacing={10} direction="row" justifyContent="center">
          <Board />
          <Board
            opponent
          />
        </Stack>
      </Stack>
      <ErrorSnackbar />
    </ThemeProvider>
  );
}

export default App;
