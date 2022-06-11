import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ErrorProvider } from './Contexts/ErrorContext';
import { GameProvider } from './Contexts/GameContext';
import { PlayerProvider } from './Contexts/PlayerContext';

ReactDOM.render(
  <React.StrictMode>
    <GameProvider>
      <PlayerProvider>
        <ErrorProvider>
          <App />
        </ErrorProvider>
      </PlayerProvider>
    </GameProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
