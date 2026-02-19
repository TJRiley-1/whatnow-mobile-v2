import { create } from "zustand";

interface TaskStore {
  // Track in-progress task IDs locally
  inProgressIds: Set<string>;
  startTask: (id: string) => void;
  stopTask: (id: string) => void;
  isInProgress: (id: string) => boolean;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  inProgressIds: new Set(),
  startTask: (id) =>
    set((state) => {
      const next = new Set(state.inProgressIds);
      next.add(id);
      return { inProgressIds: next };
    }),
  stopTask: (id) =>
    set((state) => {
      const next = new Set(state.inProgressIds);
      next.delete(id);
      return { inProgressIds: next };
    }),
  isInProgress: (id) => get().inProgressIds.has(id),
}));
