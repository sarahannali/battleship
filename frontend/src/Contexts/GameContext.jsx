import React, {
  createContext, useState, useMemo, useContext,
} from 'react';

const EMPTY_GAME_STATE = Object.freeze({
  players: null,
  state: {},
});

const GameContext = createContext();

// eslint-disable-next-line react/prop-types
export function GameProvider({ children }) {
  const [game, setGame] = useState(EMPTY_GAME_STATE);

  const value = useMemo(() => ({
    board: game.state.board,
    status: game.state.status,
    attackBoard: game.state.attackBoard,
    players: game.players,
    winner: game.state.winner,
    setGame,
  }), [game]);

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export const useGameContext = () => useContext(GameContext);
