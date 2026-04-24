import { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import config from './config';

function App() {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/api/hello`)
      .then((res) => {
        if (!res.ok) throw new Error('Unexpected response');
        return res.json();
      })
      .then((data) => setMessage(data.message))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Could not load message.</Alert>
      </Box>
    );
  }

  if (message === null) {
    return (
      <Box sx={{ p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">{message}</Typography>
    </Box>
  );
}

export default App;
