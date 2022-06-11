import { useState } from 'react';

const useGameState = () => {
  const [gameStarted, setGameStarted] = useState(false);

  return [gameStarted, setGameStarted];
};

export default useGameState;
