import React, { useState } from 'react';
import { Box } from '@mui/material';
import Draggable from 'react-draggable';
// eslint-disable-next-line react/prop-types
function Ship({ length, boxSize, vertical }) {
  const [rotated, setRotated] = useState(vertical);

  const BOX_SIZE = boxSize * 0.8;
  const offset = boxSize * 0.2;

  const longSide = `${(BOX_SIZE * length + offset * (length - 1))}px`;
  const shortSide = `${BOX_SIZE}px`;

  return (
    <Draggable grid={[70, 70]}>
      <Box
        sx={{ height: `${BOX_SIZE}px`, width: `${BOX_SIZE}px`, padding: '7px' }}
        onClick={() => { setRotated(!rotated); }}
      >
        <Box sx={{
          height: rotated ? longSide : shortSide,
          width: rotated ? shortSide : longSide,
          borderRadius: '10px',
          backgroundColor: '#08F7FE',
          cursor: 'hand',
          margin: '0px auto',
        }}
        />
      </Box>
    </Draggable>
  );
}

export default Ship;
