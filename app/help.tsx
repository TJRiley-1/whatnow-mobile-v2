import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "What is What Now?",
    a: "What Now is a task management app designed for people who struggle with task paralysis and ADHD. Instead of overwhelming you with a long to-do list, it helps you decide what to do next based on your current energy, social battery, and available time.",
  },
  {
    q: "How does What Task Now? work?",
    a: "What Task Now? filters your tasks based on how you're feeling right now. Select your available time, energy level, and social battery, then swipe through matching tasks. Swipe right to accept, left to skip. It's like Tinder, but for your to-do list!",
  },
  {
    q: "How do points work?",
    a: "Points are earned when you complete tasks. The amount depends on the task's time estimate, energy level, and social requirements. Higher effort tasks earn more points. Points contribute to your rank progression.",
  },
  {
    q: "What are the ranks?",
    a: "There are 6 ranks:\n\n- Task Newbie (0 pts)\n- Task Apprentice (100 pts)\n- Task Warrior (500 pts)\n- Task Hero (1,000 pts)\n- Task Master (2,500 pts)\n- Task Legend (5,000 pts)",
  },
  {
    q: "How do groups work?",
    a: "Create a group and share the invite code with friends or family. You can see each other's weekly points on the leaderboard. It adds a fun competitive element to getting things done!",
  },
  {
    q: "Can I edit or delete tasks?",
    a: "Yes! Go to Manage Tasks from the home screen. You can tap any task to edit its details, or swipe left to delete it.",
  },
  {
    q: "What if no tasks match my current state?",
    a: "If no tasks match your filters, we'll suggest some quick, easy activities you can do to build momentum. Sometimes starting with something small is all you need.",
  },
  {
    q: "How do I change my password?",
    a: "Go to Profile → Edit Profile → Change Password. Enter your new password and confirm it.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={{ backgroundColor: "#1a1f3d", borderRadius: 16, marginBottom: 12, overflow: "hidden" }}
      activeOpacity={0.7}
      onPress={() => setExpanded(!expanded)}
    >
      <View style={{ flexDirection: "row", alignItems: "center", padding: 16 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#f1f5f9", fontWeight: "600", fontSize: 15 }}>{question}</Text>
        </View>
        <FontAwesome name={expanded ? "chevron-up" : "chevron-down"} size={12} color="#64748b" style={{ marginLeft: 12 }} />
      </View>
      {expanded && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <Text style={{ color: "#94a3b8", fontSize: 14, lineHeight: 22 }}>{answer}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function HelpScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      <View className="flex-row items-center px-5 pt-4 pb-2">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <FontAwesome name="arrow-left" size={20} color="#f1f5f9" />
        </TouchableOpacity>
        <Text style={{ color: "#f1f5f9", fontWeight: "bold", fontSize: 20 }}>Help & FAQ</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Text style={{ color: "#94a3b8", fontSize: 14, marginTop: 16, marginBottom: 20 }}>
          Frequently asked questions about What Now
        </Text>

        {FAQ_ITEMS.map((item, idx) => (
          <FAQItem key={idx} question={item.q} answer={item.a} />
        ))}

        {/* Contact */}
        <View style={{ backgroundColor: "#1a1f3d", borderRadius: 16, padding: 20, marginTop: 8, alignItems: "center" }}>
          <FontAwesome name="envelope-o" size={24} color="#6366f1" style={{ marginBottom: 8 }} />
          <Text style={{ color: "#f1f5f9", fontWeight: "bold", fontSize: 16, marginBottom: 4 }}>Need more help?</Text>
          <Text style={{ color: "#94a3b8", fontSize: 14 }}>support@whatnow.app</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
