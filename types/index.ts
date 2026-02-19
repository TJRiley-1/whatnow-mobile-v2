export type SocialLevel = "low" | "medium" | "high";
export type EnergyLevel = "low" | "medium" | "high";

export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  total_points: number;
  total_tasks_completed: number;
  total_time_spent: number;
  current_rank: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  local_id: string | null;
  name: string;
  description: string | null;
  type: string;
  time: number; // minutes
  social: SocialLevel;
  energy: EnergyLevel;
  due_date: string | null;
  recurring: string | null;
  times_shown: number;
  times_skipped: number;
  times_completed: number;
  points_earned: number;
  created_at: string;
  updated_at: string;
}

export interface CompletedTask {
  id: string;
  user_id: string;
  task_name: string;
  task_type: string;
  points: number;
  time_spent: number | null;
  task_time: number | null;
  task_social: SocialLevel | null;
  task_energy: EnergyLevel | null;
  completed_at: string;
}

export interface Group {
  id: string;
  name: string;
  description: string | null;
  invite_code: string;
  created_by: string | null;
  created_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  joined_at: string;
}

export interface WeeklyLeaderboardEntry {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  current_rank: string;
  weekly_points: number;
  weekly_tasks: number;
  group_id: string | null;
}

// Derived task status (not stored in DB)
export type TaskStatus = "pending" | "in_progress" | "done";
