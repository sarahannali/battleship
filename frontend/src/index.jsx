import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {
  GameProvider,
  PlayerProvider,
  ErrorProvider,
} from './Contexts';

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
