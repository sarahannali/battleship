import React from 'react';
import { Alert, Fade, Snackbar } from '@mui/material';
import { useErrorContext } from '../Contexts/ErrorContext';

function ErrorSnackbar() {
  const { error, setError } = useErrorContext();
  return (
    <Snackbar
      autoHideDuration={6000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={error !== null}
      onClose={() => { setError(null); }}
      TransationComponent={Fade}
    >
      <Alert severity="error" sx={{ width: '100%' }}>
        {error}
      </Alert>
    </Snackbar>
  );
}

export default ErrorSnackbar;
