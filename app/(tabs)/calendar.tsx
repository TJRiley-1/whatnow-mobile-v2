import { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { useTasks } from "@/hooks/useTasks";
import type { Task } from "@/types";

const TYPE_COLORS: Record<string, string> = {
  chores: "#f59e0b",
  work: "#3b82f6",
  health: "#22c55e",
  admin: "#8b5cf6",
  errand: "#f97316",
  "self-care": "#ec4899",
  creative: "#06b6d4",
  social: "#ef4444",
};

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
}

export default function CalendarScreen() {
  const router = useRouter();
  const { data: tasks = [], isLoading, refetch } = useTasks();
  const [refreshing, setRefreshing] = useState(false);

  const today = new Date();
  const todayStr = toDateString(today);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const monthName = new Date(viewYear, viewMonth).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const cells = useMemo(() => getMonthDays(viewYear, viewMonth), [viewYear, viewMonth]);

  // Map of date string -> tasks with due dates
  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const task of tasks) {
      if (task.due_date) {
        const key = task.due_date.slice(0, 10);
        if (!map[key]) map[key] = [];
        map[key].push(task);
      }
    }
    return map;
  }, [tasks]);

  // Dates in current month that have tasks
  const datesWithTasks = useMemo(() => {
    const set = new Set<number>();
    for (const key of Object.keys(tasksByDate)) {
      const d = new Date(key + "T00:00:00");
      if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
        set.add(d.getDate());
      }
    }
    return set;
  }, [tasksByDate, viewYear, viewMonth]);

  // Filtered tasks for list
  const { upcoming, overdue } = useMemo(() => {
    const tasksWithDue = tasks.filter((t) => t.due_date);

    let filtered: Task[];
    if (selectedDay) {
      filtered = tasksWithDue.filter((t) => t.due_date?.slice(0, 10) === selectedDay);
    } else {
      filtered = tasksWithDue;
    }

    const up: Task[] = [];
    const ov: Task[] = [];
    for (const t of filtered) {
      const dueStr = t.due_date!.slice(0, 10);
      if (dueStr < todayStr) {
        ov.push(t);
      } else {
        up.push(t);
      }
    }

    up.sort((a, b) => a.due_date!.localeCompare(b.due_date!));
    ov.sort((a, b) => a.due_date!.localeCompare(b.due_date!));

    return { upcoming: up, overdue: ov };
  }, [tasks, selectedDay, todayStr]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
    setSelectedDay(null);
  };

  const handleDayPress = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    const dateStr = `${viewYear}-${m}-${d}`;
    setSelectedDay(selectedDay === dateStr ? null : dateStr);
  };

  const renderTaskCard = (task: Task, isOverdue: boolean) => {
    const typeColor = TYPE_COLORS[task.type.toLowerCase()] ?? "#6366f1";
    return (
      <TouchableOpacity
        key={task.id}
        className="bg-bg-card rounded-2xl p-4 mb-3"
        activeOpacity={0.7}
        onPress={() => router.push("/manage-tasks")}
      >
        <View className="flex-row items-center justify-between mb-2">
          <Text
            className="text-text-primary font-semibold text-base flex-1 mr-2"
            numberOfLines={1}
          >
            {task.name}
          </Text>
          <View
            className="rounded-full px-3 py-1"
            style={{ backgroundColor: typeColor + "22" }}
          >
            <Text style={{ color: typeColor, fontSize: 12, fontWeight: "600" }}>
              {task.type}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center">
          <FontAwesome
            name="calendar-o"
            size={12}
            color={isOverdue ? "#ef4444" : "#94a3b8"}
          />
          <Text
            className="ml-2 text-xs"
            style={{ color: isOverdue ? "#ef4444" : "#94a3b8" }}
          >
            {task.due_date ? formatDate(task.due_date.slice(0, 10)) : "No date"}
            {isOverdue ? " (Overdue)" : ""}
          </Text>
          <View className="ml-4 flex-row items-center">
            <FontAwesome name="clock-o" size={12} color="#94a3b8" />
            <Text className="ml-1 text-xs text-text-secondary">
              {task.time}m
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-bg-primary" edges={["top"]}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg-primary" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6366f1"
          />
        }
      >
        {/* Header */}
        <Text className="text-2xl font-bold text-text-primary mb-4 pt-4">
          Calendar
        </Text>

        {/* Month Navigation */}
        <View className="bg-bg-card rounded-2xl p-4 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity onPress={goToPrevMonth} className="p-2">
              <FontAwesome name="chevron-left" size={16} color="#f1f5f9" />
            </TouchableOpacity>
            <Text className="text-text-primary font-bold text-lg">
              {monthName}
            </Text>
            <TouchableOpacity onPress={goToNextMonth} className="p-2">
              <FontAwesome name="chevron-right" size={16} color="#f1f5f9" />
            </TouchableOpacity>
          </View>

          {/* Day of week headers */}
          <View className="flex-row mb-2">
            {DAYS_OF_WEEK.map((d) => (
              <View key={d} className="flex-1 items-center">
                <Text className="text-text-muted text-xs font-semibold">
                  {d}
                </Text>
              </View>
            ))}
          </View>

          {/* Calendar grid */}
          {Array.from({ length: cells.length / 7 }, (_, weekIdx) => (
            <View key={weekIdx} className="flex-row">
              {cells.slice(weekIdx * 7, weekIdx * 7 + 7).map((day, i) => {
                if (day === null) {
                  return <View key={`empty-${weekIdx}-${i}`} className="flex-1 items-center py-2" />;
                }

                const m = String(viewMonth + 1).padStart(2, "0");
                const d = String(day).padStart(2, "0");
                const cellDateStr = `${viewYear}-${m}-${d}`;
                const isToday = cellDateStr === todayStr;
                const isSelected = cellDateStr === selectedDay;
                const hasTasks = datesWithTasks.has(day);

                return (
                  <TouchableOpacity
                    key={`day-${day}`}
                    className="flex-1 items-center py-2"
                    onPress={() => handleDayPress(day)}
                    activeOpacity={0.6}
                  >
                    <View
                      className="w-9 h-9 rounded-full items-center justify-center"
                      style={{
                        backgroundColor: isSelected
                          ? "#6366f1"
                          : isToday
                          ? "#6366f133"
                          : "transparent",
                        borderWidth: isToday && !isSelected ? 1 : 0,
                        borderColor: "#6366f1",
                      }}
                    >
                      <Text
                        style={{
                          color: isSelected
                            ? "#ffffff"
                            : isToday
                            ? "#6366f1"
                            : "#f1f5f9",
                          fontSize: 14,
                          fontWeight: isToday || isSelected ? "700" : "400",
                        }}
                      >
                        {day}
                      </Text>
                    </View>
                    {hasTasks && (
                      <View className="flex-row mt-1 gap-0.5">
                        <View
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: "#6366f1" }}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

          {/* Selected day label */}
          {selectedDay && (
            <TouchableOpacity
              className="mt-3 self-center bg-bg-elevated rounded-full px-4 py-2 flex-row items-center"
              onPress={() => setSelectedDay(null)}
            >
              <Text className="text-text-secondary text-xs mr-2">
                Showing: {formatDate(selectedDay)}
              </Text>
              <FontAwesome name="times" size={12} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Overdue Section */}
        {overdue.length > 0 && (
          <>
            <Text
              className="text-sm font-bold tracking-wider mb-3"
              style={{ color: "#ef4444" }}
            >
              OVERDUE
            </Text>
            {overdue.map((t) => renderTaskCard(t, true))}
          </>
        )}

        {/* Upcoming Section */}
        <Text className="text-sm font-bold text-text-primary tracking-wider mb-3 mt-2">
          UPCOMING TASKS
        </Text>
        {upcoming.length > 0 ? (
          upcoming.map((t) => renderTaskCard(t, false))
        ) : overdue.length === 0 ? (
          <View className="bg-bg-card rounded-2xl p-4 mb-6">
            <View className="items-center py-4">
              <FontAwesome
                name="calendar-check-o"
                size={40}
                color="#64748b"
                style={{ marginBottom: 12 }}
              />
              <Text className="text-text-secondary text-center">
                No upcoming tasks with due dates
              </Text>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
