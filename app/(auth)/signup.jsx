import { View, Text, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React, { useState } from 'react'
import styles from '../../assets/styles/signup.styles'
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { Link } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
export default function Signup() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false); // false = hidden by default

  const { register, isLoading } = useAuthStore();
  const handleSignUp = async () => {
    console.log(username, email, password);
    const result = await register(username, email, password);

    if (!result.success) {
      Alert.alert('Error', 'Something went wrong! Please try again.');
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          {/* HEADR  */}
          <View style={styles.header}>
            <Text style={styles.title}>Create an account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
          </View>
          {/* FORM  */}
          <View style={styles.formContainer}>
            {/* UserName  */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder='Enter your username'
                  placeholderTextColor={'#999'}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize='none'
                />
              </View>
            </View>
            {/* EMAIL  */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons name='mail-outline'
                  size={20} color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder='Enter your email'
                  placeholderTextColor={COLORS.placeholderText}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType='email-address'
                  autoCapitalize='none'
                />
              </View>
            </View>

            {/* PASSWORD */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name='lock-closed-outline'
                  size={20} color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder='Enter your password'
                  placeholderTextColor={COLORS.placeholderText}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20} color={COLORS.primary}
                    style={styles.inputIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSignUp}
              disabled={isLoading}>

              {isLoading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>
            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}> Already haven an account? </Text>
              <Link href={'/'} asChild>
                <TouchableOpacity>
                  <Text style={styles.link}>Login</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}