class Profile {
  final String id;
  final String? email;
  final String? displayName;
  final String? avatarUrl;
  final int totalPoints;
  final int totalTasksCompleted;
  final int totalTimeSpent;
  final String currentRank;
  final bool isPremium;
  final DateTime createdAt;
  final DateTime updatedAt;

  const Profile({
    required this.id,
    this.email,
    this.displayName,
    this.avatarUrl,
    this.totalPoints = 0,
    this.totalTasksCompleted = 0,
    this.totalTimeSpent = 0,
    this.currentRank = 'Task Newbie',
    this.isPremium = false,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Profile.fromJson(Map<String, dynamic> json) {
    return Profile(
      id: json['id'] as String,
      email: json['email'] as String?,
      displayName: json['display_name'] as String?,
      avatarUrl: json['avatar_url'] as String?,
      totalPoints: json['total_points'] as int? ?? 0,
      totalTasksCompleted: json['total_tasks_completed'] as int? ?? 0,
      totalTimeSpent: json['total_time_spent'] as int? ?? 0,
      currentRank: json['current_rank'] as String? ?? 'Task Newbie',
      isPremium: json['is_premium'] as bool? ?? false,
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'display_name': displayName,
      'avatar_url': avatarUrl,
      'total_points': totalPoints,
      'total_tasks_completed': totalTasksCompleted,
      'total_time_spent': totalTimeSpent,
      'current_rank': currentRank,
      'is_premium': isPremium,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }
}
