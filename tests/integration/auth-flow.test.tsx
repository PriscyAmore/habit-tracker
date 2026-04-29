import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { STORAGE_KEYS } from '@/lib/constants';

const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}));

import SignupForm from '@/components/auth/SignupForm';
import LoginForm from '@/components/auth/LoginForm';

beforeEach(() => {
  localStorage.clear();
  mockPush.mockClear();
  mockReplace.mockClear();
});

describe('auth flow', () => {
  it('submits the signup form and creates a session', async () => {
    render(<SignupForm />);
    fireEvent.change(screen.getByTestId('auth-signup-email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByTestId('auth-signup-password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByTestId('auth-signup-submit'));
    await waitFor(() => {
      const session = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) ?? 'null');
      expect(session).not.toBeNull();
      expect(session.email).toBe('test@example.com');
    });
  });

  it('shows an error for duplicate signup email', async () => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([
      { id: '1', email: 'test@example.com', password: 'pass', createdAt: '' }
    ]));
    render(<SignupForm />);
    fireEvent.change(screen.getByTestId('auth-signup-email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByTestId('auth-signup-password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByTestId('auth-signup-submit'));
    await waitFor(() => {
      expect(screen.getByText('User already exists')).toBeInTheDocument();
    });
  });

  it('submits the login form and stores the active session', async () => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([
      { id: '1', email: 'test@example.com', password: 'password123', createdAt: '' }
    ]));
    render(<LoginForm />);
    fireEvent.change(screen.getByTestId('auth-login-email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByTestId('auth-login-password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByTestId('auth-login-submit'));
    await waitFor(() => {
      const session = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) ?? 'null');
      expect(session).not.toBeNull();
      expect(session.email).toBe('test@example.com');
    });
  });

  it('shows an error for invalid login credentials', async () => {
    render(<LoginForm />);
    fireEvent.change(screen.getByTestId('auth-login-email'), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByTestId('auth-login-password'), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByTestId('auth-login-submit'));
    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
  });
});
