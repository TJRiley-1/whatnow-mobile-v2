import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuthStore } from "@/stores/authStore";
import { useProfile } from "@/hooks/useProfile";
import { getRankInfo } from "@/lib/ranks";

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { data: profile } = useProfile();

  const points = profile?.total_points ?? 0;
  const rankInfo = getRankInfo(points);

  return (
    <SafeAreaView className="flex-1 bg-bg-primary" edges={["top"]}>
      {/* Notification Bell - fixed at top */}
      <View style={{ paddingHorizontal: 24 }} className="items-end pt-2 pb-2">
        <TouchableOpacity className="bg-bg-card w-12 h-12 rounded-full items-center justify-center">
          <FontAwesome name="bell-o" size={20} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100, flexGrow: 1, justifyContent: "center" }}
        showsVerticalScrollIndicator={false}
      >
        {/* Rank Badge */}
        <View className="items-center mb-2">
          <View className="bg-bg-elevated rounded-full px-6 py-2 border border-accent/30">
            <Text className="text-accent font-bold text-base">
              {rankInfo.currentRank}
            </Text>
          </View>
        </View>

        {/* Points */}
        <View className="items-center mb-2">
          <Text className="text-text-secondary text-base">
            <Text className="font-bold text-text-primary">{points}</Text> points
          </Text>
        </View>

        {/* Progress Bar */}
        <View className="mx-12 mb-1">
          <View className="h-2 bg-bg-card rounded-full overflow-hidden">
            <View
              className="h-full bg-primary rounded-full"
              style={{ width: `${rankInfo.progress}%` }}
            />
          </View>
        </View>
        <Text className="text-text-muted text-xs text-center mb-8">
          {rankInfo.nextRank
            ? `Next: ${rankInfo.nextRank}`
            : "Max rank achieved!"}
        </Text>

        {/* Title */}
        <View className="items-center mb-2">
          <Text className="text-4xl font-bold text-primary">
            What <Text className="text-primary-light">Now?</Text>
          </Text>
        </View>
        <Text className="text-text-secondary text-base text-center mb-10">
          Stop overthinking. Start doing.
        </Text>

        {/* Action Buttons */}
        <TouchableOpacity
          className="bg-primary rounded-2xl py-5 items-center mb-4"
          activeOpacity={0.8}
          onPress={() => router.push("/add-task")}
        >
          <Text style={{ color: "#ffffff", fontWeight: "bold", fontSize: 18 }}>Add Task</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-bg-card border border-border-subtle rounded-2xl py-5 items-center mb-4"
          activeOpacity={0.8}
          onPress={() => router.push("/what-next")}
        >
          <Text className="text-text-primary font-bold text-lg">What Task Now?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="py-3 items-center"
          activeOpacity={0.7}
          onPress={() => router.push("/manage-tasks")}
        >
          <Text className="text-primary font-semibold text-base">
            Manage Tasks
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
