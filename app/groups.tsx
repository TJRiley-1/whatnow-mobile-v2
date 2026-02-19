import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView, Modal, ActivityIndicator, Share } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { supabase } from "@/lib/supabase";

interface GroupWithDetails {
  id: string;
  group_id: string;
  user_id: string;
  joined_at: string;
  groups: {
    id: string;
    name: string;
    description: string | null;
    invite_code: string;
    created_by: string | null;
    created_at: string;
  };
}

interface LeaderboardEntry {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  current_rank: string;
  weekly_points: number;
  weekly_tasks: number;
  group_id: string | null;
}

function useUserGroups() {
  const user = useAuthStore((s) => s.user);
  return useQuery<GroupWithDetails[]>({
    queryKey: ["user_groups", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("group_members")
        .select("*, groups(*)")
        .eq("user_id", user.id);
      if (error) throw error;
      return (data ?? []) as GroupWithDetails[];
    },
    enabled: !!user,
  });
}

function useLeaderboard(groupId: string | null) {
  return useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard", groupId],
    queryFn: async () => {
      if (!groupId) return [];
      const { data, error } = await supabase
        .from("weekly_leaderboard")
        .select("*")
        .eq("group_id", groupId)
        .order("weekly_points", { ascending: false });
      if (error) throw error;
      return (data ?? []) as LeaderboardEntry[];
    },
    enabled: !!groupId,
  });
}

