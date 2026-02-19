const RANKS = [
  { name: "Task Newbie", threshold: 0 },
  { name: "Task Apprentice", threshold: 100 },
  { name: "Task Warrior", threshold: 500 },
  { name: "Task Hero", threshold: 1000 },
  { name: "Task Master", threshold: 2500 },
  { name: "Task Legend", threshold: 5000 },
];

export function getRankInfo(points: number) {
  let currentIndex = 0;
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (points >= RANKS[i].threshold) {
      currentIndex = i;
      break;
    }
  }

  const currentRank = RANKS[currentIndex].name;
  const nextRankObj = RANKS[currentIndex + 1];
  const nextRank = nextRankObj?.name ?? null;

  let progress = 100;
  if (nextRankObj) {
    const currentThreshold = RANKS[currentIndex].threshold;
    const nextThreshold = nextRankObj.threshold;
    progress = Math.min(
      ((points - currentThreshold) / (nextThreshold - currentThreshold)) * 100,
      100
    );
  }

  return { currentRank, nextRank, progress };
}

export function getRankForPoints(points: number): string {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (points >= RANKS[i].threshold) {
      return RANKS[i].name;
    }
  }
  return RANKS[0].name;
}

export function calculatePoints(
  time: number,
  social: string,
  energy: string
): number {
  const timePoints: Record<number, number> = {
    5: 5,
    15: 10,
    30: 15,
    60: 25,
  };
  const levelPoints: Record<string, number> = {
    low: 5,
    medium: 10,
    high: 20,
  };

  return (
    (timePoints[time] ?? 10) +
    (levelPoints[social] ?? 5) +
    (levelPoints[energy] ?? 5)
  );
}

export { RANKS };
