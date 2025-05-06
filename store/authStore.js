import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isLoading: false,

    setUser: (user) => set({ user }),

    register: async (username, email, password) => {
        set({ isLoading: true });

        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });
            console.log('Response:', response); // Log the response object

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong!');
            }

            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            await AsyncStorage.setItem('token', data.token);

            set({ user: data.user, token: data.token, isLoading: false });

            return { success: true };
        } catch (error) {
            console.error('Error during registration:', error.message);
            return { success: false, error: error.message };
        } finally {
            set({ isLoading: false });
        }
    },
}));
