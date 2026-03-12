class Group {
  final String id;
  final String name;
  final String? description;
  final String inviteCode;
  final String? createdBy;
  final DateTime createdAt;

  const Group({
    required this.id,
    required this.name,
    this.description,
    required this.inviteCode,
    this.createdBy,
    required this.createdAt,
  });

  factory Group.fromJson(Map<String, dynamic> json) {
    return Group(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String?,
      inviteCode: json['invite_code'] as String,
      createdBy: json['created_by'] as String?,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }
}

class LeaderboardEntry {
  final String userId;
  final String? displayName;
  final String? avatarUrl;
  final String? currentRank;
  final int weeklyPoints;
  final int weeklyTasks;

  const LeaderboardEntry({
    required this.userId,
    this.displayName,
    this.avatarUrl,
    this.currentRank,
    required this.weeklyPoints,
    required this.weeklyTasks,
  });

  factory LeaderboardEntry.fromJson(Map<String, dynamic> json) {
    return LeaderboardEntry(
      userId: json['user_id'] as String,
      displayName: json['display_name'] as String?,
      avatarUrl: json['avatar_url'] as String?,
      currentRank: json['current_rank'] as String?,
      weeklyPoints: json['weekly_points'] as int? ?? 0,
      weeklyTasks: json['weekly_tasks'] as int? ?? 0,
    );
  }
}