export default function GroupsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const { data: groups, isLoading } = useUserGroups();

  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [joining, setJoining] = useState(false);

  async function handleCreateGroup() {
    if (!user || !groupName.trim()) return;
    setCreating(true);
    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const { data: group, error } = await supabase
        .from("groups")
        .insert({ name: groupName.trim(), description: groupDesc.trim() || null, invite_code: code, created_by: user.id })
        .select()
        .single();
      if (error) throw error;
      await supabase.from("group_members").insert({ group_id: group.id, user_id: user.id });
      queryClient.invalidateQueries({ queryKey: ["user_groups"] });
      setShowCreate(false);
      setGroupName("");
      setGroupDesc("");
      Alert.alert("Group Created!", `Invite code: ${code}\nShare this with friends!`, [
        { text: "Share", onPress: () => Share.share({ message: `Join my group on WhatNow! Use invite code: ${code}` }) },
        { text: "OK", style: "cancel" },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Failed to create group");
    } finally {
      setCreating(false);
    }
  }

  async function handleJoinGroup() {
    if (!user || !inviteCode.trim()) return;
    setJoining(true);
    try {
      const { data: group, error: findErr } = await supabase
        .from("groups")
        .select("*")
        .eq("invite_code", inviteCode.trim().toUpperCase())
        .single();
      if (findErr || !group) {
        Alert.alert("Error", "Invalid invite code");
        return;
      }
      const { error: joinErr } = await supabase
        .from("group_members")
        .insert({ group_id: group.id, user_id: user.id });
      if (joinErr) {
        if (joinErr.code === "23505") Alert.alert("Already Joined", "You're already in this group");
        else throw joinErr;
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["user_groups"] });
      setShowJoin(false);
      setInviteCode("");
      Alert.alert("Joined!", `You've joined "${group.name}"`);
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Failed to join group");
    } finally {
      setJoining(false);
    }
  }

  async function handleLeaveGroup(groupId: string, name: string) {
    Alert.alert("Leave Group", `Leave "${name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Leave", style: "destructive",
        onPress: async () => {
          await supabase.from("group_members").delete().eq("group_id", groupId).eq("user_id", user!.id);
          queryClient.invalidateQueries({ queryKey: ["user_groups"] });
        },
      },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      <View className="flex-row items-center px-5 pt-4 pb-2">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <FontAwesome name="arrow-left" size={20} color="#f1f5f9" />
        </TouchableOpacity>
        <Text style={{ color: "#f1f5f9", fontWeight: "bold", fontSize: 20 }}>My Groups</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View className="flex-row mb-6 mt-4">
          <TouchableOpacity className="flex-1 bg-primary rounded-2xl py-4 mr-2" activeOpacity={0.8} onPress={() => setShowCreate(true)}>
            <Text style={{ color: "#ffffff", fontWeight: "bold", fontSize: 14, textAlign: "center" }}>Create Group</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 rounded-2xl py-4 ml-2" style={{ borderWidth: 1, borderColor: "#6366f1" }} activeOpacity={0.8} onPress={() => setShowJoin(true)}>
            <Text style={{ color: "#6366f1", fontWeight: "bold", fontSize: 14, textAlign: "center" }}>Join Group</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator color="#6366f1" size="large" style={{ marginTop: 40 }} />
        ) : !groups || groups.length === 0 ? (
          <View className="bg-bg-card rounded-2xl p-8 items-center">
            <FontAwesome name="users" size={40} color="#64748b" style={{ marginBottom: 12 }} />
            <Text style={{ color: "#94a3b8", textAlign: "center", fontSize: 14 }}>
              No groups yet.{"\n"}Create one or join with an invite code!
            </Text>
          </View>
        ) : (
          groups.map((m) => (
            <GroupCard
              key={m.group_id}
              membership={m}
              expanded={expandedGroup === m.group_id}
              onToggle={() => setExpandedGroup(expandedGroup === m.group_id ? null : m.group_id)}
              onLeave={() => handleLeaveGroup(m.group_id, m.groups.name)}
              currentUserId={user?.id ?? ""}
            />
          ))
        )}
      </ScrollView>

      {/* Create Modal */}
      <Modal visible={showCreate} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: "#111631", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 }}>
            <Text style={{ color: "#f1f5f9", fontWeight: "bold", fontSize: 20, marginBottom: 20 }}>Create Group</Text>
            <TextInput style={{ backgroundColor: "#1a1f3d", borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, color: "#f1f5f9", fontSize: 16, marginBottom: 12 }} value={groupName} onChangeText={setGroupName} placeholder="Group name" placeholderTextColor="#64748b" />
            <TextInput style={{ backgroundColor: "#1a1f3d", borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, color: "#f1f5f9", fontSize: 16, marginBottom: 20 }} value={groupDesc} onChangeText={setGroupDesc} placeholder="Description (optional)" placeholderTextColor="#64748b" />
            <TouchableOpacity style={{ backgroundColor: "#6366f1", borderRadius: 16, paddingVertical: 14, marginBottom: 12, opacity: creating || !groupName.trim() ? 0.5 : 1 }} onPress={handleCreateGroup} disabled={creating || !groupName.trim()}>
              <Text style={{ color: "#ffffff", fontWeight: "bold", fontSize: 16, textAlign: "center" }}>{creating ? "Creating..." : "Create"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ paddingVertical: 12 }} onPress={() => setShowCreate(false)}>
              <Text style={{ color: "#94a3b8", fontSize: 16, textAlign: "center" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Join Modal */}
      <Modal visible={showJoin} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: "#111631", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 }}>
            <Text style={{ color: "#f1f5f9", fontWeight: "bold", fontSize: 20, marginBottom: 20 }}>Join Group</Text>
            <TextInput style={{ backgroundColor: "#1a1f3d", borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, color: "#f1f5f9", fontSize: 16, textAlign: "center", letterSpacing: 4, marginBottom: 20 }} value={inviteCode} onChangeText={setInviteCode} placeholder="INVITE CODE" placeholderTextColor="#64748b" autoCapitalize="characters" maxLength={6} />
            <TouchableOpacity style={{ backgroundColor: "#6366f1", borderRadius: 16, paddingVertical: 14, marginBottom: 12, opacity: joining || inviteCode.length < 4 ? 0.5 : 1 }} onPress={handleJoinGroup} disabled={joining || inviteCode.length < 4}>
              <Text style={{ color: "#ffffff", fontWeight: "bold", fontSize: 16, textAlign: "center" }}>{joining ? "Joining..." : "Join"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ paddingVertical: 12 }} onPress={() => setShowJoin(false)}>
              <Text style={{ color: "#94a3b8", fontSize: 16, textAlign: "center" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function GroupCard({ membership, expanded, onToggle, onLeave, currentUserId }: { membership: GroupWithDetails; expanded: boolean; onToggle: () => void; onLeave: () => void; currentUserId: string }) {
  const group = membership.groups;
  const { data: leaderboard } = useLeaderboard(expanded ? group.id : null);

  return (
    <View style={{ backgroundColor: "#1a1f3d", borderRadius: 16, marginBottom: 16, overflow: "hidden" }}>
      <TouchableOpacity style={{ padding: 16, flexDirection: "row", alignItems: "center" }} onPress={onToggle} activeOpacity={0.7}>
        <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "#232850", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
          <FontAwesome name="users" size={20} color="#6366f1" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#f1f5f9", fontWeight: "bold", fontSize: 16 }}>{group.name}</Text>
          {group.description ? <Text style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>{group.description}</Text> : null}
        </View>
        <FontAwesome name={expanded ? "chevron-up" : "chevron-down"} size={14} color="#64748b" />
      </TouchableOpacity>

      {expanded && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <View style={{ backgroundColor: "#232850", borderRadius: 12, padding: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <Text style={{ color: "#94a3b8", fontSize: 12 }}>Invite Code:</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ color: "#f59e0b", fontWeight: "bold", fontSize: 16, letterSpacing: 2 }}>{group.invite_code}</Text>
              <TouchableOpacity
                style={{ marginLeft: 12, width: 32, height: 32, borderRadius: 16, backgroundColor: "#1a1f3d", alignItems: "center", justifyContent: "center" }}
                onPress={() => Share.share({ message: `Join my group on WhatNow! Use invite code: ${group.invite_code}` })}
              >
                <FontAwesome name="share" size={14} color="#6366f1" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={{ color: "#94a3b8", fontSize: 12, fontWeight: "bold", letterSpacing: 1, marginBottom: 8 }}>WEEKLY LEADERBOARD</Text>
          {!leaderboard || leaderboard.length === 0 ? (
            <Text style={{ color: "#64748b", fontSize: 13, textAlign: "center", paddingVertical: 12 }}>No activity this week</Text>
          ) : (
            leaderboard.map((entry, idx) => {
              const isMe = entry.user_id === currentUserId;
              return (
                <View key={entry.user_id} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 8, borderBottomWidth: idx < leaderboard.length - 1 ? 1 : 0, borderBottomColor: "#2a2f52", backgroundColor: isMe ? "rgba(99,102,241,0.1)" : "transparent", borderRadius: isMe ? 8 : 0 }}>
                  <Text style={{ color: idx < 3 ? "#f59e0b" : "#64748b", fontWeight: "bold", fontSize: 16, width: 28 }}>#{idx + 1}</Text>
                  <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "#232850", alignItems: "center", justifyContent: "center", marginRight: 10 }}>
                    <Text style={{ color: "#6366f1", fontWeight: "bold", fontSize: 12 }}>{(entry.display_name?.[0] ?? "?").toUpperCase()}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: isMe ? "#818cf8" : "#f1f5f9", fontWeight: isMe ? "bold" : "normal", fontSize: 14 }}>{entry.display_name ?? "User"}{isMe ? " (You)" : ""}</Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ color: "#f59e0b", fontWeight: "bold", fontSize: 14 }}>{entry.weekly_points} pts</Text>
                    <Text style={{ color: "#64748b", fontSize: 11 }}>{entry.weekly_tasks} tasks</Text>
                  </View>
                </View>
              );
            })
          )}

          <TouchableOpacity style={{ marginTop: 16, paddingVertical: 10 }} onPress={onLeave}>
            <Text style={{ color: "#ef4444", fontSize: 14, textAlign: "center" }}>Leave Group</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
