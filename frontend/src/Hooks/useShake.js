import { useState } from 'react';

const useShake = () => {
  const [isShaking, setIsShaking] = useState;

  const shake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  return {
    shake,
    isShaking,
  };
};

export default useShake;
