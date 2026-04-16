import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import config from './config.js';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/api/hello`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Unexpected response');
        }
        return res.json();
      })
      .then((json) => {
        setData(json.message);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return null;
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Could not load message. Please try again later.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography>{data}</Typography>
    </Box>
  );
}

export default App;
