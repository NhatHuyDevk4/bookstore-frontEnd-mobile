import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { checkAuth, user, token } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  // First effect - check auth status and set isReady when done
  useEffect(() => {
    async function prepare() {
      try {
        await checkAuth();
        setIsReady(true);
      } catch (e) {
        console.warn("Authentication check failed:", e);
        setIsReady(true);
      }
    }
    
    prepare();
  }, []);

  // Second effect - handle navigation only when isReady is true
  useEffect(() => {
    if (!isReady) {
      return;
    }
    
    const isAuthScreen = segments[0] === "(auth)";
    const isLoggedIn = !!user && !!token;

    if (!isAuthScreen && !isLoggedIn) {
      router.replace("/(auth)");
    } else if (isAuthScreen && isLoggedIn) {
      router.replace("/(tabs)");
    }
  }, [isReady, segments, token, user]);

  // Show a loading screen until auth check is complete
  if (!isReady) {
    return (
      <SafeAreaProvider>
        <SafeScreen>
          {/* You could add a loading indicator here */}
        </SafeScreen>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
    </SafeAreaProvider>
  );
}