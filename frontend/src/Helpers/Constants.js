export const EMPTY_BOARD = Array(10).fill(Array(10).fill(null));

export const BOX_SIZE = 50;

export const SHAKE_KEYFRAMES = {
  '10%, 90%': {
    transform: 'translate3d(-1px, 0, 0)',
  },
  '20%, 80%': {
    transform: 'translate3d(2px, 0, 0)',
  },
  '30%, 50%, 70%': {
    transform: 'translate3d(-4px, 0, 0)',
  },
  '40%, 60%': {
    transform: 'translate3d(4px, 0, 0)',
  },
};
