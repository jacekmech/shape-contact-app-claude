import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../App';

describe('App — contact form', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renders name, email, and message fields and a submit button', () => {
    render(<App />);
    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^message$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  test('shows inline field errors when submitting an empty form', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    expect(await screen.findByText('Name is required.')).toBeInTheDocument();
    expect(screen.getByText('Email address is required.')).toBeInTheDocument();
    expect(screen.getByText('Message is required.')).toBeInTheDocument();
  });

  test('shows success alert and resets form fields after a valid submission', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });

    render(<App />);

    fireEvent.change(screen.getByLabelText(/^name$/i), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'alice@example.com' } });
    fireEvent.change(screen.getByLabelText(/^message$/i), { target: { value: 'Hello there.' } });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/your message has been sent/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/^name$/i)).toHaveValue('');
    expect(screen.getByLabelText(/^email$/i)).toHaveValue('');
    expect(screen.getByLabelText(/^message$/i)).toHaveValue('');
  });

  test('shows field errors returned in a 422 response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => ({ errors: { email: 'Email address is invalid.' } }),
    });

    render(<App />);

    fireEvent.change(screen.getByLabelText(/^name$/i), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'alice@example.com' } });
    fireEvent.change(screen.getByLabelText(/^message$/i), { target: { value: 'Hello there.' } });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByText('Email address is invalid.')).toBeInTheDocument();
  });

  test('shows generic error alert on network failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'));

    render(<App />);

    fireEvent.change(screen.getByLabelText(/^name$/i), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'alice@example.com' } });
    fireEvent.change(screen.getByLabelText(/^message$/i), { target: { value: 'Hello there.' } });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
  });
});
