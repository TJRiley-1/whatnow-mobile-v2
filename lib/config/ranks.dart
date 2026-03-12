class Rank {
  final String name;
  final int minPoints;

  const Rank(this.name, this.minPoints);
}

const ranks = [
  Rank('Task Newbie', 0),
  Rank('Getting Started', 50),
  Rank('Task Tackler', 150),
  Rank('Momentum Builder', 300),
  Rank('Focus Fighter', 500),
  Rank('Productivity Pro', 800),
  Rank('Task Master', 1200),
  Rank('Unstoppable Force', 1800),
  Rank('Legend', 2500),
];

String rankForPoints(int points) {
  String result = ranks.first.name;
  for (final rank in ranks) {
    if (points >= rank.minPoints) {
      result = rank.name;
    } else {
      break;
    }
  }
  return result;
}

Rank? nextRank(int points) {
  for (final rank in ranks) {
    if (points < rank.minPoints) return rank;
  }
  return null;
}
