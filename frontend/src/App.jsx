import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  Typography, Stack, List, ListItem, ListItemText, Paper, Snackbar, Alert, Fade, Button,
} from '@mui/material';

import client, { events } from '@urturn/client';
import theme from './theme';
import Board from './Game/Board';

const getStatusMsg = ({
  status, winner, finished, plrToMove,
}) => {
  if (finished) {
    if (winner) {
      return `${winner} won the game!`;
    }
    return "It's a tie!";
  } if (status === 'preGame') {
    return 'Waiting on another player...';
  } if (status === 'inGame') {
    return `Waiting on player ${plrToMove} to make their move...`;
  }
  return 'Error: You should never see this. Contact developers!';
};

function App() {
  const [boardGame, setBoardGame] = useState(client.getBoardGame() || {});

  useEffect(() => {
    const onStateChanged = (newBoardGame) => {
      setBoardGame(newBoardGame);
    };
    events.on('stateChanged', onStateChanged);
    return () => {
      events.off('stateChanged', onStateChanged);
    };
  }, []);

  const [recentErrorMsg, setRecentErrorMsg] = useState(null);

  const {
    state: {
      board,
      status,
      winner,
      plrToMoveIndex,
    } = {
      board: Array(10).fill(Array(10).fill(null)),
    },
  } = boardGame;
  const { players = [], finished } = boardGame;
  const generalStatus = getStatusMsg({
    status, winner, finished, plrToMove: status === 'inGame' ? players[plrToMoveIndex] : null,
  });

  const ships = {
    Carrier: 5,
    Battleship: 4,
    Cruiser: 3,
    Submarine: 3,
    Destroyer: 2,
  };

  return (
    <ThemeProvider theme={theme}>
      <Stack spacing={1} sx={{ justifyContent: 'center' }}>
        <Typography variant="h3" textAlign="center" color="text.primary">Battleship</Typography>
        <Typography textAlign="center" color="text.primary">{generalStatus}</Typography>
        <Stack margin={2} spacing={1} direction="row" justifyContent="center">
          <Board
            board={[...board]}
            setBoard={(newBoard) => setBoardGame({ ...boardGame, board: newBoard })}
            ships={ships}
          />
          <Paper>
            <Stack padding={1} sx={{ minWidth: '100px' }}>
              <Typography color="text.primary">Players</Typography>
              <List dense disablePadding padding={0}>
                {players.map((player, ind) => (
                  <ListItem dense disablePadding key={player}>
                    <ListItemText primary={`${ind + 1}: ${player.username}`} />
                  </ListItem>
                ))}
              </List>
            </Stack>
          </Paper>
        </Stack>
        <Button
          sx={{ width: '200px', mt: 10 }}
          variant="outlined"
        >
          Start Battle

        </Button>
      </Stack>
      <Snackbar
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={recentErrorMsg !== null}
        onClose={() => { setRecentErrorMsg(null); }}
        TransationComponent={Fade}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {recentErrorMsg}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
