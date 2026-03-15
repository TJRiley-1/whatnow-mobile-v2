import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../models/task.dart';
import '../../providers/filter_provider.dart';
import '../../providers/task_provider.dart';
import '../../widgets/banner_ad_widget.dart';
import '../../widgets/swipe_card.dart';

class WhatNowScreen extends ConsumerStatefulWidget {
  const WhatNowScreen({super.key});

  @override
  ConsumerState<WhatNowScreen> createState() => _WhatNowScreenState();
}

class _WhatNowScreenState extends ConsumerState<WhatNowScreen> {
  int _currentIndex = 0;
  Task? _chosenTask;

  void _onAccept(Task task) async {
    // Increment times_shown on the task
    try {
      await ref.read(taskListProvider.notifier).updateTask(Task(
            id: task.id,
            userId: task.userId,
            name: task.name,
            description: task.description,
            typeRaw: task.typeRaw,
            time: task.time,
            social: task.social,
            energy: task.energy,
            dueDate: task.dueDate,
            recurring: task.recurring,
            timesShown: task.timesShown + 1,
            timesSkipped: task.timesSkipped,
            timesCompleted: task.timesCompleted,
            pointsEarned: task.pointsEarned,
            createdAt: task.createdAt,
            updatedAt: DateTime.now().toUtc(),
          ));
    } catch (_) {}
    setState(() => _chosenTask = task);
  }

  void _onSkip(Task task) async {
    try {
      await ref.read(taskListProvider.notifier).updateTask(Task(
            id: task.id,
            userId: task.userId,
            name: task.name,
            description: task.description,
            typeRaw: task.typeRaw,
            time: task.time,
            social: task.social,
            energy: task.energy,
            dueDate: task.dueDate,
            recurring: task.recurring,
            timesShown: task.timesShown + 1,
            timesSkipped: task.timesSkipped + 1,
            timesCompleted: task.timesCompleted,
            pointsEarned: task.pointsEarned,
            createdAt: task.createdAt,
            updatedAt: DateTime.now().toUtc(),
          ));
    } catch (_) {}
    setState(() => _currentIndex++);
  }

  void _reset() {
    setState(() {
      _currentIndex = 0;
      _chosenTask = null;
    });
    ref.invalidate(taskListProvider);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final tasksAsync = ref.watch(filteredTasksProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('What Now?'),
        actions: [
          IconButton(
            icon: const Icon(Icons.tune),
            onPressed: () => _showFilterSheet(context),
          ),
        ],
      ),
      body: Column(
        children: [
          const BannerAdWidget(),
          Expanded(child: tasksAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(child: Text('Error: $error')),
        data: (tasks) {
          if (_chosenTask != null) {
            return _ChosenView(
              task: _chosenTask!,
              onReset: _reset,
            );
          }

          if (tasks.isEmpty) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.inbox_outlined,
                        size: 64, color: theme.colorScheme.outline),
                    const SizedBox(height: 16),
                    Text('No tasks match your filters',
                        style: theme.textTheme.titleMedium),
                    const SizedBox(height: 8),
                    Text('Try adjusting filters or add more tasks',
                        style: theme.textTheme.bodyMedium),
                    const SizedBox(height: 16),
                    TextButton(
                      onPressed: () =>
                          ref.read(filterProvider.notifier).clearAll(),
                      child: const Text('Clear Filters'),
                    ),
                  ],
                ),
              ),
            );
          }

          if (_currentIndex >= tasks.length) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.refresh,
                        size: 64, color: theme.colorScheme.outline),
                    const SizedBox(height: 16),
                    Text("You've seen all tasks",
                        style: theme.textTheme.titleMedium),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: _reset,
                      child: const Text('Start Over'),
                    ),
                  ],
                ),
              ),
            );
          }

          final task = tasks[_currentIndex];

          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
            child: Column(
              children: [
                // Progress indicator
                Text(
                  '${_currentIndex + 1} of ${tasks.length}',
                  style: theme.textTheme.bodyMedium
                      ?.copyWith(color: theme.colorScheme.outline),
                ),
                const SizedBox(height: 16),

                Expanded(
                  child: Center(
                    child: SwipeCard(
                      key: ValueKey(task.id),
                      task: task,
                      onAccept: () => _onAccept(task),
                      onSkip: () => _onSkip(task),
                    ),
                  ),
                ),

                const SizedBox(height: 16),

                // Button fallbacks for accessibility
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    OutlinedButton.icon(
                      onPressed: () => _onSkip(task),
                      icon: const Icon(Icons.close),
                      label: const Text('Skip'),
                      style: OutlinedButton.styleFrom(
                        minimumSize: const Size(140, 52),
                      ),
                    ),
                    FilledButton.icon(
                      onPressed: () => _onAccept(task),
                      icon: const Icon(Icons.check),
                      label: const Text("Let's Go"),
                      style: FilledButton.styleFrom(
                        minimumSize: const Size(140, 52),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          );
        },
      )),
        ],
      ),
    );
  }

  void _showFilterSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => DraggableScrollableSheet(
        expand: false,
        initialChildSize: 0.6,
        maxChildSize: 0.85,
        minChildSize: 0.4,
        builder: (context, scrollController) =>
            _FilterSheet(scrollController: scrollController),
      ),
    );
  }
}

