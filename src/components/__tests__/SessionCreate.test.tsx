import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SessionCreate from '../SessionCreate';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('firebase/database', () => ({
  ref: vi.fn(),
  push: vi.fn(() => ({ key: 'test-session-id' })),
  set: vi.fn(() => Promise.resolve()),
}));

vi.mock('../../lib/firebase', () => ({
  db: {},
  auth: {
    currentUser: { uid: 'user123' },
  },
}));

describe('SessionCreate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render session creation form', () => {
    render(
      <BrowserRouter>
        <SessionCreate />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/session name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create session/i })).toBeInTheDocument();
  });

  it('should have date input defaulting to today', () => {
    render(
      <BrowserRouter>
        <SessionCreate />
      </BrowserRouter>
    );

    const dateInput = screen.getByLabelText(/date/i) as HTMLInputElement;
    const today = new Date().toISOString().split('T')[0];
    expect(dateInput.value).toBe(today);
  });

  it('should update name input on change', () => {
    render(
      <BrowserRouter>
        <SessionCreate />
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText(/session name/i) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'Tuesday Game' } });

    expect(nameInput.value).toBe('Tuesday Game');
  });

  it('should update date input on change', () => {
    render(
      <BrowserRouter>
        <SessionCreate />
      </BrowserRouter>
    );

    const dateInput = screen.getByLabelText(/date/i) as HTMLInputElement;
    fireEvent.change(dateInput, { target: { value: '2025-12-15' } });

    expect(dateInput.value).toBe('2025-12-15');
  });

  it('should show alert when name is empty', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <BrowserRouter>
        <SessionCreate />
      </BrowserRouter>
    );

    const createButton = screen.getByRole('button', { name: /create session/i });
    fireEvent.click(createButton);

    expect(alertSpy).toHaveBeenCalledWith('Please enter a session name');
    alertSpy.mockRestore();
  });
});
