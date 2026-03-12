import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/task.dart';
import 'auth_provider.dart';

final taskListProvider =
    AsyncNotifierProvider<TaskListNotifier, List<Task>>(TaskListNotifier.new);

class TaskListNotifier extends AsyncNotifier<List<Task>> {
  SupabaseClient get _client => Supabase.instance.client;

  @override
  Future<List<Task>> build() async {
    final user = ref.watch(currentUserProvider);
    if (user == null) return [];

    final data = await _client
        .from('tasks')
        .select()
        .eq('user_id', user.id)
        .order('created_at', ascending: false);

    return data.map((json) => Task.fromJson(json)).toList();
  }

  Future<void> addTask({
    required String name,
    String? description,
    required String typeString,
    required int time,
    required Level social,
    required Level energy,
    DateTime? dueDate,
    Recurring recurring = Recurring.none,
  }) async {
    final user = ref.read(currentUserProvider);
    if (user == null) return;

    final json = {
      'user_id': user.id,
      'name': name,
      'description': description,
      'type': typeString,
      'time': time,
      'social': social.name,
      'energy': energy.name,
      'due_date': dueDate?.toIso8601String().split('T').first,
      'recurring': recurring.name,
    };

    await _client.from('tasks').insert(json);
    ref.invalidateSelf();
  }

  Future<void> updateTask(Task task) async {
    await _client
        .from('tasks')
        .update(task.toUpdateJson())
        .eq('id', task.id);
    ref.invalidateSelf();
  }

  Future<void> deleteTask(String taskId) async {
    await _client.from('tasks').delete().eq('id', taskId);
    ref.invalidateSelf();
  }
}
