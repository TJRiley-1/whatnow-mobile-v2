import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/task.dart';
import 'auth_provider.dart';
import 'connectivity_provider.dart';
import 'sync_provider.dart';

final taskListProvider =
    AsyncNotifierProvider<TaskListNotifier, List<Task>>(TaskListNotifier.new);

class TaskListNotifier extends AsyncNotifier<List<Task>> {
  SupabaseClient get _client => Supabase.instance.client;

  bool get _isOnline =>
      ref.read(connectivityProvider).valueOrNull ?? true;

  SyncService get _sync => ref.read(syncProvider);

  @override
  Future<List<Task>> build() async {
    final user = ref.watch(currentUserProvider);
    if (user == null) return [];

    if (_isOnline) {
      try {
        final data = await _client
            .from('tasks')
            .select()
            .eq('user_id', user.id)
            .order('created_at', ascending: false);

        final tasks = data.map((json) => Task.fromJson(json)).toList();
        await _sync.cacheTasksFromRemote(tasks);
        return tasks;
      } catch (_) {
        return _sync.getCachedTasks();
      }
    } else {
      return _sync.getCachedTasks();
    }
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

    if (_isOnline) {
      await _client.from('tasks').insert(json);
    } else {
      await _sync.enqueue('insert', json);
    }
    ref.invalidateSelf();
  }

  Future<void> updateTask(Task task) async {
    final payload = task.toUpdateJson();
    if (_isOnline) {
      await _client
          .from('tasks')
          .update(payload)
          .eq('id', task.id);
    } else {
      payload['id'] = task.id;
      await _sync.enqueue('update', payload);
    }
    ref.invalidateSelf();
  }

  Future<void> deleteTask(String taskId) async {
    if (_isOnline) {
      await _client.from('tasks').delete().eq('id', taskId);
    } else {
      await _sync.enqueue('delete', {'id': taskId});
    }
    ref.invalidateSelf();
  }
}
