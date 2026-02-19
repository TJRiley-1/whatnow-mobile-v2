import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/lib/supabase";
import type { SocialLevel, EnergyLevel } from "@/types";

const TASK_TYPES = ["Chores", "Work", "Health", "Admin", "Errand", "Self-care", "Creative", "Social"];
const TIME_OPTIONS = [5, 15, 30, 60];
const LEVELS: { label: string; value: string }[] = [
  { label: "Low", value: "low" },
  { label: "Med", value: "medium" },
  { label: "High", value: "high" },
];

export default function ImportTasksScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const [mode, setMode] = useState<"text" | "csv">("text");
  const [text, setText] = useState("");
  const [selectedType, setSelectedType] = useState("Chores");
  const [selectedTime, setSelectedTime] = useState(15);
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyLevel>("low");
  const [selectedSocial, setSelectedSocial] = useState<SocialLevel>("low");
  const [importing, setImporting] = useState(false);

  const parsedTasks = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  async function handleImportText() {
    if (!user || parsedTasks.length === 0) return;
    setImporting(true);
    try {
      const tasks = parsedTasks.map((name) => ({
        user_id: user.id,
        name,
        type: selectedType,
        time: selectedTime,
        social: selectedSocial,
        energy: selectedEnergy,
        description: null,
        due_date: null,
        recurring: null,
        local_id: null,
      }));
      const { error } = await supabase.from("tasks").insert(tasks);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      Alert.alert("Success", `Imported ${tasks.length} tasks!`);
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Failed to import tasks");
    } finally {
      setImporting(false);
    }
  }

  async function handleImportCSV() {
    if (!user) return;
    const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length === 0) return;

    setImporting(true);
    try {
      const tasks = lines.map((line) => {
        const parts = line.split(",").map((p) => p.trim());
        const name = parts[0] ?? "Untitled";
        const type = TASK_TYPES.includes(parts[1]) ? parts[1] : selectedType;
        const time = TIME_OPTIONS.includes(Number(parts[2])) ? Number(parts[2]) : selectedTime;
        const energy = ["low", "medium", "high"].includes(parts[3]) ? parts[3] as EnergyLevel : selectedEnergy;
        const social = ["low", "medium", "high"].includes(parts[4]) ? parts[4] as SocialLevel : selectedSocial;
        return { user_id: user.id, name, type, time, social, energy, description: null, due_date: null, recurring: null, local_id: null };
      });
      const { error } = await supabase.from("tasks").insert(tasks);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      Alert.alert("Success", `Imported ${tasks.length} tasks!`);
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Failed to import");
    } finally {
      setImporting(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
            <FontAwesome name="arrow-left" size={20} color="#f1f5f9" />
          </TouchableOpacity>
          <Text style={{ color: "#f1f5f9", fontWeight: "bold", fontSize: 20, flex: 1 }}>Import Tasks</Text>
        </View>

        <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }} keyboardDismissMode="on-drag" showsVerticalScrollIndicator={false}>
          {/* Mode Toggle */}
          <View style={{ flexDirection: "row", marginBottom: 16, marginTop: 8 }}>
            <TouchableOpacity
              style={{ flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: mode === "text" ? "#6366f1" : "#1a1f3d", marginRight: 6 }}
              onPress={() => setMode("text")}
            >
              <Text style={{ color: mode === "text" ? "#ffffff" : "#94a3b8", fontWeight: "bold", fontSize: 14, textAlign: "center" }}>Text</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: mode === "csv" ? "#6366f1" : "#1a1f3d", marginLeft: 6 }}
              onPress={() => setMode("csv")}
            >
              <Text style={{ color: mode === "csv" ? "#ffffff" : "#94a3b8", fontWeight: "bold", fontSize: 14, textAlign: "center" }}>CSV</Text>
            </TouchableOpacity>
          </View>

          {/* Text Area */}
          <TextInput
            style={{ backgroundColor: "#1a1f3d", borderRadius: 16, padding: 16, color: "#f1f5f9", fontSize: 15, minHeight: 160, textAlignVertical: "top" }}
            value={text}
            onChangeText={setText}
            placeholder={mode === "text"
              ? "Paste your tasks here, one per line...\n\nExample:\nDo laundry\nBuy groceries\nCall dentist\nClean bathroom"
              : "name,type,time,energy,social\n\nExample:\nDo laundry,Chores,15,low,low\nCall mom,Social,30,medium,high"}
            placeholderTextColor="#64748b"
            multiline
            numberOfLines={8}
          />

          {/* Preview count */}
          {parsedTasks.length > 0 && (
            <Text style={{ color: "#f59e0b", fontWeight: "bold", fontSize: 14, marginTop: 12, marginBottom: 4 }}>
              {parsedTasks.length} task{parsedTasks.length !== 1 ? "s" : ""} will be imported
            </Text>
          )}

          {/* Settings (text mode only) */}
          {mode === "text" && (
            <View style={{ marginTop: 20 }}>
              <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: "bold", letterSpacing: 1, marginBottom: 8 }}>
                APPLY TO ALL TASKS
              </Text>

              {/* Type */}
              <Text style={{ color: "#94a3b8", fontSize: 12, marginBottom: 6 }}>Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                {TASK_TYPES.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, backgroundColor: selectedType === t ? "#6366f1" : "#1a1f3d", marginRight: 8 }}
                    onPress={() => setSelectedType(t)}
                  >
                    <Text style={{ color: selectedType === t ? "#ffffff" : "#94a3b8", fontSize: 13, fontWeight: "600" }}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Time */}
              <Text style={{ color: "#94a3b8", fontSize: 12, marginBottom: 6 }}>Time</Text>
              <View style={{ flexDirection: "row", marginBottom: 12 }}>
                {TIME_OPTIONS.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={{ flex: 1, paddingVertical: 8, borderRadius: 12, backgroundColor: selectedTime === t ? "#6366f1" : "#1a1f3d", marginRight: 6 }}
                    onPress={() => setSelectedTime(t)}
                  >
                    <Text style={{ color: selectedTime === t ? "#ffffff" : "#94a3b8", fontSize: 13, fontWeight: "600", textAlign: "center" }}>{t}m</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Energy */}
              <Text style={{ color: "#94a3b8", fontSize: 12, marginBottom: 6 }}>Energy</Text>
              <View style={{ flexDirection: "row", marginBottom: 12 }}>
                {LEVELS.map((l) => (
                  <TouchableOpacity
                    key={l.value}
                    style={{ flex: 1, paddingVertical: 8, borderRadius: 12, backgroundColor: selectedEnergy === l.value ? "#6366f1" : "#1a1f3d", marginRight: 6 }}
                    onPress={() => setSelectedEnergy(l.value as EnergyLevel)}
                  >
                    <Text style={{ color: selectedEnergy === l.value ? "#ffffff" : "#94a3b8", fontSize: 13, fontWeight: "600", textAlign: "center" }}>{l.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Social */}
              <Text style={{ color: "#94a3b8", fontSize: 12, marginBottom: 6 }}>Social</Text>
              <View style={{ flexDirection: "row", marginBottom: 12 }}>
                {LEVELS.map((l) => (
                  <TouchableOpacity
                    key={l.value}
                    style={{ flex: 1, paddingVertical: 8, borderRadius: 12, backgroundColor: selectedSocial === l.value ? "#6366f1" : "#1a1f3d", marginRight: 6 }}
                    onPress={() => setSelectedSocial(l.value as SocialLevel)}
                  >
                    <Text style={{ color: selectedSocial === l.value ? "#ffffff" : "#94a3b8", fontSize: 13, fontWeight: "600", textAlign: "center" }}>{l.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Import Button */}
          <TouchableOpacity
            style={{ backgroundColor: "#6366f1", borderRadius: 16, paddingVertical: 16, marginTop: 20, opacity: parsedTasks.length === 0 || importing ? 0.5 : 1 }}
            onPress={mode === "text" ? handleImportText : handleImportCSV}
            disabled={parsedTasks.length === 0 || importing}
            activeOpacity={0.8}
          >
            <Text style={{ color: "#ffffff", fontWeight: "bold", fontSize: 16, textAlign: "center" }}>
              {importing ? "Importing..." : `Import ${parsedTasks.length} Task${parsedTasks.length !== 1 ? "s" : ""}`}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
