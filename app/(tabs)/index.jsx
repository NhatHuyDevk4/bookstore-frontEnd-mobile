

import { View, Text, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'
import { useAuthStore } from '../../store/authStore'

const Home = () => {

    const { logout } = useAuthStore();

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Home</Text>
                <Text onPress={logout}>Logout</Text>
            </View>

        </KeyboardAvoidingView>
    )
}

export default Home