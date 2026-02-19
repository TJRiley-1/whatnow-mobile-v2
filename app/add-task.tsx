import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Animated,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAddTask } from "@/hooks/useTasks";
import type { SocialLevel, EnergyLevel } from "@/types";

// ─── Constants ───────────────────────────────────────────────────────────────

const COLORS = {
  bgPrimary: "#0a0e1a",
  bgCard: "#1a1f3d",
  bgElevated: "#232850",
  primary: "#6366f1",
  textPrimary: "#f1f5f9",
  textSecondary: "#94a3b8",
  accent: "#f59e0b",
};

const TOTAL_STEPS = 6;

const TASK_TYPES = [
  { label: "Chores", icon: "home" as const, color: "#6366f1" },
  { label: "Work", icon: "briefcase" as const, color: "#3b82f6" },
  { label: "Health", icon: "heartbeat" as const, color: "#ef4444" },
  { label: "Admin", icon: "file-text-o" as const, color: "#8b5cf6" },
  { label: "Errand", icon: "shopping-cart" as const, color: "#f59e0b" },
  { label: "Self-care", icon: "leaf" as const, color: "#10b981" },
  { label: "Creative", icon: "paint-brush" as const, color: "#ec4899" },
  { label: "Social", icon: "users" as const, color: "#06b6d4" },
];

const TIME_OPTIONS = [
  { minutes: 5, points: 5, label: "5 min" },
  { minutes: 15, points: 10, label: "15 min" },
  { minutes: 30, points: 15, label: "30 min" },
  { minutes: 60, points: 25, label: "60 min" },
];

const ENERGY_OPTIONS: {
  value: EnergyLevel;
  label: string;
  description: string;
  points: number;
}[] = [
  { value: "low", label: "Low", description: "Minimal effort needed", points: 5 },
  { value: "medium", label: "Medium", description: "Some effort required", points: 10 },
  { value: "high", label: "High", description: "Full energy needed", points: 20 },
];

const SOCIAL_OPTIONS: {
  value: SocialLevel;
  label: string;
  description: string;
  points: number;
}[] = [
  { value: "low", label: "Low", description: "Solo task, no interaction", points: 5 },
  { value: "medium", label: "Medium", description: "Some interaction needed", points: 10 },
  { value: "high", label: "High", description: "Lots of social interaction", points: 20 },
];

