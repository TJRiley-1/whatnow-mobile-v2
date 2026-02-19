import React, { useState, useMemo, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  Alert,
  ScrollView,
  Animated,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useTasks, useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import { calculatePoints } from "@/lib/ranks";
import type { Task, SocialLevel, EnergyLevel } from "@/types";

// ---------- constants ----------

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
const DEFAULT_TYPE_COLOR = "#6366f1";

const FILTER_TABS = [
  "All",
  "Chores",
  "Work",
  "Health",
  "Admin",
  "Errand",
  "Self-care",
  "Creative",
  "Social",
];

type SortOption = "newest" | "oldest" | "most_skipped" | "name_az";
const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: "newest", label: "Newest first" },
  { key: "oldest", label: "Oldest first" },
  { key: "most_skipped", label: "Most skipped" },
  { key: "name_az", label: "Name A-Z" },
];

const TIME_OPTIONS = [5, 15, 30, 60];
const LEVEL_OPTIONS: ("low" | "medium" | "high")[] = ["low", "medium", "high"];
const RECURRING_OPTIONS = [
  { value: null as string | null, label: "None" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const THEME = {
  bgPrimary: "#0a0e1a",
  bgCard: "#1a1f3d",
  bgElevated: "#232850",
  primary: "#6366f1",
  textPrimary: "#f1f5f9",
  textSecondary: "#94a3b8",
  borderSubtle: "#2a2f52",
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = -80;

// ---------- helpers ----------

function typeColor(type: string): string {
  return TYPE_COLORS[type.toLowerCase()] ?? DEFAULT_TYPE_COLOR;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ---------- swipeable task card ----------

function SwipeableTaskCard({
  task,
  onPress,
  onDelete,
  onStart,
}: {
  task: Task;
  onPress: () => void;
  onDelete: () => void;
  onStart: () => void;
}) {
  const translateX = useRef(new Animated.Value(0)).current;
  const panStartX = useRef(0);
  const currentOffset = useRef(0);
  const isSwiping = useRef(false);

  const points = calculatePoints(task.time, task.social, task.energy);
  const color = typeColor(task.type);

  const onTouchStart = (e: any) => {
    panStartX.current = e.nativeEvent.pageX;
    isSwiping.current = false;
  };

  const onTouchMove = (e: any) => {
    const dx = e.nativeEvent.pageX - panStartX.current;
    // Only start swiping after a 10px horizontal threshold
    if (!isSwiping.current && Math.abs(dx) < 10) return;
    isSwiping.current = true;
    const next = Math.max(Math.min(currentOffset.current + dx, 0), -120);
    translateX.setValue(next);
  };

  const onTouchEnd = (e: any) => {
    if (!isSwiping.current) return;
    const dx = e.nativeEvent.pageX - panStartX.current;
    const final = currentOffset.current + dx;

    if (final < SWIPE_THRESHOLD) {
      Animated.spring(translateX, {
        toValue: -100,
        useNativeDriver: true,
      }).start();
      currentOffset.current = -100;
    } else {
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
      currentOffset.current = 0;
    }
  };

  const resetSwipe = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    currentOffset.current = 0;
  };

  return (
    <View className="mx-4 mb-3 overflow-hidden rounded-xl">
      {/* Delete button behind the card */}
      <View
        className="absolute top-0 bottom-0 right-0 w-[100px] items-center justify-center rounded-r-xl"
        style={{ backgroundColor: "#ef4444" }}
      >
        <TouchableOpacity
          onPress={() => {
            resetSwipe();
            onDelete();
          }}
          className="items-center justify-center flex-1 w-full"
        >
          <FontAwesome name="trash" size={22} color="#ffffff" />
          <Text style={{ color: "#ffffff", fontSize: 12, marginTop: 4 }}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>

      {/* Card (animated) */}
      <Animated.View
        style={{ transform: [{ translateX }] }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            if (currentOffset.current < -20) {
              resetSwipe();
              return;
            }
            onPress();
          }}
          onLongPress={onDelete}
          className="p-4 rounded-xl"
          style={{ backgroundColor: THEME.bgCard }}
        >
          {/* Top row: name + badge */}
          <View className="flex-row items-center justify-between mb-2">
            <Text
              className="flex-1 mr-2 text-base font-semibold"
              style={{ color: THEME.textPrimary }}
              numberOfLines={1}
            >
              {task.name}
            </Text>
            <View
              className="px-2 py-0.5 rounded-full"
              style={{ backgroundColor: color + "22" }}
            >
              <Text style={{ color, fontSize: 11, fontWeight: "600" }}>
                {capitalize(task.type)}
              </Text>
            </View>
          </View>

          {/* Indicators row */}
          <View className="flex-row flex-wrap items-center gap-3 mb-2">
            <View className="flex-row items-center">
              <FontAwesome
                name="clock-o"
                size={12}
                color={THEME.textSecondary}
              />
              <Text
                style={{
                  color: THEME.textSecondary,
                  fontSize: 12,
                  marginLeft: 4,
                }}
              >
                {task.time}m
              </Text>
            </View>
            <View className="flex-row items-center">
              <FontAwesome
                name="bolt"
                size={12}
                color={THEME.textSecondary}
              />
              <Text
                style={{
                  color: THEME.textSecondary,
                  fontSize: 12,
                  marginLeft: 4,
                }}
              >
                {capitalize(task.energy)}
              </Text>
            </View>
            <View className="flex-row items-center">
              <FontAwesome
                name="users"
                size={12}
                color={THEME.textSecondary}
              />
              <Text
                style={{
                  color: THEME.textSecondary,
                  fontSize: 12,
                  marginLeft: 4,
                }}
              >
                {capitalize(task.social)}
              </Text>
            </View>
            <View className="flex-row items-center">
              <FontAwesome
                name="star"
                size={12}
                color="#f59e0b"
              />
              <Text
                style={{
                  color: "#f59e0b",
                  fontSize: 12,
                  fontWeight: "600",
                  marginLeft: 4,
                }}
              >
                {points} pts
              </Text>
            </View>
          </View>

          {/* Due date + recurring */}
          {(task.due_date || task.recurring) && (
            <View className="flex-row items-center gap-3 mb-2">
              {task.due_date && (
                <View className="flex-row items-center">
                  <FontAwesome
                    name="calendar"
                    size={11}
                    color={THEME.textSecondary}
                  />
                  <Text
                    style={{
                      color: THEME.textSecondary,
                      fontSize: 12,
                      marginLeft: 4,
                    }}
                  >
                    {formatDate(task.due_date)}
                  </Text>
                </View>
              )}
              {task.recurring && (
                <View className="flex-row items-center">
                  <FontAwesome
                    name="repeat"
                    size={11}
                    color={THEME.primary}
                  />
                  <Text
                    style={{
                      color: THEME.primary,
                      fontSize: 12,
                      marginLeft: 4,
                    }}
                  >
                    {capitalize(task.recurring)}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Stats row */}
          <View
            className="flex-row items-center justify-between pt-2 mt-1"
            style={{ borderTopWidth: 1, borderTopColor: THEME.borderSubtle }}
          >
            <View className="flex-row items-center gap-4">
              <Text style={{ color: THEME.textSecondary, fontSize: 11 }}>
                <Text style={{ fontWeight: "600" }}>{task.times_shown}</Text>{" "}
                shown
              </Text>
              <Text style={{ color: THEME.textSecondary, fontSize: 11 }}>
                <Text style={{ fontWeight: "600" }}>{task.times_skipped}</Text>{" "}
                skipped
              </Text>
              <Text style={{ color: THEME.textSecondary, fontSize: 11 }}>
                <Text style={{ fontWeight: "600" }}>{task.times_completed}</Text>{" "}
                done
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <TouchableOpacity
                onPress={onStart}
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: "#22c55e22" }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <FontAwesome name="play" size={12} color="#22c55e" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onDelete}
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: "#ef444422" }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <FontAwesome name="trash" size={12} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// ---------- edit modal ----------

function EditTaskModal({
  task,
  visible,
  onClose,
  onSave,
  saving,
}: {
  task: Task | null;
  visible: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Task>) => void;
  saving: boolean;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("chores");
  const [time, setTime] = useState(15);
  const [energy, setEnergy] = useState<EnergyLevel>("medium");
  const [social, setSocial] = useState<SocialLevel>("low");
  const [dueDate, setDueDate] = useState("");
  const [recurring, setRecurring] = useState<string | null>(null);

  // Sync local state when task changes
  React.useEffect(() => {
    if (task) {
      setName(task.name);
      setDescription(task.description ?? "");
      setType(task.type);
      setTime(task.time);
      setEnergy(task.energy);
      setSocial(task.social);
      setDueDate(task.due_date ?? "");
      setRecurring(task.recurring);
    }
  }, [task]);

  if (!task) return null;

  const typeOptions = [
    "Chores",
    "Work",
    "Health",
    "Admin",
    "Errand",
    "Self-care",
    "Creative",
    "Social",
  ];

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Task name is required.");
      return;
    }
    onSave({
      name: name.trim(),
      description: description.trim() || null,
      type,
      time,
      energy,
      social,
      due_date: dueDate.trim() || null,
      recurring,
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View
            className="rounded-t-3xl px-5 pt-5 pb-8"
            style={{ backgroundColor: THEME.bgElevated, maxHeight: "90%" }}
          >
            {/* Modal header */}
            <View className="flex-row items-center justify-between mb-5">
              <Text
                style={{
                  color: THEME.textPrimary,
                  fontSize: 18,
                  fontWeight: "700",
                }}
              >
                Edit Task
              </Text>
              <TouchableOpacity onPress={onClose}>
                <FontAwesome name="times" size={22} color={THEME.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Name */}
              <Text
                style={{
                  color: THEME.textSecondary,
                  fontSize: 13,
                  marginBottom: 4,
                }}
              >
                Name
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholderTextColor={THEME.textSecondary}
                className="rounded-lg px-3 py-2.5 mb-4"
                style={{
                  backgroundColor: THEME.bgCard,
                  color: THEME.textPrimary,
                  fontSize: 15,
                  borderWidth: 1,
                  borderColor: THEME.borderSubtle,
                }}
              />

              {/* Description */}
              <Text
                style={{
                  color: THEME.textSecondary,
                  fontSize: 13,
                  marginBottom: 4,
                }}
              >
                Description
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Optional description..."
                placeholderTextColor={THEME.textSecondary}
                multiline
                numberOfLines={3}
                className="rounded-lg px-3 py-2.5 mb-4"
                style={{
                  backgroundColor: THEME.bgCard,
                  color: THEME.textPrimary,
                  fontSize: 15,
                  borderWidth: 1,
                  borderColor: THEME.borderSubtle,
                  minHeight: 60,
                  textAlignVertical: "top",
                }}
              />

              {/* Type */}
              <Text
                style={{
                  color: THEME.textSecondary,
                  fontSize: 13,
                  marginBottom: 6,
                }}
              >
                Type
              </Text>
              <View className="flex-row flex-wrap gap-2 mb-4">
                {typeOptions.map((t) => {
                  const selected = type === t;
                  const c = typeColor(t);
                  return (
                    <TouchableOpacity
                      key={t}
                      onPress={() => setType(t)}
                      className="px-3 py-1.5 rounded-full"
                      style={{
                        backgroundColor: selected ? c + "33" : THEME.bgCard,
                        borderWidth: 1,
                        borderColor: selected ? c : THEME.borderSubtle,
                      }}
                    >
                      <Text
                        style={{
                          color: selected ? c : THEME.textSecondary,
                          fontSize: 13,
                          fontWeight: selected ? "600" : "400",
                        }}
                      >
                        {capitalize(t)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Time */}
              <Text
                style={{
                  color: THEME.textSecondary,
                  fontSize: 13,
                  marginBottom: 6,
                }}
              >
                Time estimate
              </Text>
              <View className="flex-row gap-2 mb-4">
                {TIME_OPTIONS.map((t) => {
                  const selected = time === t;
                  return (
                    <TouchableOpacity
                      key={t}
                      onPress={() => setTime(t)}
                      className="flex-1 items-center py-2 rounded-lg"
                      style={{
                        backgroundColor: selected
                          ? THEME.primary + "33"
                          : THEME.bgCard,
                        borderWidth: 1,
                        borderColor: selected
                          ? THEME.primary
                          : THEME.borderSubtle,
                      }}
                    >
                      <Text
                        style={{
                          color: selected
                            ? THEME.primary
                            : THEME.textSecondary,
                          fontSize: 13,
                          fontWeight: selected ? "600" : "400",
                        }}
                      >
                        {t}m
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Energy */}
              <Text
                style={{
                  color: THEME.textSecondary,
                  fontSize: 13,
                  marginBottom: 6,
                }}
              >
                Energy level
              </Text>
              <View className="flex-row gap-2 mb-4">
                {LEVEL_OPTIONS.map((l) => {
                  const selected = energy === l;
                  return (
                    <TouchableOpacity
                      key={l}
                      onPress={() => setEnergy(l)}
                      className="flex-1 items-center py-2 rounded-lg"
                      style={{
                        backgroundColor: selected
                          ? THEME.primary + "33"
                          : THEME.bgCard,
                        borderWidth: 1,
                        borderColor: selected
                          ? THEME.primary
                          : THEME.borderSubtle,
                      }}
                    >
                      <Text
                        style={{
                          color: selected
                            ? THEME.primary
                            : THEME.textSecondary,
                          fontSize: 13,
                          fontWeight: selected ? "600" : "400",
                        }}
                      >
                        {capitalize(l)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Social */}
              <Text
                style={{
                  color: THEME.textSecondary,
                  fontSize: 13,
                  marginBottom: 6,
                }}
              >
                Social level
              </Text>
              <View className="flex-row gap-2 mb-4">
                {LEVEL_OPTIONS.map((l) => {
                  const selected = social === l;
                  return (
                    <TouchableOpacity
                      key={l}
                      onPress={() => setSocial(l)}
                      className="flex-1 items-center py-2 rounded-lg"
                      style={{
                        backgroundColor: selected
                          ? THEME.primary + "33"
                          : THEME.bgCard,
                        borderWidth: 1,
                        borderColor: selected
                          ? THEME.primary
                          : THEME.borderSubtle,
                      }}
                    >
                      <Text
                        style={{
                          color: selected
                            ? THEME.primary
                            : THEME.textSecondary,
                          fontSize: 13,
                          fontWeight: selected ? "600" : "400",
                        }}
                      >
                        {capitalize(l)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Due date */}
              <Text
                style={{
                  color: THEME.textSecondary,
                  fontSize: 13,
                  marginBottom: 4,
                }}
              >
                Due date (YYYY-MM-DD)
              </Text>
              <TextInput
                value={dueDate}
                onChangeText={setDueDate}
                placeholder="e.g. 2026-03-01"
                placeholderTextColor={THEME.textSecondary}
                className="rounded-lg px-3 py-2.5 mb-4"
                style={{
                  backgroundColor: THEME.bgCard,
                  color: THEME.textPrimary,
                  fontSize: 15,
                  borderWidth: 1,
                  borderColor: THEME.borderSubtle,
                }}
              />

              {/* Recurring */}
              <Text
                style={{
                  color: THEME.textSecondary,
                  fontSize: 13,
                  marginBottom: 6,
                }}
              >
                Recurring
              </Text>
              <View className="flex-row gap-2 mb-6">
                {RECURRING_OPTIONS.map((r) => {
                  const selected = recurring === r.value;
                  return (
                    <TouchableOpacity
                      key={r.label}
                      onPress={() => setRecurring(r.value)}
                      className="flex-1 items-center py-2 rounded-lg"
                      style={{
                        backgroundColor: selected
                          ? THEME.primary + "33"
                          : THEME.bgCard,
                        borderWidth: 1,
                        borderColor: selected
                          ? THEME.primary
                          : THEME.borderSubtle,
                      }}
                    >
                      <Text
                        style={{
                          color: selected
                            ? THEME.primary
                            : THEME.textSecondary,
                          fontSize: 13,
                          fontWeight: selected ? "600" : "400",
                        }}
                      >
                        {r.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Buttons */}
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={onClose}
                  className="flex-1 items-center py-3 rounded-xl"
                  style={{
                    backgroundColor: THEME.bgCard,
                    borderWidth: 1,
                    borderColor: THEME.borderSubtle,
                  }}
                >
                  <Text
                    style={{
                      color: THEME.textSecondary,
                      fontWeight: "600",
                      fontSize: 16,
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSave}
                  disabled={saving}
                  className="flex-1 items-center py-3 rounded-xl"
                  style={{
                    backgroundColor: saving
                      ? THEME.primary + "66"
                      : THEME.primary,
                  }}
                >
                  <Text
                    style={{
                      color: "#ffffff",
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    {saving ? "Saving..." : "Save"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Extra bottom space */}
              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

// ---------- main screen ----------

export default function ManageTasksScreen() {
  const router = useRouter();
  const { data: tasks = [], isLoading, refetch } = useTasks();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [showSort, setShowSort] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // ---- derived list ----
  const filteredTasks = useMemo(() => {
    let list = [...tasks];

    // type filter
    if (activeFilter !== "All") {
      const filterKey = activeFilter.toLowerCase();
      list = list.filter((t) => t.type.toLowerCase() === filterKey);
    }

    // search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((t) => t.name.toLowerCase().includes(q));
    }

    // sort
    switch (sort) {
      case "newest":
        list.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "oldest":
        list.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "most_skipped":
        list.sort((a, b) => b.times_skipped - a.times_skipped);
        break;
      case "name_az":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return list;
  }, [tasks, activeFilter, search, sort]);

  // ---- actions ----
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const confirmDelete = useCallback(
    (task: Task) => {
      Alert.alert(
        "Delete Task",
        `Are you sure you want to delete "${task.name}"?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => deleteTask.mutate(task.id),
          },
        ]
      );
    },
    [deleteTask]
  );

  const handleSaveEdit = useCallback(
    (updates: Partial<Task>) => {
      if (!editingTask) return;
      updateTask.mutate(
        { id: editingTask.id, updates },
        {
          onSuccess: () => setEditingTask(null),
        }
      );
    },
    [editingTask, updateTask]
  );

  // ---- render helpers ----
  const handleStart = useCallback(
    (task: Task) => {
      const points = calculatePoints(task.time, task.social, task.energy);
      router.push({
        pathname: "/timer",
        params: {
          taskId: task.id,
          taskName: task.name,
          taskTime: task.time,
          points,
        },
      });
    },
    [router]
  );

  const renderTask = useCallback(
    ({ item }: { item: Task }) => (
      <SwipeableTaskCard
        task={item}
        onPress={() => setEditingTask(item)}
        onDelete={() => confirmDelete(item)}
        onStart={() => handleStart(item)}
      />
    ),
    [confirmDelete, handleStart]
  );

  const keyExtractor = useCallback((item: Task) => item.id, []);

  const emptyComponent = useMemo(
    () => (
      <View className="flex-1 items-center justify-center px-10 pt-20">
        <FontAwesome name="clipboard" size={48} color={THEME.textSecondary} />
        <Text
          style={{
            color: THEME.textSecondary,
            fontSize: 16,
            textAlign: "center",
            marginTop: 16,
            lineHeight: 24,
          }}
        >
          {search || activeFilter !== "All"
            ? "No tasks match your filters."
            : "No tasks yet! Tap + to add your first task."}
        </Text>
        {!search && activeFilter === "All" && (
          <TouchableOpacity
            onPress={() => router.push("/add-task")}
            className="mt-6 px-6 py-3 rounded-xl"
            style={{ backgroundColor: THEME.primary }}
          >
            <Text style={{ color: "#ffffff", fontWeight: "bold", fontSize: 16 }}>
              Add Task
            </Text>
          </TouchableOpacity>
        )}
      </View>
    ),
    [search, activeFilter, router]
  );

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: THEME.bgPrimary }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <FontAwesome name="arrow-left" size={20} color={THEME.textPrimary} />
          </TouchableOpacity>
          <Text
            style={{
              color: THEME.textPrimary,
              fontSize: 20,
              fontWeight: "700",
            }}
          >
            Manage Tasks
          </Text>
        </View>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={() => setShowSort((v) => !v)}
            className="flex-row items-center px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: THEME.bgCard }}
          >
            <FontAwesome name="sort-amount-desc" size={14} color={THEME.textSecondary} />
            <Text style={{ color: THEME.textSecondary, fontSize: 13, fontWeight: "600", marginLeft: 6 }}>
              Sort
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/add-task")}
            className="flex-row items-center px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: THEME.primary }}
          >
            <FontAwesome name="plus" size={14} color="#ffffff" />
            <Text style={{ color: "#ffffff", fontSize: 13, fontWeight: "600", marginLeft: 6 }}>
              Add
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sort dropdown */}
      {showSort && (
        <View
          className="mx-4 mb-2 rounded-xl overflow-hidden"
          style={{
            backgroundColor: THEME.bgElevated,
            borderWidth: 1,
            borderColor: THEME.borderSubtle,
          }}
        >
          {SORT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              onPress={() => {
                setSort(opt.key);
                setShowSort(false);
              }}
              className="px-4 py-3 flex-row items-center justify-between"
              style={{
                borderBottomWidth: 1,
                borderBottomColor: THEME.borderSubtle,
              }}
            >
              <Text
                style={{
                  color:
                    sort === opt.key ? THEME.primary : THEME.textPrimary,
                  fontSize: 14,
                  fontWeight: sort === opt.key ? "600" : "400",
                }}
              >
                {opt.label}
              </Text>
              {sort === opt.key && (
                <FontAwesome name="check" size={14} color={THEME.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Filter tabs */}
      <View style={{ height: 44 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4"
          contentContainerStyle={{ gap: 8, alignItems: "center", height: 44 }}
        >
          {FILTER_TABS.map((tab) => {
            const active = activeFilter === tab;
            const tabColor =
              tab === "All"
                ? THEME.primary
                : typeColor(tab.toLowerCase());
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveFilter(tab)}
                className="px-4 rounded-full items-center justify-center"
                style={{
                  height: 32,
                  backgroundColor: active ? tabColor + "33" : THEME.bgCard,
                  borderWidth: 1,
                  borderColor: active ? tabColor : THEME.borderSubtle,
                }}
              >
                <Text
                  style={{
                    color: active ? tabColor : THEME.textSecondary,
                    fontSize: 13,
                    fontWeight: active ? "600" : "400",
                  }}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Search bar */}
      <View className="mx-4 my-2">
        <View
          className="flex-row items-center rounded-xl px-3"
          style={{
            backgroundColor: THEME.bgCard,
            borderWidth: 1,
            borderColor: THEME.borderSubtle,
          }}
        >
          <FontAwesome name="search" size={14} color={THEME.textSecondary} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search tasks..."
            placeholderTextColor={THEME.textSecondary}
            className="flex-1 ml-2 py-2.5"
            style={{ color: THEME.textPrimary, fontSize: 15 }}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <FontAwesome
                name="times-circle"
                size={16}
                color={THEME.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Task count */}
      <View className="px-5 pb-1">
        <Text style={{ color: THEME.textSecondary, fontSize: 12 }}>
          {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Task list */}
      <FlatList
        data={filteredTasks}
        keyExtractor={keyExtractor}
        renderItem={renderTask}
        ListEmptyComponent={isLoading ? null : emptyComponent}
        contentContainerStyle={{ paddingTop: 4, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={THEME.primary}
            colors={[THEME.primary]}
          />
        }
      />

      {/* Edit modal */}
      <EditTaskModal
        task={editingTask}
        visible={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveEdit}
        saving={updateTask.isPending}
      />
    </SafeAreaView>
  );
}
