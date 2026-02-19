import { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useTasks, useCompleteTask } from "@/hooks/useTasks";
import Svg, { Circle } from "react-native-svg";

const COLORS = {
  bgPrimary: "#0a0e1a",
  primary: "#6366f1",
  primaryLight: "#818cf8",
  textPrimary: "#f1f5f9",
  textSecondary: "#94a3b8",
  accent: "#f59e0b",
  success: "#22c55e",
  danger: "#ef4444",
  bgCard: "#141828",
};

export default function TimerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    taskId: string;
    taskName: string;
    taskTime: string;
    points: string;
  }>();

  const taskName = params.taskName ?? "Task";
  const taskTime = parseInt(params.taskTime ?? "5"); // minutes
  const points = parseInt(params.points ?? "10");
  const taskId = params.taskId;

  const totalSeconds = taskTime * 60;
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const elapsedBeforePauseRef = useRef<number>(0);

  const { data: tasks } = useTasks();
  const completeTask = useCompleteTask();

  const elapsedSeconds = totalSeconds - remainingSeconds;

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Progress for the ring (0 to 1)
  const progress = totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0;

  // Circular progress ring dimensions
  const ringSize = 260;
  const strokeWidth = 10;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const handleComplete = useCallback(async () => {
    // Stop the timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);

    const actualSecondsElapsed = totalSeconds - remainingSeconds;
    const actualMinutesElapsed = Math.round((actualSecondsElapsed / 60) * 100) / 100;

    const task = tasks?.find((t) => t.id === taskId);
    if (task) {
      try {
        await completeTask.mutateAsync({
          task,
          points,
          timeSpent: actualMinutesElapsed,
        });
      } catch (error) {
        // Still navigate even if mutation fails
        console.error("Failed to complete task:", error);
      }
    }

    router.replace({
      pathname: "/celebration",
      params: {
        taskName,
        points: String(points),
        timeSpent: String(actualMinutesElapsed),
      },
    });
  }, [tasks, taskId, points, taskName, totalSeconds, remainingSeconds, completeTask, router]);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        const elapsedSinceStart = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const totalElapsed = elapsedBeforePauseRef.current + elapsedSinceStart;
        const newRemaining = Math.max(0, totalSeconds - totalElapsed);
        setRemainingSeconds(newRemaining);

        if (newRemaining <= 0) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }, 250);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, totalSeconds]);

  // Auto-complete when timer reaches zero
  useEffect(() => {
    if (remainingSeconds <= 0 && elapsedBeforePauseRef.current + (Date.now() - startTimeRef.current) / 1000 >= totalSeconds - 1) {
      handleComplete();
    }
  }, [remainingSeconds, totalSeconds, handleComplete]);

  const toggleTimer = () => {
    if (isRunning) {
      // Pausing - save elapsed time
      const elapsedSinceStart = Math.floor((Date.now() - startTimeRef.current) / 1000);
      elapsedBeforePauseRef.current += elapsedSinceStart;
      setIsRunning(false);
    } else {
      // Starting/resuming
      setIsRunning(true);
    }
  };

  const handleGiveUp = () => {
    Alert.alert(
      "Give Up?",
      "Are you sure you want to give up on this task? You won't earn any points.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Give Up",
          style: "destructive",
          onPress: () => {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            setIsRunning(false);
            router.back();
          },
        },
      ]
    );
  };

  const handleDoneEarly = () => {
    Alert.alert(
      "Done Early?",
      "Complete this task now and earn your points!",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Complete",
          onPress: () => handleComplete(),
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      <View className="flex-1 items-center justify-center px-6">
        {/* Task Name */}
        <Text
          className="text-xl font-bold text-text-primary text-center mb-2"
          numberOfLines={2}
        >
          {taskName}
        </Text>

        {/* Timer with Progress Ring */}
        <View className="items-center justify-center my-8" style={{ width: ringSize, height: ringSize }}>
          <Svg width={ringSize} height={ringSize} style={{ position: "absolute" }}>
            {/* Background circle */}
            <Circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius}
              stroke="#1e2340"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress circle */}
            <Circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius}
              stroke={COLORS.primary}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              rotation="-90"
              origin={`${ringSize / 2}, ${ringSize / 2}`}
            />
          </Svg>

          {/* Timer Text */}
          <Text style={{ color: COLORS.textPrimary, fontSize: 56, fontWeight: "300", fontVariant: ["tabular-nums"] }}>
            {formatTime(remainingSeconds)}
          </Text>
        </View>

        {/* Points Display */}
        <View className="flex-row items-center mb-10">
          <FontAwesome name="star" size={20} color={COLORS.accent} />
          <Text style={{ color: COLORS.accent, fontSize: 18, fontWeight: "600", marginLeft: 8 }}>
            {points} points
          </Text>
        </View>

        {/* Play/Pause Button */}
        <TouchableOpacity
          onPress={toggleTimer}
          className="rounded-full items-center justify-center mb-5"
          style={{
            width: 80,
            height: 80,
            backgroundColor: COLORS.primary,
          }}
          activeOpacity={0.8}
        >
          <FontAwesome
            name={isRunning ? "pause" : "play"}
            size={32}
            color="#ffffff"
            style={!isRunning ? { marginLeft: 4 } : undefined}
          />
        </TouchableOpacity>

        {/* Done Early Button */}
        <TouchableOpacity
          onPress={handleDoneEarly}
          className="rounded-2xl py-4 px-10 mb-4"
          style={{ backgroundColor: COLORS.success }}
          activeOpacity={0.8}
        >
          <Text style={{ color: "#ffffff", fontWeight: "bold", fontSize: 16 }}>
            Done Early
          </Text>
        </TouchableOpacity>

        {/* Give Up Button */}
        <TouchableOpacity onPress={handleGiveUp} className="py-3 px-6" activeOpacity={0.7}>
          <Text style={{ color: COLORS.danger, fontSize: 14 }}>
            Give Up
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
