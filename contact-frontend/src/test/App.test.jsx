import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App.jsx';

describe('App', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('displays the message on successful fetch', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ message: 'Hello, World!' }),
      }),
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Hello, World!')).toBeInTheDocument();
    });
  });

  it('displays an error notice when the API is unreachable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Could not load message/)).toBeInTheDocument();
    });
  });

  it('displays an error notice when the response is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
      }),
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Could not load message/)).toBeInTheDocument();
    });
  });
});
