import React, {
  createContext, useState, useMemo, useContext,
} from 'react';

const EMPTY_GAME_STATE = Object.freeze({
  players: null,
  state: {},
});

const GameContext = createContext();

export function GameProvider({ children }) {
  const [game, setGame] = useState(EMPTY_GAME_STATE);

  const getOtherPlayer = (player) => game.players ?? game.players.find((p) => p.id !== player.id);

  const value = useMemo(() => ({
    board: game.state.board,
    status: game.state.status,
    attackBoard: game.state.attackBoard,
    players: game.players,
    winner: game.state.winner,
    getOtherPlayer,
    setGame,
  }), [game]);

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export const useGameContext = () => useContext(GameContext);
