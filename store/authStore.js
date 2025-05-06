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
            const response = await fetch('https://bookstore-backend-mobile.onrender.com/api/auth/register', {
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

    login: async (email, password) => {
        set({ isLoading: true });

        try {
            const response = await fetch('https://bookstore-backend-mobile.onrender.com/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
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
            console.error('Error during login:', error.message);
            return { success: false, error: error.message };
        } finally {
            set({ isLoading: false });
        }
    },

    checkAuth: async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const userJson = await AsyncStorage.getItem('user');
            const user = userJson ? JSON.parse(userJson) : null;

            set({ token, user });
        } catch (error) {
            console.error('Error retrieving data from AsyncStorage:', error);
        }
    },

    logout: async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        set({ token: null, user: null });
    },
}));
