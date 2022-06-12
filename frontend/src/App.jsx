import React, { useEffect } from 'react';
import {
  ThemeProvider,
  Typography,
  Stack,
  Snackbar,
  Alert,
  Fade,
  Backdrop,
} from '@mui/material';
import client, { events } from '@urturn/client';
import theme from './theme';
import Board from './Game/Board';
import { useGameContext } from './Contexts/GameContext';
import { usePlayerContext } from './Contexts/PlayerContext';
import { useErrorContext } from './Contexts/ErrorContext';
import { Status } from './Helpers/Types';

function App() {
  const { setGame, status, winner } = useGameContext();
  const { player, setPlayer } = usePlayerContext();
  const { error, setError } = useErrorContext();

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
      <Backdrop
        sx={{ color: '#fff', zIndex: 100 }}
        open={status === Status.EndGame}
      >
        <Typography variant="h5" textAlign="center" color="text.primary">
          {player && winner && winner === player.id ? 'You Won!' : 'You Lost.'}
        </Typography>
      </Backdrop>
      <Stack spacing={1} sx={{ justifyContent: 'center' }}>
        <Typography variant="h3" textAlign="center" color="text.primary">Battleship</Typography>
        <Stack margin={10} spacing={10} direction="row" justifyContent="center">
          <Board />
          <Board
            opponent
          />
        </Stack>
      </Stack>
      <Snackbar
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={error !== null}
        onClose={() => { setError(null); }}
        TransationComponent={Fade}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