class _ChosenView extends StatelessWidget {
  final Task task;
  final VoidCallback onReset;

  const _ChosenView({required this.task, required this.onReset});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final timeLabel =
        task.time >= 60 ? '${task.time ~/ 60}hr' : '${task.time}min';

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.rocket_launch,
                size: 48, color: theme.colorScheme.primary),
            const SizedBox(height: 16),
            Text("Let's do it!", style: theme.textTheme.titleLarge),
            const SizedBox(height: 24),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    Text(task.name,
                        style: theme.textTheme.titleMedium,
                        textAlign: TextAlign.center),
                    if (task.description != null) ...[
                      const SizedBox(height: 8),
                      Text(task.description!,
                          style: theme.textTheme.bodyMedium,
                          textAlign: TextAlign.center),
                    ],
                    const SizedBox(height: 16),
                    Text('Estimated time: $timeLabel',
                        style: theme.textTheme.bodyMedium?.copyWith(
                            color: theme.colorScheme.primary)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
            FilledButton.icon(
              onPressed: () => context.push('/timer', extra: task),
              icon: const Icon(Icons.play_arrow),
              label: const Text('Start Task'),
              style: FilledButton.styleFrom(
                  minimumSize: const Size(200, 52)),
            ),
            const SizedBox(height: 12),
            OutlinedButton(
              onPressed: onReset,
              style:
                  OutlinedButton.styleFrom(minimumSize: const Size(200, 52)),
              child: const Text('Pick Another'),
            ),
          ],
        ),
      ),
    );
  }
}

class _FilterSheet extends ConsumerWidget {
  final ScrollController scrollController;

  const _FilterSheet({required this.scrollController});

  static const _timeOptions = [
    (null, 'Any'),
    (15, '15min'),
    (30, '30min'),
    (60, '1hr'),
    (120, '2hr'),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final filters = ref.watch(filterProvider);
    final notifier = ref.read(filterProvider.notifier);

    return SingleChildScrollView(
      controller: scrollController,
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Filters', style: theme.textTheme.titleMedium),
              TextButton(
                onPressed: () {
                  notifier.clearAll();
                  Navigator.pop(context);
                },
                child: const Text('Clear All'),
              ),
            ],
          ),
          const SizedBox(height: 16),

          Text('Time Available', style: theme.textTheme.bodyLarge),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: _timeOptions.map((opt) {
              final (value, label) = opt;
              return ChoiceChip(
                label: Text(label),
                selected: filters.maxTime == value,
                onSelected: (_) => notifier.setMaxTime(value),
              );
            }).toList(),
          ),

          const SizedBox(height: 20),

          Text('Max Social Battery', style: theme.textTheme.bodyLarge),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            children: [
              ChoiceChip(
                label: const Text('Any'),
                selected: filters.maxSocial == null,
                onSelected: (_) => notifier.setMaxSocial(null),
              ),
              ...Level.values.map((l) => ChoiceChip(
                    label: Text(l.label),
                    selected: filters.maxSocial == l,
                    onSelected: (_) => notifier.setMaxSocial(l),
                  )),
            ],
          ),

          const SizedBox(height: 20),

          Text('Max Energy Level', style: theme.textTheme.bodyLarge),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            children: [
              ChoiceChip(
                label: const Text('Any'),
                selected: filters.maxEnergy == null,
                onSelected: (_) => notifier.setMaxEnergy(null),
              ),
              ...Level.values.map((l) => ChoiceChip(
                    label: Text(l.label),
                    selected: filters.maxEnergy == l,
                    onSelected: (_) => notifier.setMaxEnergy(l),
                  )),
            ],
          ),

          const SizedBox(height: 24),

          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Apply'),
          ),
          const SizedBox(height: 8),
        ],
      ),
    );
  }
}
