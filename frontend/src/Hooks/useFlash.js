import { useState } from 'react';

const useFlash = () => {
  const [flashing, setFlashing] = useState;

  const flash = () => {
    setFlashing(true);
    setTimeout(() => setFlashing(false), 500);
  };

  return {
    flash,
    flashing,
  };
};

export default useFlash;
