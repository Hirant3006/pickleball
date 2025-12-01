import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SessionDashboard from '../SessionDashboard';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../lib/firebase', () => ({
  db: {},
  auth: {
    currentUser: { uid: 'user123' },
  },
}));

vi.mock('../../hooks/useUserSessions', () => ({
  useUserSessions: () => ({
    sessions: [],
    loading: false,
    error: null,
  }),
}));

describe('SessionDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render dashboard title', () => {
    render(
      <BrowserRouter>
        <SessionDashboard />
      </BrowserRouter>
    );

    expect(screen.getByText('pickle')).toBeInTheDocument();
    expect(screen.getByText('My Sessions')).toBeInTheDocument();
  });

  it('should show empty state when no sessions', () => {
    render(
      <BrowserRouter>
        <SessionDashboard />
      </BrowserRouter>
    );

    expect(screen.getByText(/no sessions found/i)).toBeInTheDocument();
  });

  it('should have create new session button', () => {
    render(
      <BrowserRouter>
        <SessionDashboard />
      </BrowserRouter>
    );

    const buttons = screen.getAllByRole('button', { name: /create/i });
    expect(buttons.length).toBeGreaterThan(0);
  });
});
