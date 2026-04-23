import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import config from '../config';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const initialFields = { name: '', email: '', message: '' };

const ContactForm = () => {
  const [fields, setFields] = useState(initialFields);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState(null);

  const validate = () => {
    const errors = {};
    if (!fields.name.trim()) errors.name = 'Name is required.';
    if (!fields.email.trim()) {
      errors.email = 'A valid email address is required.';
    } else if (!EMAIL_REGEX.test(fields.email.trim())) {
      errors.email = 'A valid email address is required.';
    }
    if (!fields.message.trim()) errors.message = 'Message is required.';
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setServerError(null);

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${config.apiBaseUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });

      if (res.ok) {
        setFields(initialFields);
        setFieldErrors({});
        setSuccess(true);
      } else if (res.status === 422) {
        const data = await res.json();
        setFieldErrors(data.errors || {});
      } else {
        setServerError('Failed to send message. Please try again later.');
      }
    } catch {
      setServerError('Failed to send message. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ maxWidth: 600, mx: 'auto', mt: 4, px: 2 }}
    >
      <Typography variant="h5" mb={2}>Contact Us</Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Your message has been sent. Thank you!
        </Alert>
      )}

      {serverError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {serverError}
        </Alert>
      )}

      <TextField
        label="Name"
        name="name"
        value={fields.name}
        onChange={handleChange}
        error={Boolean(fieldErrors.name)}
        helperText={fieldErrors.name || ' '}
        fullWidth
        margin="normal"
        required
      />

      <TextField
        label="Email"
        name="email"
        type="email"
        value={fields.email}
        onChange={handleChange}
        error={Boolean(fieldErrors.email)}
        helperText={fieldErrors.email || ' '}
        fullWidth
        margin="normal"
        required
      />

      <TextField
        label="Message"
        name="message"
        value={fields.message}
        onChange={handleChange}
        error={Boolean(fieldErrors.message)}
        helperText={fieldErrors.message || ' '}
        fullWidth
        margin="normal"
        required
        multiline
        rows={4}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={submitting}
        sx={{ mt: 2 }}
      >
        {submitting ? 'Sending...' : 'Send'}
      </Button>
    </Box>
  );
};

export default ContactForm;
