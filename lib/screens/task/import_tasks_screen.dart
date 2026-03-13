import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../models/task.dart';
import '../../providers/task_provider.dart';
import '../../widgets/common/app_button.dart';

class ImportTasksScreen extends ConsumerStatefulWidget {
  const ImportTasksScreen({super.key});

  @override
  ConsumerState<ImportTasksScreen> createState() => _ImportTasksScreenState();
}

class _ImportTasksScreenState extends ConsumerState<ImportTasksScreen> {
  final _controller = TextEditingController();
  TaskType _type = TaskType.personal;
  int _time = 15;
  Level _social = Level.low;
  Level _energy = Level.low;
  bool _isLoading = false;

  static const _maxTasks = 50;
  static const _timeOptions = [5, 10, 15, 30, 45, 60, 120];

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  List<String> get _taskNames {
    return _controller.text
        .split('\n')
        .map((line) => line.trim())
        .where((line) => line.isNotEmpty)
        .toList();
  }

  Future<void> _import() async {
    final names = _taskNames;
    if (names.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Enter at least one task name')),
      );
      return;
    }
    if (names.length > _maxTasks) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Maximum $_maxTasks tasks at a time')),
      );
      return;
    }

    setState(() => _isLoading = true);
    try {
      final notifier = ref.read(taskListProvider.notifier);
      for (final name in names) {
        await notifier.addTask(
          name: name,
          typeString: _type.name,
          time: _time,
          social: _social,
          energy: _energy,
        );
      }
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Imported ${names.length} tasks')),
        );
        context.pop();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Import failed: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final count = _taskNames.length;

    return Scaffold(
      appBar: AppBar(title: const Text('Import Tasks')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Enter one task per line (max $_maxTasks)',
              style: theme.textTheme.bodyMedium,
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _controller,
              maxLines: 10,
              decoration: InputDecoration(
                hintText: 'Buy groceries\nClean kitchen\nCall dentist',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 8),
            Text(
              '$count task${count == 1 ? '' : 's'} detected',
              style: theme.textTheme.bodySmall?.copyWith(
                color: theme.colorScheme.outline,
              ),
            ),

            const SizedBox(height: 24),
            Text('Default Type', style: theme.textTheme.titleMedium),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: TaskType.values
                  .where((t) => t != TaskType.other)
                  .map((t) {
                return ChoiceChip(
                  label: Text(t.label),
                  selected: t == _type,
                  onSelected: (_) => setState(() => _type = t),
                );
              }).toList(),
            ),

            const SizedBox(height: 24),
            Text('Default Time Estimate', style: theme.textTheme.titleMedium),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _timeOptions.map((t) {
                final label = t >= 60 ? '${t ~/ 60}hr' : '${t}min';
                return ChoiceChip(
                  label: Text(label),
                  selected: t == _time,
                  onSelected: (_) => setState(() => _time = t),
                );
              }).toList(),
            ),

            const SizedBox(height: 24),
            Text('Default Social Battery', style: theme.textTheme.titleMedium),
            const SizedBox(height: 8),
            SegmentedButton<Level>(
              segments: Level.values
                  .map((l) => ButtonSegment(value: l, label: Text(l.label)))
                  .toList(),
              selected: {_social},
              onSelectionChanged: (s) => setState(() => _social = s.first),
            ),

            const SizedBox(height: 24),
            Text('Default Energy', style: theme.textTheme.titleMedium),
            const SizedBox(height: 8),
            SegmentedButton<Level>(
              segments: Level.values
                  .map((l) => ButtonSegment(value: l, label: Text(l.label)))
                  .toList(),
              selected: {_energy},
              onSelectionChanged: (s) => setState(() => _energy = s.first),
            ),

            const SizedBox(height: 32),
            AppButton(
              label: 'Import ${count > 0 ? '$count ' : ''}Tasks',
              isLoading: _isLoading,
              onPressed: _import,
            ),
          ],
        ),
      ),
    );
  }
}
