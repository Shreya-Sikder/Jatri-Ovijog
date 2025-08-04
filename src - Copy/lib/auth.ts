import { api } from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'passenger' | 'police' | 'admin';
}

let currentUser: User | null = null;

export async function signIn(email: string, password: string) {
  try {
    const response = await api.auth.login(email, password);
    currentUser = response.user;
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('token', response.token);
    return response;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function signUp(userData: {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: 'passenger' | 'police';
}) {
  try {
    const response = await api.auth.register(userData);
    return response;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
}

export async function signOut() {
  currentUser = null;
  localStorage.removeItem('user');
  localStorage.removeItem('token');
}

export async function getCurrentUser(): Promise<User | null> {
  if (currentUser) return currentUser;
  
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    return currentUser;
  }
  
  return null;
}

export function isPoliceUser(user: User | null): boolean {
  return user?.role === 'police';
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
}