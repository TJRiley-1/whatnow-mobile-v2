import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ThemeProvider, DarkTheme } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as Linking from "expo-linking";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { supabase } from "@/lib/supabase";
import { extractSessionFromUrl } from "@/lib/auth";
import { useAuthStore } from "@/stores/authStore";

import "../global.css";

export { ErrorBoundary } from "expo-router";

const queryClient = new QueryClient();

const WhatnowDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#6366f1",
    background: "#0a0e1a",
    card: "#0a0e1a",
    text: "#f1f5f9",
    border: "#1a1f3d",
    notification: "#ef4444",
  },
};

SplashScreen.preventAutoHideAsync();

function AuthGate({ children }: { children: React.ReactNode }) {
  const { session, initialized } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!session && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (session && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [session, initialized, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  const { setSession, setInitialized } = useAuthStore();

  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Auth state listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Deep link listener for OAuth callback
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      if (event.url.includes("auth/callback")) {
        try {
          await extractSessionFromUrl(event.url);
        } catch (err) {
          console.error("Failed to extract session from URL:", err);
        }
      }
    };

    // Handle URL if app was opened from a deep link
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    // Listen for incoming links while app is open
    const subscription = Linking.addEventListener("url", handleDeepLink);

    return () => subscription.remove();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={WhatnowDarkTheme}>
          <StatusBar style="light" />
          <AuthGate>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="add-task"
                options={{ presentation: "modal" }}
              />
              <Stack.Screen
                name="what-next"
                options={{ presentation: "fullScreenModal" }}
              />
              <Stack.Screen
                name="manage-tasks"
                options={{ presentation: "modal" }}
              />
              <Stack.Screen
                name="timer"
                options={{ presentation: "fullScreenModal", gestureEnabled: false }}
              />
              <Stack.Screen
                name="celebration"
                options={{ presentation: "fullScreenModal", gestureEnabled: false }}
              />
              <Stack.Screen
                name="edit-profile"
                options={{ presentation: "modal" }}
              />
              <Stack.Screen
                name="import-tasks"
                options={{ presentation: "modal" }}
              />
              <Stack.Screen
                name="groups"
                options={{ presentation: "modal" }}
              />
              <Stack.Screen
                name="help"
                options={{ presentation: "modal" }}
              />
            </Stack>
          </AuthGate>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
