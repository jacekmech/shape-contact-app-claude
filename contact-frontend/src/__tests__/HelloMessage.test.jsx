import { render, screen, waitFor } from '@testing-library/react';
import HelloMessage from '../components/HelloMessage';

describe('HelloMessage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the message from the API', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: 'Hello, World!' }),
    }));

    render(<HelloMessage />);

    await waitFor(() => {
      expect(screen.getByText('Hello, World!')).toBeInTheDocument();
    });
  });

  it('renders error text when the fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

    render(<HelloMessage />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load message/i)).toBeInTheDocument();
    });
  });
});
