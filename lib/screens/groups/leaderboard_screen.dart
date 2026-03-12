import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../models/group.dart';
import '../../providers/group_provider.dart';
import '../../providers/auth_provider.dart';

class LeaderboardScreen extends ConsumerWidget {
  final Group group;

  const LeaderboardScreen({super.key, required this.group});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final leaderboardAsync = ref.watch(leaderboardProvider(group.id));
    final currentUser = ref.watch(currentUserProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text(group.name),
        actions: [
          IconButton(
            icon: const Icon(Icons.share),
            tooltip: 'Share invite code',
            onPressed: () {
              Clipboard.setData(ClipboardData(text: group.inviteCode));
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                    content:
                        Text('Invite code copied: ${group.inviteCode}')),
              );
            },
          ),
          PopupMenuButton(
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'leave',
                child: Text('Leave Group'),
              ),
            ],
            onSelected: (value) async {
              if (value == 'leave') {
                final confirm = await showDialog<bool>(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text('Leave Group'),
                    content: const Text(
                        'Are you sure you want to leave this group?'),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context, false),
                        child: const Text('Cancel'),
                      ),
                      TextButton(
                        onPressed: () => Navigator.pop(context, true),
                        child: const Text('Leave'),
                      ),
                    ],
                  ),
                );
                if (confirm == true && context.mounted) {
                  await ref
                      .read(userGroupsProvider.notifier)
                      .leaveGroup(group.id);
                  if (context.mounted) Navigator.pop(context);
                }
              }
            },
          ),
        ],
      ),
      body: leaderboardAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
        data: (entries) {
          if (entries.isEmpty) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.leaderboard_outlined,
                        size: 64, color: theme.colorScheme.outline),
                    const SizedBox(height: 16),
                    Text('No activity this week',
                        style: theme.textTheme.titleMedium),
                    const SizedBox(height: 8),
                    Text('Complete tasks to appear on the leaderboard',
                        style: theme.textTheme.bodyMedium,
                        textAlign: TextAlign.center),
                  ],
                ),
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: entries.length,
            itemBuilder: (context, index) {
              final entry = entries[index];
              final isCurrentUser = entry.userId == currentUser?.id;
              final rank = index + 1;

              return Card(
                color: isCurrentUser
                    ? theme.colorScheme.primaryContainer.withValues(alpha: 0.3)
                    : null,
                margin: const EdgeInsets.symmetric(vertical: 4),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: [
                      SizedBox(
                        width: 36,
                        child: Text(
                          rank <= 3
                              ? ['🥇', '🥈', '🥉'][rank - 1]
                              : '#$rank',
                          style: rank <= 3
                              ? const TextStyle(fontSize: 24)
                              : theme.textTheme.titleMedium,
                          textAlign: TextAlign.center,
                        ),
                      ),
                      const SizedBox(width: 12),
                      CircleAvatar(
                        radius: 20,
                        child: Text(
                          (entry.displayName ?? '?')[0].toUpperCase(),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              entry.displayName ?? 'Unknown',
                              style: theme.textTheme.titleSmall?.copyWith(
                                fontWeight: isCurrentUser
                                    ? FontWeight.bold
                                    : FontWeight.normal,
                              ),
                            ),
                            Text(
                              entry.currentRank ?? '',
                              style: theme.textTheme.bodySmall?.copyWith(
                                  color: theme.colorScheme.outline),
                            ),
                          ],
                        ),
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            '${entry.weeklyPoints}',
                            style: theme.textTheme.titleMedium?.copyWith(
                              color: theme.colorScheme.primary,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            '${entry.weeklyTasks} tasks',
                            style: theme.textTheme.bodySmall,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
