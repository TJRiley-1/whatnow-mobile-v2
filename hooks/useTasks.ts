import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import type { Task, CompletedTask } from "@/types";

export function useTasks() {
  const user = useAuthStore((s) => s.user);

  return useQuery<Task[]>({
    queryKey: ["tasks", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });
}

export function useCompletedTasks(limit = 50) {
  const user = useAuthStore((s) => s.user);

  return useQuery<CompletedTask[]>({
    queryKey: ["completed_tasks", user?.id, limit],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("completed_tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });
}

export function useAddTask() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      task: Omit<Task, "id" | "user_id" | "created_at" | "updated_at" | "times_shown" | "times_skipped" | "times_completed" | "points_earned">
    ) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("tasks")
        .insert({ ...task, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Task>;
    }) => {
      const { data, error } = await supabase
        .from("tasks")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useCompleteTask() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      task,
      points,
      timeSpent,
    }: {
      task: Task;
      points: number;
      timeSpent: number | null;
    }) => {
      if (!user) throw new Error("Not authenticated");

      // Insert into completed_tasks
      const { error: completedError } = await supabase
        .from("completed_tasks")
        .insert({
          user_id: user.id,
          task_name: task.name,
          task_type: task.type,
          points,
          time_spent: timeSpent,
          task_time: task.time,
          task_social: task.social,
          task_energy: task.energy,
        });
      if (completedError) throw completedError;

      // Update task stats
      await supabase
        .from("tasks")
        .update({
          times_completed: task.times_completed + 1,
          points_earned: task.points_earned + points,
          updated_at: new Date().toISOString(),
        })
        .eq("id", task.id);

      // Update profile stats
      const { data: profile } = await supabase
        .from("profiles")
        .select("total_points, total_tasks_completed, total_time_spent")
        .eq("id", user.id)
        .single();

      if (profile) {
        const { getRankForPoints } = await import("@/lib/ranks");
        const newTotalPoints = profile.total_points + points;
        await supabase
          .from("profiles")
          .update({
            total_points: newTotalPoints,
            total_tasks_completed: profile.total_tasks_completed + 1,
            total_time_spent:
              profile.total_time_spent + (timeSpent ?? task.time),
            current_rank: getRankForPoints(newTotalPoints),
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);
      }

      return { points };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["completed_tasks"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
