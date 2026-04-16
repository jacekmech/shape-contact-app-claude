import { useState } from 'react';
import { Alert, Box, Button, TextField, Typography } from '@mui/material';
import config from '../config.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateFields = (values) => {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = 'Name is required';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'Invalid email address';
  }

  if (!values.message.trim()) {
    errors.message = 'Message is required';
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

function ContactForm() {
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateFields(values);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    setStatus('submitting');

    try {
      const res = await fetch(`${config.apiBaseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (res.status === 422) {
        const body = await res.json();
        setErrors(body.errors || {});
        setStatus('idle');
        return;
      }

      if (!res.ok) {
        setStatus('error');
        return;
      }

      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Message sent
        </Typography>
        <Typography>Thank you for reaching out. Your message has been received.</Typography>
      </Box>
    );
  }

  if (status === 'error') {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Something went wrong
        </Typography>
        <Typography>
          Your message could not be sent. Please try again later.
        </Typography>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ p: 4, maxWidth: 480 }}>
      <Typography variant="h5" gutterBottom>
        Contact us
      </Typography>
      <TextField
        fullWidth
        margin="normal"
        label="Name"
        name="name"
        value={values.name}
        onChange={handleChange}
        error={Boolean(errors.name)}
        helperText={errors.name || ''}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Email"
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
        error={Boolean(errors.email)}
        helperText={errors.email || ''}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Message"
        name="message"
        multiline
        rows={4}
        value={values.message}
        onChange={handleChange}
        error={Boolean(errors.message)}
        helperText={errors.message || ''}
      />
      <Box sx={{ mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Sending…' : 'Send message'}
        </Button>
      </Box>
    </Box>
  );
}

export default ContactForm;
