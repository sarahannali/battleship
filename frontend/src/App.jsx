import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  Typography, Stack, List, ListItem, ListItemText, Paper,
} from '@mui/material';

import client, { events } from '@urturn/client';
import theme from './theme';
import Board from './Game/Board';
import { useGameContext } from './Contexts/GameContext';
import { usePlayerContext } from './Contexts/PlayerContext';

// const getStatusMsg = ({
//   status, winner, finished, plrToMove,
// }) => {
//   if (finished) {
//     if (winner) {
//       return `${winner} won the game!`;
//     }
//     return "It's a tie!";
//   } if (status === 'preGame') {
//     return 'Waiting on another player...';
//   } if (status === 'inGame') {
//     return `Waiting on player ${plrToMove} to make their move...`;
//   }
//   return 'Error: You should never see this. Contact developers!';
// };

function App() {
  const { setGame, players } = useGameContext();
  const { setPlayer } = usePlayerContext();
  const [showOpponentBoard, setShowOpponentBoard] = useState(false);

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
      <Stack spacing={1} sx={{ justifyContent: 'center' }}>
        <Typography variant="h3" textAlign="center" color="text.primary">Battleship</Typography>
        {/* <Typography textAlign="center" color="text.primary">{generalStatus}</Typography> */}
        <Stack margin={2} spacing={1} direction="row" justifyContent="center">
          <Board
            mini={showOpponentBoard}
            minify={setShowOpponentBoard}
          />
          <Board
            opponent
            mini={!showOpponentBoard}
            minify={setShowOpponentBoard}
          />
          <Paper>
            <Stack padding={1} sx={{ minWidth: '100px' }}>
              <Typography color="text.primary">Players</Typography>
              <List dense disablePadding padding={0}>
                {players && players.map((player, ind) => (
                  <ListItem dense disablePadding key={player}>
                    <ListItemText primary={`${ind + 1}: ${player.username}`} />
                  </ListItem>
                ))}
              </List>
            </Stack>
          </Paper>
        </Stack>
      </Stack>
      {/* <Snackbar
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={recentErrorMsg !== null}
        onClose={() => { setRecentErrorMsg(null); }}
        TransationComponent={Fade}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {recentErrorMsg}
        </Alert>
      </Snackbar> */}
    </ThemeProvider>
  );
}

export default App;
