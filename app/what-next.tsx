import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useTasks, useUpdateTask } from "@/hooks/useTasks";
import { calculatePoints } from "@/lib/ranks";
import type { Task, SocialLevel, EnergyLevel } from "@/types";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

const LEVEL_ORDER: Record<string, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

const TIME_OPTIONS = [5, 15, 30, 60] as const;
const LEVEL_OPTIONS: Array<"low" | "medium" | "high"> = [
  "low",
  "medium",
  "high",
];

const LEVEL_LABELS: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const TYPE_COLORS: Record<string, string> = {
  health: "#22c55e",
  work: "#6366f1",
  personal: "#f59e0b",
  social: "#ec4899",
  home: "#06b6d4",
  finance: "#8b5cf6",
  learning: "#3b82f6",
  creative: "#f97316",
};

const FALLBACK_SUGGESTIONS = [
  "Take a 5-minute walk",
  "Do some stretches",
  "Drink a glass of water",
  "Tidy one surface",
  "Write 3 things you're grateful for",
  "Take 10 deep breaths",
  "Listen to one song",
  "Sort through 5 emails",
  "Water a plant",
  "Wipe down a counter",
  "Set a 2-minute timer and just start",
  "Text someone you appreciate",
];

// ─── Phase 1: State Selection ───────────────────────────────────────────────

