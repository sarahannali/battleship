import React, { useState } from 'react';
import { Box } from '@mui/material';
import Draggable from 'react-draggable';
// eslint-disable-next-line react/prop-types
function Ship({ length, boxSize }) {
  const [rotated, setRotated] = useState(false);
  // const [dragging, setDragging] = useState(false);

  const onDrag = () => {

  };
  const shipSize = boxSize * 0.8;
  const offset = boxSize * 0.2;

  const longSide = `${(shipSize * length + offset * (length - 1))}px`;
  const shortSide = `${shipSize}px`;

  return (
    <Draggable grid={[boxSize, boxSize]} bounds="parent" style={{ height: `${shipSize}px`, width: `${shipSize}px`, padding: '5px' }}>
      <Box
        sx={{ height: `${shipSize}px`, width: `${shipSize}px`, padding: '5px' }}
        onDrag={onDrag}
        onDoubleClick={() => setRotated(!rotated)}
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
