import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { signOut } from "@/lib/auth";
import { useAuthStore } from "@/stores/authStore";
import { useProfile } from "@/hooks/useProfile";
import { getRankInfo } from "@/lib/ranks";

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { data: profile } = useProfile();

  const points = profile?.total_points ?? 0;
  const tasksDone = profile?.total_tasks_completed ?? 0;
  const rankInfo = getRankInfo(points);

  function handleSignOut() {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: signOut },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-bg-primary" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-2xl font-bold text-text-primary mb-6 pt-4">
          Profile
        </Text>

        {/* User Card */}
        <View className="bg-bg-card rounded-2xl p-5 flex-row items-center mb-6">
          <View className="w-14 h-14 rounded-full bg-bg-elevated items-center justify-center mr-4">
            <Text className="text-2xl font-bold text-primary">
              {(profile?.display_name?.[0] ?? user?.email?.[0] ?? "?").toUpperCase()}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-text-primary">
              {profile?.display_name ?? "User"}
            </Text>
            <Text className="text-sm text-text-secondary">{user?.email}</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View className="flex-row justify-between mb-6">
          <View className="flex-1 bg-bg-card rounded-2xl p-4 mx-1 items-center">
            <Text className="text-xl font-bold text-primary">{points}</Text>
            <Text className="text-xs text-text-secondary mt-1">
              Total Points
            </Text>
          </View>
          <View className="flex-1 bg-bg-card rounded-2xl p-4 mx-1 items-center">
            <Text className="text-xl font-bold text-danger">{tasksDone}</Text>
            <Text className="text-xs text-text-secondary mt-1">Tasks Done</Text>
          </View>
          <View className="flex-1 bg-bg-card rounded-2xl p-4 mx-1 items-center">
            <Text className="text-xl font-bold text-accent">
              {rankInfo.currentRank.replace("Task ", "")}
            </Text>
            <Text className="text-xs text-text-secondary mt-1">Rank</Text>
          </View>
        </View>

        {/* Menu Items */}
        <TouchableOpacity
          className="bg-bg-card rounded-2xl py-4 px-5 mb-3"
          onPress={() => router.push("/edit-profile")}
        >
          <Text style={{ color: "#f1f5f9", fontWeight: "600", fontSize: 16, textAlign: "center" }}>
            Edit Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-bg-card rounded-2xl py-4 px-5 mb-3"
          onPress={() => router.push("/groups")}
        >
          <Text style={{ color: "#f1f5f9", fontWeight: "600", fontSize: 16, textAlign: "center" }}>
            My Groups
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-bg-card rounded-2xl py-4 px-5 mb-3"
          onPress={() => router.push("/import-tasks")}
        >
          <Text style={{ color: "#f1f5f9", fontWeight: "600", fontSize: 16, textAlign: "center" }}>
            Import Tasks
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-bg-card rounded-2xl py-4 px-5 mb-3"
          onPress={() => router.push("/help")}
        >
          <Text style={{ color: "#f1f5f9", fontWeight: "600", fontSize: 16, textAlign: "center" }}>
            Help & FAQ
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-bg-card rounded-2xl py-4 px-5 mb-3">
          <Text style={{ color: "#f1f5f9", fontWeight: "600", fontSize: 16, textAlign: "center" }}>
            Enable Notifications
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="border border-border-subtle rounded-2xl py-4 px-5 mb-8"
          onPress={handleSignOut}
        >
          <Text className="text-danger font-semibold text-base text-center">
            Sign Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
