import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renders message on successful fetch', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Hello, world!' }),
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    });
  });

  test('renders error text when fetch fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Could not load message.')).toBeInTheDocument();
    });
  });
});
