import { View, Text, TouchableOpacity, Animated, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useEffect, useRef } from "react";

const MESSAGES = [
  "You crushed it!",
  "One step closer to your goals!",
  "Look at you being productive!",
  "That wasn't so hard, was it?",
  "Keep the momentum going!",
  "You're on fire!",
  "Progress, not perfection!",
  "Small wins add up to big victories!",
  "Your future self thanks you!",
  "Consistency is key, and you just proved it!",
];

const CONFETTI_COLORS = ["#6366f1", "#f59e0b", "#22c55e", "#ef4444", "#ec4899", "#06b6d4", "#8b5cf6", "#f97316"];
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

function ConfettiPiece({ delay, color, startX }: { delay: number; color: string; startX: number }) {
  const translateY = useRef(new Animated.Value(-20)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const drift = (Math.random() - 0.5) * 100;
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(translateY, { toValue: SCREEN_HEIGHT * 0.7, duration: 2000 + Math.random() * 1000, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: drift, duration: 2000 + Math.random() * 1000, useNativeDriver: true }),
        Animated.timing(rotate, { toValue: 3 + Math.random() * 3, duration: 2000, useNativeDriver: true }),
        Animated.sequence([
          Animated.timing(scale, { toValue: 1, duration: 200, useNativeDriver: true }),
          Animated.delay(1500),
          Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true }),
        ]),
      ]),
    ]).start();
  }, []);

  const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  const size = 8 + Math.random() * 8;

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: startX,
        top: 0,
        width: size,
        height: size,
        borderRadius: Math.random() > 0.5 ? size / 2 : 2,
        backgroundColor: color,
        opacity,
        transform: [{ translateY }, { translateX }, { rotate: spin }, { scale }],
      }}
    />
  );
}

export default function CelebrationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ taskName: string; points: string; timeSpent: string }>();
  const taskName = params.taskName ?? "Task";
  const points = parseInt(params.points ?? "0");
  const timeSpent = parseInt(params.timeSpent ?? "0");

  const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const pointsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      Animated.spring(pointsAnim, { toValue: 1, tension: 80, friction: 5, useNativeDriver: true }),
    ]).start();
  }, []);

  const confettiPieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    delay: Math.random() * 600,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    startX: Math.random() * SCREEN_WIDTH,
  }));

  const formatTime = (mins: number) => {
    if (mins < 1) return "< 1 min";
    if (mins >= 60) return `${Math.floor(mins / 60)}h ${mins % 60}m`;
    return `${mins} min`;
  };

  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      {/* Confetti */}
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, pointerEvents: "none" }}>
        {confettiPieces.map((p) => (
          <ConfettiPiece key={p.id} delay={p.delay} color={p.color} startX={p.startX} />
        ))}
      </View>

      <View className="flex-1 items-center justify-center px-8">
        {/* Trophy / Check Icon */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }], marginBottom: 24 }}>
          <View className="w-28 h-28 rounded-full bg-bg-elevated items-center justify-center" style={{ borderWidth: 3, borderColor: "#f59e0b" }}>
            <FontAwesome name="trophy" size={52} color="#f59e0b" />
          </View>
        </Animated.View>

        {/* Task Complete */}
        <Text style={{ color: "#22c55e", fontWeight: "bold", fontSize: 28, marginBottom: 8 }}>
          Task Complete!
        </Text>

        {/* Task Name */}
        <Text style={{ color: "#f1f5f9", fontWeight: "600", fontSize: 18, textAlign: "center", marginBottom: 24 }}>
          {taskName}
        </Text>

        {/* Points Earned */}
        <Animated.View style={{ transform: [{ scale: pointsAnim }], marginBottom: 8 }}>
          <Text style={{ color: "#f59e0b", fontWeight: "bold", fontSize: 48 }}>
            +{points}
          </Text>
        </Animated.View>
        <Text style={{ color: "#94a3b8", fontSize: 14, marginBottom: 24 }}>points earned</Text>

        {/* Time Spent */}
        <View className="bg-bg-card rounded-2xl px-6 py-3 mb-8">
          <Text style={{ color: "#94a3b8", fontSize: 14, textAlign: "center" }}>
            Time spent: {formatTime(timeSpent)}
          </Text>
        </View>

        {/* Motivational Message */}
        <Text style={{ color: "#818cf8", fontSize: 16, fontStyle: "italic", textAlign: "center", marginBottom: 40 }}>
          "{message}"
        </Text>

        {/* Action Buttons */}
        <TouchableOpacity
          className="bg-primary rounded-2xl py-4 px-8 mb-4"
          style={{ width: "100%" }}
          activeOpacity={0.8}
          onPress={() => router.replace("/what-next")}
        >
          <Text style={{ color: "#ffffff", fontWeight: "bold", fontSize: 18, textAlign: "center" }}>
            What's Next?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="border rounded-2xl py-4 px-8"
          style={{ width: "100%", borderColor: "#2a2f52" }}
          activeOpacity={0.8}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={{ color: "#f1f5f9", fontWeight: "bold", fontSize: 18, textAlign: "center" }}>
            Back to Home
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
