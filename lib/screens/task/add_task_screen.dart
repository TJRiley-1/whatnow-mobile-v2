import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../models/task.dart';
import '../../providers/task_provider.dart';
import '../../widgets/common/app_button.dart';
import '../../widgets/common/app_text_field.dart';

class AddTaskScreen extends ConsumerStatefulWidget {
  const AddTaskScreen({super.key});

  @override
  ConsumerState<AddTaskScreen> createState() => _AddTaskScreenState();
}

class _AddTaskScreenState extends ConsumerState<AddTaskScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _customTypeController = TextEditingController();

  TaskType _type = TaskType.personal;
  int _time = 15;
  Level _social = Level.low;
  Level _energy = Level.low;
  Recurring _recurring = Recurring.none;
  bool _isLoading = false;

  static const _timeOptions = [5, 10, 15, 30, 45, 60, 120];

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
      await ref.read(taskListProvider.notifier).addTask(
            name: _nameController.text.trim(),
            description: _descriptionController.text.trim().isEmpty
                ? null
                : _descriptionController.text.trim(),
            typeString: _resolvedType,
            time: _time,
            social: _social,
            energy: _energy,
            recurring: _recurring,
          );
      if (mounted) context.pop();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to add task: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Add Task')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Type selection — easy single-tap first
              Text('Task Type', style: theme.textTheme.titleMedium),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: TaskType.values.map((t) {
                  final selected = t == _type;
                  return ChoiceChip(
                    label: Text(t.label),
                    selected: selected,
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

              // Time estimate — single-tap
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

              // Social battery — single-tap
              Text('Social Battery Required', style: theme.textTheme.titleMedium),
              const SizedBox(height: 8),
              SegmentedButton<Level>(
                segments: Level.values
                    .map((l) => ButtonSegment(value: l, label: Text(l.label)))
                    .toList(),
                selected: {_social},
                onSelectionChanged: (s) => setState(() => _social = s.first),
              ),

              const SizedBox(height: 24),

              // Energy level — single-tap
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

              // Recurring
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

              // Name — text entry after easy questions
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
                label: 'Add Task',
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
