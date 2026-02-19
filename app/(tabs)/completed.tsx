import { View, Text, TouchableOpacity, FlatList, RefreshControl, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState, useCallback } from "react";
import { useCompletedTasks } from "@/hooks/useTasks";
import { useProfile } from "@/hooks/useProfile";
import { useQueryClient } from "@tanstack/react-query";
import type { CompletedTask } from "@/types";

const TYPE_COLORS: Record<string, string> = {
  Chores: "#f59e0b",
  Work: "#3b82f6",
  Health: "#22c55e",
  Admin: "#8b5cf6",
  Errand: "#f97316",
  "Self-care": "#ec4899",
  Creative: "#06b6d4",
  Social: "#ef4444",
};

const TYPE_ICONS: Record<string, string> = {
  Chores: "home",
  Work: "briefcase",
  Health: "heartbeat",
  Admin: "file-text-o",
  Errand: "car",
  "Self-care": "leaf",
  Creative: "paint-brush",
  Social: "users",
};

function formatTime(mins: number) {
  if (mins >= 60) return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  return `${mins}m`;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function StatsRow() {
  const { data: profile } = useProfile();
  const totalTasks = profile?.total_tasks_completed ?? 0;
  const totalPoints = profile?.total_points ?? 0;
  const totalTime = profile?.total_time_spent ?? 0;

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
      <View style={{ flex: 1, backgroundColor: "#1a1f3d", borderRadius: 16, padding: 14, marginHorizontal: 4, alignItems: "center" }}>
        <Text style={{ color: "#f59e0b", fontWeight: "bold", fontSize: 22 }}>{totalTasks}</Text>
        <Text style={{ color: "#94a3b8", fontSize: 11, marginTop: 4 }}>Tasks Done</Text>
      </View>
      <View style={{ flex: 1, backgroundColor: "#1a1f3d", borderRadius: 16, padding: 14, marginHorizontal: 4, alignItems: "center" }}>
        <Text style={{ color: "#f59e0b", fontWeight: "bold", fontSize: 22 }}>{totalPoints}</Text>
        <Text style={{ color: "#94a3b8", fontSize: 11, marginTop: 4 }}>Points Earned</Text>
      </View>
      <View style={{ flex: 1, backgroundColor: "#1a1f3d", borderRadius: 16, padding: 14, marginHorizontal: 4, alignItems: "center" }}>
        <Text style={{ color: "#f59e0b", fontWeight: "bold", fontSize: 22 }}>{formatTime(totalTime)}</Text>
        <Text style={{ color: "#94a3b8", fontSize: 11, marginTop: 4 }}>Time Spent</Text>
      </View>
    </View>
  );
}

function GridItem({ item }: { item: CompletedTask }) {
  const color = TYPE_COLORS[item.task_type] ?? "#6366f1";
  const icon = (TYPE_ICONS[item.task_type] ?? "check") as any;

  return (
    <TouchableOpacity
      style={{ width: "23%", aspectRatio: 1, backgroundColor: color + "20", borderRadius: 16, alignItems: "center", justifyContent: "center", margin: "1%" }}
      activeOpacity={0.7}
      onPress={() => Alert.alert(item.task_name, `Type: ${item.task_type}\nPoints: +${item.points}\n${formatDate(item.completed_at)}`)}
    >
      <FontAwesome name={icon} size={22} color={color} />
      <Text style={{ color, fontSize: 9, marginTop: 4, textAlign: "center" }} numberOfLines={1}>
        {item.task_name}
      </Text>
    </TouchableOpacity>
  );
}

function ListItem({ item }: { item: CompletedTask }) {
  const color = TYPE_COLORS[item.task_type] ?? "#6366f1";

  return (
    <View style={{ backgroundColor: "#1a1f3d", borderRadius: 16, padding: 14, marginBottom: 10, flexDirection: "row", alignItems: "center" }}>
      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: color + "20", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
        <FontAwesome name={(TYPE_ICONS[item.task_type] ?? "check") as any} size={16} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: "#f1f5f9", fontWeight: "600", fontSize: 15 }}>{item.task_name}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
          <View style={{ backgroundColor: color + "30", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, marginRight: 8 }}>
            <Text style={{ color, fontSize: 10, fontWeight: "bold" }}>{item.task_type}</Text>
          </View>
          <Text style={{ color: "#64748b", fontSize: 11 }}>{formatDate(item.completed_at)}</Text>
        </View>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={{ color: "#f59e0b", fontWeight: "bold", fontSize: 16 }}>+{item.points}</Text>
        {item.time_spent != null && (
          <Text style={{ color: "#64748b", fontSize: 11 }}>{formatTime(item.time_spent)}</Text>
        )}
      </View>
    </View>
  );
}

export default function CompletedScreen() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { data: tasks, isLoading, refetch } = useCompletedTasks(200);
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["completed_tasks"] });
    await queryClient.invalidateQueries({ queryKey: ["profile"] });
    setRefreshing(false);
  }, []);

  const isEmpty = !tasks || tasks.length === 0;

  return (
    <SafeAreaView className="flex-1 bg-bg-primary" edges={["top"]}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
        <Text style={{ color: "#f1f5f9", fontWeight: "bold", fontSize: 24 }}>Completed</Text>
        {!isEmpty && (
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: viewMode === "grid" ? "#6366f1" : "#1a1f3d", alignItems: "center", justifyContent: "center", marginRight: 8 }}
              onPress={() => setViewMode("grid")}
            >
              <FontAwesome name="th" size={16} color={viewMode === "grid" ? "#ffffff" : "#64748b"} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: viewMode === "list" ? "#6366f1" : "#1a1f3d", alignItems: "center", justifyContent: "center" }}
              onPress={() => setViewMode("list")}
            >
              <FontAwesome name="list" size={16} color={viewMode === "list" ? "#ffffff" : "#64748b"} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <FlatList
        data={tasks ?? []}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === "grid" ? 4 : 1}
        key={viewMode}
        contentContainerStyle={{ paddingHorizontal: viewMode === "grid" ? 12 : 20, paddingBottom: 100 }}
        ListHeaderComponent={<StatsRow />}
        ListEmptyComponent={
          <View style={{ backgroundColor: "#1a1f3d", borderRadius: 16, padding: 32, alignItems: "center" }}>
            <FontAwesome name="check-circle-o" size={48} color="#64748b" style={{ marginBottom: 12 }} />
            <Text style={{ color: "#94a3b8", textAlign: "center", fontSize: 14 }}>
              Complete your first task to see it here!
            </Text>
          </View>
        }
        renderItem={({ item }) =>
          viewMode === "grid" ? <GridItem item={item} /> : <ListItem item={item} />
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
