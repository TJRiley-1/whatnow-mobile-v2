import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { signInWithEmail, signInWithGoogle, resetPassword } from "@/lib/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmail(email, password);
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      Alert.alert("Google Sign In Failed", error.message);
    } finally {
      setGoogleLoading(false);
    }
  }

  function handleForgotPassword() {
    if (!email) {
      Alert.alert(
        "Enter Email",
        "Please enter your email address first, then tap Forgot Password."
      );
      return;
    }
    Alert.alert(
      "Reset Password",
      `Send a password reset link to ${email}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send",
          onPress: async () => {
            try {
              await resetPassword(email);
              Alert.alert("Check your email", "We sent you a password reset link.");
            } catch (error: any) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          className="px-6"
        >
          {/* Title */}
          <Text className="text-4xl font-bold text-center text-primary mb-2">
            What <Text className="text-primary-light">Now?</Text>
          </Text>
          <Text className="text-base text-center text-text-secondary mb-10">
            Sign in to sync across devices and compete{"\n"}with friends
          </Text>

          {/* Google Sign In */}
          <TouchableOpacity
            className="bg-white rounded-2xl py-4 flex-row items-center justify-center mb-3"
            activeOpacity={0.8}
            onPress={handleGoogleLogin}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <ActivityIndicator color="#4285F4" />
            ) : (
              <>
                <Text className="text-2xl mr-2">G</Text>
                <Text className="text-lg font-semibold text-gray-800">
                  Sign in with Google
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Facebook Coming Soon */}
          <TouchableOpacity
            className="bg-bg-elevated rounded-2xl py-4 flex-row items-center justify-center mb-6"
            activeOpacity={0.5}
            disabled
          >
            <FontAwesome name="facebook" size={20} color="#64748b" />
            <Text className="text-lg font-semibold text-text-muted ml-3">
              Coming Soon
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-border-subtle" />
            <Text className="text-text-muted mx-4">or</Text>
            <View className="flex-1 h-px bg-border-subtle" />
          </View>

          {/* Email */}
          <TextInput
            className="bg-bg-card border border-border-subtle text-text-primary rounded-2xl px-4 py-4 mb-3 text-base"
            placeholder="Email address"
            placeholderTextColor="#64748b"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />

          {/* Password */}
          <View className="mb-5">
            <TextInput
              className="bg-bg-card border border-border-subtle text-text-primary rounded-2xl px-4 py-4 text-base pr-12"
              placeholder="Password"
              placeholderTextColor="#64748b"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoComplete="password"
              onSubmitEditing={handleLogin}
              returnKeyType="go"
            />
            <TouchableOpacity
              className="absolute right-4 top-4"
              onPress={() => setShowPassword(!showPassword)}
            >
              <FontAwesome
                name={showPassword ? "eye" : "eye-slash"}
                size={18}
                color="#64748b"
              />
            </TouchableOpacity>
          </View>

          {/* Sign In */}
          <TouchableOpacity
            className="bg-primary rounded-2xl py-4 items-center mb-3"
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Create Account */}
          <Link href="/(auth)/signup" asChild>
            <TouchableOpacity
              className="border border-border-subtle rounded-2xl py-3 items-center mb-4"
              activeOpacity={0.8}
            >
              <Text className="text-text-primary font-semibold text-base">
                Create Account
              </Text>
            </TouchableOpacity>
          </Link>

          {/* Forgot Password */}
          <TouchableOpacity className="items-center mb-6" onPress={handleForgotPassword}>
            <Text className="text-primary text-sm">Forgot Password?</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
