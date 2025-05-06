
import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import COLORS from '../../constants/colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const Tablayout = () => {
    const insets = useSafeAreaInsets(); // Dùng để lấy thông tin về safe area insets
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                headerTitleStyle: {
                    color: COLORS.textPrimary,
                    fontWeight: "600",
                },
                headerShadowVisible: false,

                tabBarStyle: {
                    backgroundColor: COLORS.cardBackground,
                    borderTopWidth: 1,
                    borderBottomColor: COLORS.border,
                    paddingTop: 5,
                    paddingBottom: insets.bottom, // Thêm paddingBottom bằng với chiều cao của safe area bottom
                    height: 60 + insets.bottom, // Thêm paddingBottom bằng với chiều cao của safe area bottom
                }
            }}
        >
            <Tabs.Screen
                name='index'
                options={
                    {
                        title: "Home",
                        tabBarIcon: ({ color, size }) => (<Ionicons name='home-outline' size={size} color={color} />)
                    }}
            />
            <Tabs.Screen
                name='create'
                options={
                    {
                        title: "Create",
                        tabBarIcon: ({ color, size }) => (<Ionicons name='add-circle-outline' size={size} color={color} />)
                    }
                }
            />
            <Tabs.Screen
                name='profile'
                options={
                    {
                        title: "Profile",
                        tabBarIcon: ({ color, size }) => (<Ionicons name='person-outline' size={size} color={color} />)
                    }}
            />
        </Tabs>
    )
}

export default Tablayout