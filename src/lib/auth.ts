import { getUsers, saveUsers, saveSession, clearSession, getSession } from './storage';
import type { User } from '@/types/auth';

export function signUp(email: string, password: string): {
  success: boolean;
  error?: string;
} {
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    return { success: false, error: 'User already exists' };
  }
  const newUser: User = {
    id: crypto.randomUUID(),
    email,
    password,
    createdAt: new Date().toISOString(),
  };
  saveUsers([...users, newUser]);
  saveSession({ userId: newUser.id, email: newUser.email });
  return { success: true };
}

export function logIn(email: string, password: string): {
  success: boolean;
  error?: string;
} {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }
  saveSession({ userId: user.id, email: user.email });
  return { success: true };
}

export function logOut(): void {
  clearSession();
}

export { getSession };
