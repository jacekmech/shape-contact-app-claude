import { useState } from 'react';
import { Alert, Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import config from './config';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emptyForm = { name: '', email: '', message: '' };
const emptyErrors = { name: '', email: '', message: '' };

const validate = ({ name, email, message }) => {
  const errors = {};

  const trimmedName = name.trim();
  if (!trimmedName) errors.name = 'Name is required.';
  else if (trimmedName.length > 200) errors.name = 'Name must be 200 characters or fewer.';

  const trimmedEmail = email.trim();
  if (!trimmedEmail) errors.email = 'Email address is required.';
  else if (!EMAIL_REGEX.test(trimmedEmail)) errors.email = 'Email address is invalid.';

  const trimmedMessage = message.trim();
  if (!trimmedMessage) errors.message = 'Message is required.';
  else if (trimmedMessage.length > 2000) errors.message = 'Message must be 2000 characters or fewer.';

  return errors;
};

function App() {
  const [form, setForm] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState(emptyErrors);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors({ ...emptyErrors, ...errors });
      return;
    }

    setFieldErrors(emptyErrors);
    setGeneralError('');
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch(`${config.apiBaseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccess(true);
        setForm(emptyForm);
      } else if (res.status === 422) {
        const data = await res.json();
        setFieldErrors({ ...emptyErrors, ...(data.errors || {}) });
      } else {
        setGeneralError('Something went wrong. Please try again.');
      }
    } catch {
      setGeneralError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Contact Us
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Your message has been sent. Thank you!
        </Alert>
      )}

      {generalError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {generalError}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          error={Boolean(fieldErrors.name)}
          helperText={fieldErrors.name}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={Boolean(fieldErrors.email)}
          helperText={fieldErrors.email}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Message"
          name="message"
          value={form.message}
          onChange={handleChange}
          error={Boolean(fieldErrors.message)}
          helperText={fieldErrors.message}
          fullWidth
          multiline
          rows={5}
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ mt: 2 }}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {loading ? 'Sending…' : 'Send Message'}
        </Button>
      </Box>
    </Box>
  );
}

export default App;
