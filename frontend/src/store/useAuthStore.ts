import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, User } from '../types';

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            login: (token: string, user: User) => {
                // In a real app, you might validate the token or fetch user details here
                set({ token, user, isAuthenticated: true });
            },
            logout: () => {
                set({ token: null, user: null, isAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
);
