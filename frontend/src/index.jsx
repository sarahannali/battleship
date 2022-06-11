import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { GameProvider } from './Contexts/GameContext';
import { PlayerProvider } from './Contexts/PlayerContext';

ReactDOM.render(
  <React.StrictMode>
    <GameProvider>
      <PlayerProvider>
        <App />
      </PlayerProvider>
    </GameProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
