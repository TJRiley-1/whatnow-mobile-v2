import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/lib/supabase";

export default function EditProfileScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const { data: profile } = useProfile();

  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  async function handleSaveProfile() {
    if (!user || !displayName.trim()) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ display_name: displayName.trim(), updated_at: new Date().toISOString() })
        .eq("id", user.id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      Alert.alert("Success", "Profile updated!");
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword() {
    if (!newPassword.trim()) {
      Alert.alert("Error", "Please enter a new password");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      Alert.alert("Success", "Password updated!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Failed to update password");
    } finally {
      setChangingPassword(false);
    }
  }

  const initial = (profile?.display_name?.[0] ?? user?.email?.[0] ?? "?").toUpperCase();

  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
        {/* Header */}
        <View className="flex-row items-center px-5 pt-4 pb-2">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <FontAwesome name="arrow-left" size={20} color="#f1f5f9" />
          </TouchableOpacity>
          <Text style={{ color: "#f1f5f9", fontWeight: "bold", fontSize: 20 }}>Edit Profile</Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar */}
          <View className="items-center py-6">
            <View className="w-24 h-24 rounded-full bg-bg-elevated items-center justify-center mb-3" style={{ borderWidth: 2, borderColor: "#6366f1" }}>
              <Text style={{ color: "#6366f1", fontWeight: "bold", fontSize: 36 }}>{initial}</Text>
            </View>
            <Text style={{ color: "#64748b", fontSize: 12 }}>Avatar upload coming soon</Text>
          </View>

          {/* Display Name */}
          <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: "bold", letterSpacing: 1, marginBottom: 8 }}>
            DISPLAY NAME
          </Text>
          <TextInput
            className="bg-bg-card rounded-2xl px-4 py-4 mb-6"
            style={{ color: "#f1f5f9", fontSize: 16 }}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Enter display name"
            placeholderTextColor="#64748b"
          />

          {/* Email (read-only) */}
          <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: "bold", letterSpacing: 1, marginBottom: 8 }}>
            EMAIL
          </Text>
          <View className="bg-bg-card rounded-2xl px-4 py-4 mb-6" style={{ opacity: 0.6 }}>
            <Text style={{ color: "#94a3b8", fontSize: 16 }}>{user?.email ?? ""}</Text>
          </View>

          {/* Save Profile Button */}
          <TouchableOpacity
            className="bg-primary rounded-2xl py-4 mb-8"
            activeOpacity={0.8}
            onPress={handleSaveProfile}
            disabled={saving}
          >
            <Text style={{ color: "#ffffff", fontWeight: "bold", fontSize: 16, textAlign: "center" }}>
              {saving ? "Saving..." : "Save Profile"}
            </Text>
          </TouchableOpacity>

          {/* Change Password Section */}
          <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: "bold", letterSpacing: 1, marginBottom: 12 }}>
            CHANGE PASSWORD
          </Text>

          <TextInput
            className="bg-bg-card rounded-2xl px-4 py-4 mb-4"
            style={{ color: "#f1f5f9", fontSize: 16 }}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="New password"
            placeholderTextColor="#64748b"
            secureTextEntry
          />

          <TextInput
            className="bg-bg-card rounded-2xl px-4 py-4 mb-4"
            style={{ color: "#f1f5f9", fontSize: 16 }}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            placeholderTextColor="#64748b"
            secureTextEntry
          />

          <TouchableOpacity
            className="rounded-2xl py-4 mb-4"
            style={{ borderWidth: 1, borderColor: "#6366f1" }}
            activeOpacity={0.8}
            onPress={handleChangePassword}
            disabled={changingPassword}
          >
            <Text style={{ color: "#6366f1", fontWeight: "bold", fontSize: 16, textAlign: "center" }}>
              {changingPassword ? "Updating..." : "Update Password"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
