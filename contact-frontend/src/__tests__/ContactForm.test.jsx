import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContactForm from '../components/ContactForm';

describe('ContactForm', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  function fillForm({ name = 'Jane Doe', email = 'jane@example.com', message = 'Hello there' } = {}) {
    fireEvent.change(screen.getByLabelText(/name/i), { target: { name: 'name', value: name } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { name: 'email', value: email } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { name: 'message', value: message } });
  }

  it('shows success alert and resets fields after successful submission', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true }),
    }));

    render(<ContactForm />);
    fillForm();
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText(/your message has been sent/i)).toBeInTheDocument();
    });
    expect(screen.getByLabelText(/name/i)).toHaveValue('');
    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.getByLabelText(/message/i)).toHaveValue('');
  });

  it('shows field-level errors returned by the API on 422', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      json: () => Promise.resolve({
        success: false,
        errors: { email: 'A valid email address is required.' },
      }),
    }));

    render(<ContactForm />);
    fillForm();
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText('A valid email address is required.')).toBeInTheDocument();
    });
  });

  it('shows error alert on server error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    }));

    render(<ContactForm />);
    fillForm();
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to send message/i)).toBeInTheDocument();
    });
  });

  it('shows client-side validation errors and does not call fetch when fields are empty', () => {
    const mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);

    render(<ContactForm />);
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(screen.getByText('Name is required.')).toBeInTheDocument();
    expect(screen.getByText('Message is required.')).toBeInTheDocument();
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