function StateSelection({
  onSubmit,
  onBack,
}: {
  onSubmit: (time: number | null, energy: EnergyLevel | null, social: SocialLevel | null) => void;
  onBack: () => void;
}) {
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyLevel | null>(
    null
  );
  const [selectedSocial, setSelectedSocial] = useState<SocialLevel | null>(
    null
  );

  const canSubmit =
    selectedTime !== null || selectedEnergy !== null || selectedSocial !== null;

  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      <View className="flex-row items-center px-5 pt-4 pb-2">
        <TouchableOpacity onPress={onBack} className="mr-4">
          <FontAwesome name="arrow-left" size={20} color="#f1f5f9" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-text-primary">What Next?</Text>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Time Selection */}
        <View className="mt-6">
          <View className="flex-row items-center mb-3">
            <FontAwesome name="clock-o" size={18} color="#818cf8" />
            <Text className="text-text-primary text-base font-semibold ml-2">
              How much time do you have?
            </Text>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {TIME_OPTIONS.map((time) => (
              <TouchableOpacity
                key={time}
                onPress={() => setSelectedTime(prev => prev === time ? null : time)}
                className={`flex-1 min-w-[70px] items-center py-3 rounded-xl ${
                  selectedTime === time ? "bg-primary" : "bg-bg-card"
                }`}
              >
                <Text
                  style={{
                    color: selectedTime === time ? "#ffffff" : "#94a3b8",
                    fontWeight: selectedTime === time ? "bold" : "600",
                    fontSize: 15,
                  }}
                >
                  {time} min
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Energy Selection */}
        <View className="mt-6">
          <View className="flex-row items-center mb-3">
            <FontAwesome name="bolt" size={18} color="#f59e0b" />
            <Text className="text-text-primary text-base font-semibold ml-2">
              What's your energy level?
            </Text>
          </View>
          <View className="flex-row gap-2">
            {LEVEL_OPTIONS.map((level) => (
              <TouchableOpacity
                key={level}
                onPress={() => setSelectedEnergy(prev => prev === level ? null : level)}
                className={`flex-1 items-center py-3 rounded-xl ${
                  selectedEnergy === level ? "bg-primary" : "bg-bg-card"
                }`}
              >
                <Text
                  style={{
                    color: selectedEnergy === level ? "#ffffff" : "#94a3b8",
                    fontWeight: selectedEnergy === level ? "bold" : "600",
                    fontSize: 15,
                  }}
                >
                  {LEVEL_LABELS[level]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Social Selection */}
        <View className="mt-6">
          <View className="flex-row items-center mb-3">
            <FontAwesome name="users" size={16} color="#22c55e" />
            <Text className="text-text-primary text-base font-semibold ml-2">
              What's your social battery?
            </Text>
          </View>
          <View className="flex-row gap-2">
            {LEVEL_OPTIONS.map((level) => (
              <TouchableOpacity
                key={level}
                onPress={() => setSelectedSocial(prev => prev === level ? null : level)}
                className={`flex-1 items-center py-3 rounded-xl ${
                  selectedSocial === level ? "bg-primary" : "bg-bg-card"
                }`}
              >
                <Text
                  style={{
                    color: selectedSocial === level ? "#ffffff" : "#94a3b8",
                    fontWeight: selectedSocial === level ? "bold" : "600",
                    fontSize: 15,
                  }}
                >
                  {LEVEL_LABELS[level]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Find Tasks Button */}
        <TouchableOpacity
          onPress={() => {
            if (canSubmit) {
              onSubmit(selectedTime, selectedEnergy, selectedSocial);
            }
          }}
          className={`mt-8 mb-6 py-4 rounded-xl items-center ${
            canSubmit ? "bg-primary" : "bg-bg-card"
          }`}
          disabled={!canSubmit}
        >
          <View className="flex-row items-center">
            <FontAwesome
              name="search"
              size={16}
              color={canSubmit ? "#ffffff" : "#64748b"}
            />
            <Text
              style={{
                color: canSubmit ? "#ffffff" : "#64748b",
                fontWeight: "bold",
                fontSize: 18,
                marginLeft: 8,
              }}
            >
              Find Tasks
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Swipe Card Component ───────────────────────────────────────────────────

function SwipeCard({
  task,
  onSwipeLeft,
  onSwipeRight,
  isTop,
}: {
  task: Task;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isTop: boolean;
}) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);

  const points = calculatePoints(task.time, task.social, task.energy);
  const typeColor = TYPE_COLORS[task.type.toLowerCase()] ?? "#6366f1";

  const gesture = Gesture.Pan()
    .enabled(isTop)
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.3;
      rotation.value = (event.translationX / SCREEN_WIDTH) * 15;
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        // Swipe right - accept
        translateX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 });
        runOnJS(onSwipeRight)();
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        // Swipe left - skip
        translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 });
        runOnJS(onSwipeLeft)();
      } else {
        // Snap back
        translateX.value = withSpring(0, { damping: 15 });
        translateY.value = withSpring(0, { damping: 15 });
        rotation.value = withSpring(0, { damping: 15 });
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const acceptOverlayStyle = useAnimatedStyle(() => ({
    opacity: Math.min(Math.max(translateX.value / SWIPE_THRESHOLD, 0), 0.6),
  }));

  const skipOverlayStyle = useAnimatedStyle(() => ({
    opacity: Math.min(Math.max(-translateX.value / SWIPE_THRESHOLD, 0), 0.6),
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          cardStyle,
          {
            position: "absolute",
            width: "100%",
            zIndex: isTop ? 10 : 5,
          },
        ]}
      >
        <View className="bg-bg-card rounded-2xl p-6 mx-2 overflow-hidden">
          {/* Accept overlay (green tint) */}
          <Animated.View
            style={[
              acceptOverlayStyle,
              {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "#22c55e",
                borderRadius: 16,
              },
            ]}
            pointerEvents="none"
          />
          {/* Skip overlay (red tint) */}
          <Animated.View
            style={[
              skipOverlayStyle,
              {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "#ef4444",
                borderRadius: 16,
              },
            ]}
            pointerEvents="none"
          />

          {/* Card content */}
          <View className="relative z-10">
            {/* Type badge */}
            <View className="flex-row items-center mb-3">
              <View
                style={{ backgroundColor: typeColor }}
                className="px-3 py-1 rounded-full"
              >
                <Text
                  style={{
                    color: "#ffffff",
                    fontWeight: "bold",
                    fontSize: 12,
                    textTransform: "capitalize",
                  }}
                >
                  {task.type}
                </Text>
              </View>
            </View>

            {/* Task name */}
            <Text className="text-text-primary text-2xl font-bold mb-4">
              {task.name}
            </Text>

            {/* Task description */}
            {task.description ? (
              <Text className="text-text-secondary text-sm mb-4" numberOfLines={2}>
                {task.description}
              </Text>
            ) : null}

            {/* Info row */}
            <View className="flex-row items-center flex-wrap gap-3 mb-4">
              {/* Time */}
              <View className="flex-row items-center bg-bg-elevated px-3 py-2 rounded-lg">
                <FontAwesome name="clock-o" size={14} color="#818cf8" />
                <Text className="text-text-secondary text-sm ml-1.5">
                  {task.time} min
                </Text>
              </View>

              {/* Energy */}
              <View className="flex-row items-center bg-bg-elevated px-3 py-2 rounded-lg">
                <FontAwesome name="bolt" size={14} color="#f59e0b" />
                <Text className="text-text-secondary text-sm ml-1.5">
                  {LEVEL_LABELS[task.energy]}
                </Text>
              </View>

              {/* Social */}
              <View className="flex-row items-center bg-bg-elevated px-3 py-2 rounded-lg">
                <FontAwesome name="users" size={12} color="#22c55e" />
                <Text className="text-text-secondary text-sm ml-1.5">
                  {LEVEL_LABELS[task.social]}
                </Text>
              </View>
            </View>

            {/* Points */}
            <View className="flex-row items-center">
              <FontAwesome name="star" size={16} color="#f59e0b" />
              <Text className="text-accent text-base font-bold ml-1.5">
                {points} pts
              </Text>
            </View>

            {/* Swipe hints */}
            <View className="flex-row justify-between mt-5 pt-4 border-t border-bg-elevated">
              <View className="flex-row items-center">
                <FontAwesome name="arrow-left" size={12} color="#ef4444" />
                <Text className="text-danger text-xs ml-1.5">Skip</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-success text-xs mr-1.5">Accept</Text>
                <FontAwesome name="arrow-right" size={12} color="#22c55e" />
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

// ─── Phase 2: Swipe Interface ───────────────────────────────────────────────

function SwipeInterface({
  tasks,
  onBack,
}: {
  tasks: Task[];
  onBack: () => void;
}) {
  const router = useRouter();
  const updateTask = useUpdateTask();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shownIds, setShownIds] = useState<Set<string>>(new Set());

  const currentTask = currentIndex < tasks.length ? tasks[currentIndex] : null;
  const nextTask =
    currentIndex + 1 < tasks.length ? tasks[currentIndex + 1] : null;

  // Mark task as shown when it becomes the current card
  useEffect(() => {
    if (currentTask && !shownIds.has(currentTask.id)) {
      setShownIds((prev) => new Set(prev).add(currentTask.id));
      updateTask.mutate({
        id: currentTask.id,
        updates: { times_shown: currentTask.times_shown + 1 },
      });
    }
  }, [currentTask?.id]);

  const handleSkip = useCallback(() => {
    if (!currentTask) return;
    updateTask.mutate({
      id: currentTask.id,
      updates: {
        times_skipped: currentTask.times_skipped + 1,
      },
    });
    // Small delay to let the animation finish before switching
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 350);
  }, [currentTask, updateTask]);

  const handleAccept = useCallback(() => {
    if (!currentTask) return;
    const points = calculatePoints(
      currentTask.time,
      currentTask.social,
      currentTask.energy
    );
    // Small delay to let the animation finish
    setTimeout(() => {
      router.push({
        pathname: "/timer",
        params: {
          taskId: currentTask.id,
          taskName: currentTask.name,
          taskTime: currentTask.time,
          points,
        },
      });
    }, 350);
  }, [currentTask, router]);

  // No more tasks - show fallback
  if (!currentTask) {
    return (
      <FallbackSuggestions
        onBack={onBack}
        taskCount={tasks.length}
      />
    );
  }

  const points = calculatePoints(
    currentTask.time,
    currentTask.social,
    currentTask.energy
  );

  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={onBack} className="mr-4">
            <FontAwesome name="arrow-left" size={20} color="#f1f5f9" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-text-primary">
            What Next?
          </Text>
        </View>
        <Text className="text-text-secondary text-sm">
          {currentIndex + 1} / {tasks.length}
        </Text>
      </View>

      {/* Card stack */}
      <View className="flex-1 justify-center px-3">
        <View style={{ height: 380 }}>
          {/* Background card (next) */}
          {nextTask && (
            <View
              style={{
                position: "absolute",
                width: "100%",
                zIndex: 5,
                transform: [{ scale: 0.95 }],
                opacity: 0.5,
              }}
            >
              <View className="bg-bg-card rounded-2xl p-6 mx-2">
                <View className="flex-row items-center mb-3">
                  <View
                    style={{
                      backgroundColor:
                        TYPE_COLORS[nextTask.type.toLowerCase()] ?? "#6366f1",
                    }}
                    className="px-3 py-1 rounded-full"
                  >
                    <Text
                      style={{
                        color: "#ffffff",
                        fontWeight: "bold",
                        fontSize: 12,
                        textTransform: "capitalize",
                      }}
                    >
                      {nextTask.type}
                    </Text>
                  </View>
                </View>
                <Text className="text-text-primary text-2xl font-bold">
                  {nextTask.name}
                </Text>
              </View>
            </View>
          )}

          {/* Top card (current) */}
          <SwipeCard
            key={currentTask.id}
            task={currentTask}
            onSwipeLeft={handleSkip}
            onSwipeRight={handleAccept}
            isTop={true}
          />
        </View>
      </View>

      {/* Action buttons */}
      <View className="flex-row justify-center items-center gap-6 px-5 pb-6">
        {/* Skip button */}
        <TouchableOpacity
          onPress={handleSkip}
          className="w-16 h-16 rounded-full bg-bg-card items-center justify-center border-2"
          style={{ borderColor: "#ef4444" }}
        >
          <FontAwesome name="times" size={28} color="#ef4444" />
        </TouchableOpacity>

        {/* Accept button */}
        <TouchableOpacity
          onPress={handleAccept}
          className="w-20 h-20 rounded-full bg-primary items-center justify-center"
        >
          <FontAwesome name="check" size={32} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Fallback Suggestions ───────────────────────────────────────────────────

function FallbackSuggestions({
  onBack,
  taskCount,
}: {
  onBack: () => void;
  taskCount: number;
}) {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      <View className="flex-row items-center px-5 pt-4 pb-2">
        <TouchableOpacity onPress={onBack} className="mr-4">
          <FontAwesome name="arrow-left" size={20} color="#f1f5f9" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-text-primary">What Next?</Text>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <View className="items-center mt-6 mb-4">
          <FontAwesome name="lightbulb-o" size={40} color="#f59e0b" />
          <Text className="text-text-primary text-lg font-bold mt-3 text-center">
            {taskCount === 0
              ? "No matching tasks found"
              : "You've gone through all matching tasks!"}
          </Text>
          <Text className="text-text-secondary text-sm mt-1 text-center">
            Here are some quick wins to keep your momentum going:
          </Text>
        </View>

        {FALLBACK_SUGGESTIONS.map((suggestion, index) => (
          <View
            key={index}
            className="flex-row items-center bg-bg-card rounded-xl px-4 py-3.5 mb-2"
          >
            <View className="w-7 h-7 rounded-full bg-bg-elevated items-center justify-center mr-3">
              <Text
                style={{
                  color: "#818cf8",
                  fontWeight: "bold",
                  fontSize: 12,
                }}
              >
                {index + 1}
              </Text>
            </View>
            <Text className="text-text-primary text-sm flex-1">
              {suggestion}
            </Text>
            <FontAwesome name="chevron-right" size={10} color="#64748b" />
          </View>
        ))}

        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-primary rounded-xl py-4 items-center mt-4 mb-8"
        >
          <Text
            style={{
              color: "#ffffff",
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            Done
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Main Screen ────────────────────────────────────────────────────────────

export default function WhatNextScreen() {
  const router = useRouter();
  const { data: allTasks, isLoading } = useTasks();

  const [phase, setPhase] = useState<"selection" | "swipe">("selection");
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyLevel | null>(null);
  const [selectedSocial, setSelectedSocial] = useState<SocialLevel | null>(null);

  const filteredTasks = useMemo(() => {
    if (!allTasks) return [];

    const maxEnergy = selectedEnergy ? LEVEL_ORDER[selectedEnergy] : null;
    const maxSocial = selectedSocial ? LEVEL_ORDER[selectedSocial] : null;

    return allTasks
      .filter(
        (task) =>
          (selectedTime === null || task.time <= selectedTime) &&
          (maxEnergy === null || LEVEL_ORDER[task.energy] <= maxEnergy) &&
          (maxSocial === null || LEVEL_ORDER[task.social] <= maxSocial)
      )
      .sort((a, b) => {
        // Most skipped first
        if (b.times_skipped !== a.times_skipped) {
          return b.times_skipped - a.times_skipped;
        }
        // Least shown first
        return a.times_shown - b.times_shown;
      });
  }, [allTasks, selectedTime, selectedEnergy, selectedSocial]);

  const handleSubmit = useCallback(
    (time: number | null, energy: EnergyLevel | null, social: SocialLevel | null) => {
      setSelectedTime(time);
      setSelectedEnergy(energy);
      setSelectedSocial(social);
      setPhase("swipe");
    },
    []
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-bg-primary items-center justify-center">
        <ActivityIndicator size="large" color="#6366f1" />
        <Text className="text-text-secondary mt-4">Loading tasks...</Text>
      </SafeAreaView>
    );
  }

  if (phase === "selection") {
    return (
      <StateSelection
        onSubmit={handleSubmit}
        onBack={() => router.back()}
      />
    );
  }

  return (
    <SwipeInterface
      tasks={filteredTasks}
      onBack={() => setPhase("selection")}
    />
  );
}
