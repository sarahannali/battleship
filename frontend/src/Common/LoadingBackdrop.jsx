import { Backdrop, Typography } from '@mui/material';
import React from 'react';

function LoadingBackdrop({ open, text }) {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: 100 }}
      open={open}
    >
      <Typography variant="h5" textAlign="center" color="text.primary">
        {text}
      </Typography>
    </Backdrop>
  );
}

export default LoadingBackdrop;
