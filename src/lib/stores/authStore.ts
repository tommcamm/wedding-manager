import { writable } from 'svelte/store';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'helper';
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

// Mock admin user
const mockAdminUser: User = {
  id: '1',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin'
};

// Create writable store
const { subscribe, set, update } = writable<AuthState>(initialState);

// Auth store with actions
const authStore = {
  subscribe,
  
  // Mock login function
  login: async (email: string, password: string) => {
    // Start loading
    update(state => ({ ...state, isLoading: true, error: null }));
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simple validation for demonstration
    if (email === 'admin@example.com' && password === 'password') {
      // Success
      update(state => ({
        ...state,
        user: mockAdminUser,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }));
      
      return true;
    } else {
      // Failure
      update(state => ({
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Invalid email or password'
      }));
      
      return false;
    }
  },
  
  // Mock logout function
  logout: () => {
    // Reset to initial state
    set(initialState);
  },
  
  // Clear any error messages
  clearError: () => {
    update(state => ({ ...state, error: null }));
  }
};

export default authStore;
