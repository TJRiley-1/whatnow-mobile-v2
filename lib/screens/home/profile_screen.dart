import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../config/ranks.dart';
import '../../providers/profile_provider.dart';
import '../../widgets/common/app_button.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profileAsync = ref.watch(profileProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: profileAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(child: Text('Error: $error')),
        data: (profile) {
          if (profile == null) {
            return const Center(child: Text('Profile not found'));
          }
          return Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                CircleAvatar(
                  radius: 48,
                  child: Text(
                    (profile.displayName ?? '?')[0].toUpperCase(),
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  profile.displayName ?? 'Unknown',
                  style: Theme.of(context).textTheme.titleMedium,
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 4),
                Text(
                  profile.email ?? '',
                  style: Theme.of(context).textTheme.bodyMedium,
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                Text(
                  profile.currentRank,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Theme.of(context).colorScheme.primary,
                      ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 24),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _StatItem(
                          label: 'Points',
                          value: '${profile.totalPoints}',
                        ),
                        _StatItem(
                          label: 'Completed',
                          value: '${profile.totalTasksCompleted}',
                        ),
                        _StatItem(
                          label: 'Hours',
                          value: '${(profile.totalTimeSpent / 60).floor()}',
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Builder(builder: (context) {
                  final next = nextRank(profile.totalPoints);
                  if (next == null) return const SizedBox.shrink();
                  final prevMin = ranks
                      .lastWhere((r) => r.minPoints <= profile.totalPoints)
                      .minPoints;
                  final progress = (profile.totalPoints - prevMin) /
                      (next.minPoints - prevMin);
                  return Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('Next: ${next.name}',
                                  style: Theme.of(context).textTheme.bodyMedium),
                              Text('${next.minPoints - profile.totalPoints} pts to go',
                                  style: Theme.of(context).textTheme.bodySmall),
                            ],
                          ),
                          const SizedBox(height: 8),
                          LinearProgressIndicator(
                            value: progress.clamp(0.0, 1.0),
                            minHeight: 8,
                            borderRadius: BorderRadius.circular(4),
                          ),
                        ],
                      ),
                    ),
                  );
                }),
                const SizedBox(height: 16),
                OutlinedButton.icon(
                  onPressed: () => context.push('/groups'),
                  icon: const Icon(Icons.group),
                  label: const Text('Groups & Leaderboards'),
                  style: OutlinedButton.styleFrom(
                    minimumSize: const Size(double.infinity, 52),
                  ),
                ),
                const Spacer(),
                AppButton(
                  label: 'Sign Out',
                  onPressed: () async {
                    await Supabase.instance.client.auth.signOut();
                  },
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final String label;
  final String value;

  const _StatItem({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(value, style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 4),
        Text(label, style: Theme.of(context).textTheme.bodyMedium),
      ],
    );
  }
}