const RECURRING_OPTIONS = [
  { value: "none", label: "None" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getTimePoints(minutes: number): number {
  return TIME_OPTIONS.find((t) => t.minutes === minutes)?.points ?? 0;
}

function getEnergyPoints(level: EnergyLevel): number {
  return ENERGY_OPTIONS.find((e) => e.value === level)?.points ?? 0;
}

function getSocialPoints(level: SocialLevel): number {
  return SOCIAL_OPTIONS.find((s) => s.value === level)?.points ?? 0;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AddTaskScreen() {
  const router = useRouter();
  const addTask = useAddTask();

  // Step state
  const [step, setStep] = useState(1);

  // Form state
  const [type, setType] = useState("");
  const [customType, setCustomType] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [time, setTime] = useState(0);
  const [energy, setEnergy] = useState<EnergyLevel | "">("");
  const [social, setSocial] = useState<SocialLevel | "">("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [recurring, setRecurring] = useState("none");

  // Simple date picker state
  const [dateYear, setDateYear] = useState(new Date().getFullYear());
  const [dateMonth, setDateMonth] = useState(new Date().getMonth());
  const [dateDay, setDateDay] = useState(new Date().getDate());

  // Transition animation
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const animateTransition = (callback: () => void) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      callback();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }).start();
    });
  };

  const goNext = () => {
    if (step < TOTAL_STEPS) {
      animateTransition(() => setStep(step + 1));
    }
  };

  const goBack = () => {
    if (step > 1) {
      animateTransition(() => setStep(step - 1));
    } else {
      router.back();
    }
  };

  const totalPoints =
    (time ? getTimePoints(time) : 0) +
    (energy ? getEnergyPoints(energy as EnergyLevel) : 0) +
    (social ? getSocialPoints(social as SocialLevel) : 0);

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a task name.");
      return;
    }
    if (!type) {
      Alert.alert("Error", "Please select a task type.");
      return;
    }

    addTask.mutate(
      {
        name: name.trim(),
        description: description.trim() || null,
        type,
        time,
        social: social as SocialLevel,
        energy: energy as EnergyLevel,
        due_date: dueDate ? dueDate.toISOString() : null,
        recurring: recurring === "none" ? null : recurring,
        local_id: null,
      },
      {
        onSuccess: () => {
          router.back();
        },
        onError: (error) => {
          Alert.alert("Error", error.message || "Failed to create task.");
        },
      }
    );
  };

  // ─── Progress Bar ────────────────────────────────────────────────────────

  const ProgressBar = () => (
    <View className="px-5 pt-2 pb-4">
      <View className="flex-row items-center mb-2">
        <Text style={{ color: COLORS.textSecondary, fontSize: 13 }}>
          Step {step} of {TOTAL_STEPS}
        </Text>
      </View>
      <View className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.bgCard }}>
        <View
          className="h-full rounded-full"
          style={{
            backgroundColor: COLORS.primary,
            width: `${(step / TOTAL_STEPS) * 100}%`,
          }}
        />
      </View>
    </View>
  );

  // ─── Header ──────────────────────────────────────────────────────────────

  const Header = () => (
    <View className="flex-row items-center justify-between px-5 pt-4 pb-1">
      <TouchableOpacity onPress={goBack} className="w-10 h-10 items-center justify-center">
        <FontAwesome name="arrow-left" size={20} color={COLORS.textPrimary} />
      </TouchableOpacity>
      <Text style={{ color: COLORS.textPrimary, fontWeight: "bold", fontSize: 18 }}>
        Add Task
      </Text>
      <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
        <FontAwesome name="close" size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  // ─── Step 1: Type Selection ──────────────────────────────────────────────

  const StepType = () => (
    <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
      <Text style={{ color: COLORS.textPrimary, fontWeight: "bold", fontSize: 22, marginBottom: 4 }}>
        What type of task?
      </Text>
      <Text style={{ color: COLORS.textSecondary, fontSize: 14, marginBottom: 20 }}>
        Choose a category for your task
      </Text>

      <View className="flex-row flex-wrap justify-between">
        {TASK_TYPES.map((t) => (
          <TouchableOpacity
            key={t.label}
            className="rounded-2xl items-center justify-center mb-4 py-5"
            style={{
              backgroundColor: COLORS.bgCard,
              width: "48%",
              borderWidth: 2,
              borderColor: type === t.label ? t.color : "transparent",
            }}
            activeOpacity={0.7}
            onPress={() => {
              setType(t.label);
              setShowCustomInput(false);
              goNext();
            }}
          >
            <View
              className="w-12 h-12 rounded-full items-center justify-center mb-3"
              style={{ backgroundColor: t.color + "22" }}
            >
              <FontAwesome name={t.icon} size={22} color={t.color} />
            </View>
            <Text style={{ color: COLORS.textPrimary, fontWeight: "600", fontSize: 15 }}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Custom type */}
      {!showCustomInput ? (
        <TouchableOpacity
          className="rounded-2xl items-center justify-center py-4 mb-6"
          style={{ backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.bgElevated, borderStyle: "dashed" }}
          activeOpacity={0.7}
          onPress={() => setShowCustomInput(true)}
        >
          <FontAwesome name="plus" size={16} color={COLORS.textSecondary} />
          <Text style={{ color: COLORS.textSecondary, fontSize: 14, marginTop: 6 }}>
            Custom Type
          </Text>
        </TouchableOpacity>
      ) : (
        <View className="rounded-2xl p-4 mb-6" style={{ backgroundColor: COLORS.bgCard }}>
          <Text style={{ color: COLORS.textSecondary, fontSize: 13, marginBottom: 8 }}>
            Enter custom type
          </Text>
          <TextInput
            className="rounded-xl px-4 py-3 mb-3"
            style={{
              backgroundColor: COLORS.bgElevated,
              color: COLORS.textPrimary,
              fontSize: 16,
            }}
            placeholder="e.g. Gardening"
            placeholderTextColor="#64748b"
            value={customType}
            onChangeText={setCustomType}
            autoFocus
          />
          <TouchableOpacity
            className="rounded-xl py-3 items-center"
            style={{
              backgroundColor: customType.trim() ? COLORS.primary : COLORS.bgElevated,
              opacity: customType.trim() ? 1 : 0.5,
            }}
            disabled={!customType.trim()}
            onPress={() => {
              setType(customType.trim());
              goNext();
            }}
          >
            <Text style={{ color: "#ffffff", fontWeight: "bold", fontSize: 16 }}>
              Use "{customType.trim()}"
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );

  // ─── Step 2: Time Selection ──────────────────────────────────────────────

  const StepTime = () => (
    <View className="flex-1 px-5 justify-center">
      <Text style={{ color: COLORS.textPrimary, fontWeight: "bold", fontSize: 22, marginBottom: 4 }}>
        How long will it take?
      </Text>
      <Text style={{ color: COLORS.textSecondary, fontSize: 14, marginBottom: 24 }}>
        Estimate the time needed
      </Text>

      {TIME_OPTIONS.map((t) => (
        <TouchableOpacity
          key={t.minutes}
          className="rounded-2xl flex-row items-center justify-between px-6 py-5 mb-3"
          style={{
            backgroundColor: COLORS.bgCard,
            borderWidth: 2,
            borderColor: time === t.minutes ? COLORS.primary : "transparent",
          }}
          activeOpacity={0.7}
          onPress={() => {
            setTime(t.minutes);
            goNext();
          }}
        >
          <View className="flex-row items-center">
            <FontAwesome name="clock-o" size={20} color={COLORS.primary} />
            <Text style={{ color: COLORS.textPrimary, fontWeight: "600", fontSize: 18, marginLeft: 14 }}>
              {t.label}
            </Text>
          </View>
          <View className="rounded-full px-3 py-1" style={{ backgroundColor: COLORS.primary + "22" }}>
            <Text style={{ color: COLORS.accent, fontWeight: "bold", fontSize: 14 }}>
              {t.points}pts
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  // ─── Step 3: Energy Level ────────────────────────────────────────────────

  const StepEnergy = () => (
    <View className="flex-1 px-5 justify-center">
      <Text style={{ color: COLORS.textPrimary, fontWeight: "bold", fontSize: 22, marginBottom: 4 }}>
        Energy level needed?
      </Text>
      <Text style={{ color: COLORS.textSecondary, fontSize: 14, marginBottom: 24 }}>
        How much energy does this task require?
      </Text>

      {ENERGY_OPTIONS.map((e) => (
        <TouchableOpacity
          key={e.value}
          className="rounded-2xl px-6 py-5 mb-3"
          style={{
            backgroundColor: COLORS.bgCard,
            borderWidth: 2,
            borderColor: energy === e.value ? COLORS.primary : "transparent",
          }}
          activeOpacity={0.7}
          onPress={() => {
            setEnergy(e.value);
            goNext();
          }}
        >
          <View className="flex-row items-center justify-between mb-1">
            <Text style={{ color: COLORS.textPrimary, fontWeight: "600", fontSize: 18 }}>
              {e.label}
            </Text>
            <View className="rounded-full px-3 py-1" style={{ backgroundColor: COLORS.primary + "22" }}>
              <Text style={{ color: COLORS.accent, fontWeight: "bold", fontSize: 14 }}>
                {e.points}pts
              </Text>
            </View>
          </View>
          <Text style={{ color: COLORS.textSecondary, fontSize: 14 }}>
            {e.description}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // ─── Step 4: Social Battery ──────────────────────────────────────────────

  const StepSocial = () => (
    <View className="flex-1 px-5 justify-center">
      <Text style={{ color: COLORS.textPrimary, fontWeight: "bold", fontSize: 22, marginBottom: 4 }}>
        Social battery needed?
      </Text>
      <Text style={{ color: COLORS.textSecondary, fontSize: 14, marginBottom: 24 }}>
        How much social interaction is involved?
      </Text>

      {SOCIAL_OPTIONS.map((s) => (
        <TouchableOpacity
          key={s.value}
          className="rounded-2xl px-6 py-5 mb-3"
          style={{
            backgroundColor: COLORS.bgCard,
            borderWidth: 2,
            borderColor: social === s.value ? COLORS.primary : "transparent",
          }}
          activeOpacity={0.7}
          onPress={() => {
            setSocial(s.value);
            goNext();
          }}
        >
          <View className="flex-row items-center justify-between mb-1">
            <Text style={{ color: COLORS.textPrimary, fontWeight: "600", fontSize: 18 }}>
              {s.label}
            </Text>
            <View className="rounded-full px-3 py-1" style={{ backgroundColor: COLORS.primary + "22" }}>
              <Text style={{ color: COLORS.accent, fontWeight: "bold", fontSize: 14 }}>
                {s.points}pts
              </Text>
            </View>
          </View>
          <Text style={{ color: COLORS.textSecondary, fontSize: 14 }}>
            {s.description}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // ─── Step 5: Details ─────────────────────────────────────────────────────

  const StepDetails = () => (
    <View className="flex-1 px-5">
      <Text style={{ color: COLORS.textPrimary, fontWeight: "bold", fontSize: 22, marginBottom: 4, marginTop: 8 }}>
        Task details
      </Text>
      <Text style={{ color: COLORS.textSecondary, fontSize: 14, marginBottom: 24 }}>
        Give your task a name and optional description
      </Text>

      <Text style={{ color: COLORS.textSecondary, fontSize: 13, marginBottom: 6 }}>
        Task Name *
      </Text>
      <TextInput
        className="rounded-xl px-4 py-3 mb-5"
        style={{
          backgroundColor: COLORS.bgCard,
          color: COLORS.textPrimary,
          fontSize: 16,
          borderWidth: 1,
          borderColor: COLORS.bgElevated,
        }}
        placeholder="e.g. Clean the kitchen"
        placeholderTextColor="#64748b"
        value={name}
        onChangeText={setName}
        autoFocus
      />

      <Text style={{ color: COLORS.textSecondary, fontSize: 13, marginBottom: 6 }}>
        Description (optional)
      </Text>
      <TextInput
        className="rounded-xl px-4 py-3 mb-8"
        style={{
          backgroundColor: COLORS.bgCard,
          color: COLORS.textPrimary,
          fontSize: 16,
          borderWidth: 1,
          borderColor: COLORS.bgElevated,
          minHeight: 100,
          textAlignVertical: "top",
        }}
        placeholder="Add any extra details..."
        placeholderTextColor="#64748b"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity
        className="rounded-2xl py-4 items-center"
        style={{
          backgroundColor: name.trim() ? COLORS.primary : COLORS.bgElevated,
          opacity: name.trim() ? 1 : 0.5,
        }}
        disabled={!name.trim()}
        activeOpacity={0.8}
        onPress={goNext}
      >
        <Text style={{ color: "#ffffff", fontWeight: "bold", fontSize: 18 }}>
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );

  // ─── Step 6: Schedule ────────────────────────────────────────────────────

  const StepSchedule = () => {
    const quickDates = [
      { label: "Today", date: new Date() },
      {
        label: "Tomorrow",
        date: (() => {
          const d = new Date();
          d.setDate(d.getDate() + 1);
          return d;
        })(),
      },
      {
        label: "Next Week",
        date: (() => {
          const d = new Date();
          d.setDate(d.getDate() + 7);
          return d;
        })(),
      },
    ];

    return (
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <Text style={{ color: COLORS.textPrimary, fontWeight: "bold", fontSize: 22, marginBottom: 4, marginTop: 8 }}>
          Schedule (optional)
        </Text>
        <Text style={{ color: COLORS.textSecondary, fontSize: 14, marginBottom: 20 }}>
          Set a due date and recurring schedule
        </Text>

        {/* Due Date */}
        <Text style={{ color: COLORS.textSecondary, fontSize: 13, marginBottom: 8 }}>
          Due Date
        </Text>

        <View className="flex-row mb-3" style={{ gap: 8 }}>
          {quickDates.map((qd) => (
            <TouchableOpacity
              key={qd.label}
              className="rounded-xl py-3 px-4 flex-1 items-center"
              style={{
                backgroundColor:
                  dueDate && dueDate.toDateString() === qd.date.toDateString()
                    ? COLORS.primary
                    : COLORS.bgCard,
              }}
              activeOpacity={0.7}
              onPress={() => setDueDate(qd.date)}
            >
              <Text
                style={{
                  color:
                    dueDate && dueDate.toDateString() === qd.date.toDateString()
                      ? "#ffffff"
                      : COLORS.textPrimary,
                  fontWeight: "600",
                  fontSize: 14,
                }}
              >
                {qd.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {dueDate && (
          <View className="flex-row items-center justify-between rounded-xl px-4 py-3 mb-3" style={{ backgroundColor: COLORS.bgCard }}>
            <Text style={{ color: COLORS.textPrimary, fontSize: 15 }}>
              {formatDate(dueDate)}
            </Text>
            <TouchableOpacity onPress={() => setDueDate(null)}>
              <Text style={{ color: COLORS.textSecondary, fontSize: 13 }}>Clear</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Recurring */}
        <Text style={{ color: COLORS.textSecondary, fontSize: 13, marginBottom: 8, marginTop: 12 }}>
          Repeat
        </Text>
        <View className="flex-row flex-wrap" style={{ gap: 8 }}>
          {RECURRING_OPTIONS.map((r) => (
            <TouchableOpacity
              key={r.value}
              className="rounded-xl py-3 px-5 items-center"
              style={{
                backgroundColor: recurring === r.value ? COLORS.primary : COLORS.bgCard,
              }}
              activeOpacity={0.7}
              onPress={() => setRecurring(r.value)}
            >
              <Text
                style={{
                  color: recurring === r.value ? "#ffffff" : COLORS.textPrimary,
                  fontWeight: "600",
                  fontSize: 14,
                }}
              >
                {r.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Points Summary */}
        <View
          className="rounded-2xl p-5 mt-8 items-center"
          style={{ backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.accent + "33" }}
        >
          <Text style={{ color: COLORS.textSecondary, fontSize: 14, marginBottom: 4 }}>
            Total Points
          </Text>
          <Text style={{ color: COLORS.accent, fontWeight: "bold", fontSize: 36 }}>
            {totalPoints}
          </Text>
          <Text style={{ color: COLORS.textSecondary, fontSize: 12, marginTop: 2 }}>
            points per completion
          </Text>
        </View>

        {/* Submit */}
        <TouchableOpacity
          className="rounded-2xl py-4 items-center mt-6 mb-10"
          style={{
            backgroundColor: COLORS.primary,
            opacity: addTask.isPending ? 0.6 : 1,
          }}
          activeOpacity={0.8}
          disabled={addTask.isPending}
          onPress={handleSubmit}
        >
          {addTask.isPending ? (
            <Text style={{ color: "#ffffff", fontWeight: "bold", fontSize: 18 }}>
              Creating...
            </Text>
          ) : (
            <View className="flex-row items-center">
              <FontAwesome name="check" size={18} color="#ffffff" />
              <Text style={{ color: "#ffffff", fontWeight: "bold", fontSize: 18, marginLeft: 10 }}>
                Create Task
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
    );
  };

  // ─── Render current step ─────────────────────────────────────────────────

  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepType />;
      case 2:
        return <StepTime />;
      case 3:
        return <StepEnergy />;
      case 4:
        return <StepSocial />;
      case 5:
        return <StepDetails />;
      case 6:
        return <StepSchedule />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLORS.bgPrimary }}>
      <Header />
      <ProgressBar />
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {renderStep()}
      </Animated.View>
    </SafeAreaView>
  );
}
