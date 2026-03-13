import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../models/task.dart';
import '../../providers/task_provider.dart';
import '../../widgets/common/app_button.dart';
import '../../widgets/common/app_text_field.dart';

class EditTaskScreen extends ConsumerStatefulWidget {
  final Task task;

  const EditTaskScreen({super.key, required this.task});

  @override
  ConsumerState<EditTaskScreen> createState() => _EditTaskScreenState();
}

class _EditTaskScreenState extends ConsumerState<EditTaskScreen> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _nameController;
  late final TextEditingController _descriptionController;
  late final TextEditingController _customTypeController;

  late TaskType _type;
  late int _time;
  late Level _social;
  late Level _energy;
  late Recurring _recurring;
  bool _isLoading = false;

  static const _timeOptions = [5, 10, 15, 30, 45, 60, 120];

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.task.name);
    _descriptionController =
        TextEditingController(text: widget.task.description ?? '');
    _type = widget.task.type;
    // If it's a custom type (not a known enum name), pre-fill the custom field
    _customTypeController = TextEditingController(
      text: _type == TaskType.other && widget.task.typeRaw != 'other'
          ? widget.task.typeRaw
          : '',
    );
    _time = widget.task.time;
    _social = widget.task.social;
    _energy = widget.task.energy;
    _recurring = widget.task.recurring;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _descriptionController.dispose();
    _customTypeController.dispose();
    super.dispose();
  }

  String get _resolvedType {
    if (_type == TaskType.other && _customTypeController.text.trim().isNotEmpty) {
      return _customTypeController.text.trim();
    }
    return _type.name;
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    if (_type == TaskType.other && _customTypeController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a custom type name')),
      );
      return;
    }

    setState(() => _isLoading = true);
    try {
      final updated = Task(
        id: widget.task.id,
        userId: widget.task.userId,
        name: _nameController.text.trim(),
        description: _descriptionController.text.trim().isEmpty
            ? null
            : _descriptionController.text.trim(),
        typeRaw: _resolvedType,
        time: _time,
        social: _social,
        energy: _energy,
        dueDate: widget.task.dueDate,
        recurring: _recurring,
        timesShown: widget.task.timesShown,
        timesSkipped: widget.task.timesSkipped,
        timesCompleted: widget.task.timesCompleted,
        pointsEarned: widget.task.pointsEarned,
        createdAt: widget.task.createdAt,
        updatedAt: DateTime.now().toUtc(),
      );
      await ref.read(taskListProvider.notifier).updateTask(updated);
      if (mounted) context.pop();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to update task: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _delete() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Task'),
        content: const Text('Are you sure you want to delete this task?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirm != true) return;

    try {
      await ref.read(taskListProvider.notifier).deleteTask(widget.task.id);
      if (mounted) context.pop();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to delete task: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Task'),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_outline),
            onPressed: _delete,
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Task Type', style: theme.textTheme.titleMedium),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: TaskType.values.map((t) {
                  return ChoiceChip(
                    label: Text(t.label),
                    selected: t == _type,
                    onSelected: (_) => setState(() => _type = t),
                  );
                }).toList(),
              ),

              if (_type == TaskType.other) ...[
                const SizedBox(height: 12),
                AppTextField(
                  controller: _customTypeController,
                  labelText: 'Custom Type Name',
                  textInputAction: TextInputAction.next,
                ),
              ],

              const SizedBox(height: 24),

              Text('Time Estimate', style: theme.textTheme.titleMedium),
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

              Text('Social Battery Required',
                  style: theme.textTheme.titleMedium),
              const SizedBox(height: 8),
              SegmentedButton<Level>(
                segments: Level.values
                    .map((l) => ButtonSegment(value: l, label: Text(l.label)))
                    .toList(),
                selected: {_social},
                onSelectionChanged: (s) => setState(() => _social = s.first),
              ),

              const SizedBox(height: 24),

              Text('Energy Required', style: theme.textTheme.titleMedium),
              const SizedBox(height: 8),
              SegmentedButton<Level>(
                segments: Level.values
                    .map((l) => ButtonSegment(value: l, label: Text(l.label)))
                    .toList(),
                selected: {_energy},
                onSelectionChanged: (s) => setState(() => _energy = s.first),
              ),

              const SizedBox(height: 24),

              Text('Recurring', style: theme.textTheme.titleMedium),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: Recurring.values.map((r) {
                  return ChoiceChip(
                    label: Text(r.label),
                    selected: r == _recurring,
                    onSelected: (_) => setState(() => _recurring = r),
                  );
                }).toList(),
              ),

              const SizedBox(height: 24),

              AppTextField(
                controller: _nameController,
                labelText: 'Task Name',
                textInputAction: TextInputAction.next,
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Task name is required';
                  }
                  return null;
                },
              ),

              const SizedBox(height: 16),

              AppTextField(
                controller: _descriptionController,
                labelText: 'Description (optional)',
                textInputAction: TextInputAction.done,
              ),

              const SizedBox(height: 32),

              AppButton(
                label: 'Save Changes',
                isLoading: _isLoading,
                onPressed: _save,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
