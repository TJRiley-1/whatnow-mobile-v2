import 'dart:convert';
import 'package:drift/drift.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../data/database.dart';
import '../models/task.dart' as model;
import 'connectivity_provider.dart';
import 'task_provider.dart';

final databaseProvider = Provider<AppDatabase>((ref) {
  final db = AppDatabase();
  ref.onDispose(() => db.close());
  return db;
});

final syncProvider = Provider<SyncService>((ref) {
  return SyncService(ref);
});

class SyncService {
  final Ref _ref;

  SyncService(this._ref) {
    _ref.listen(connectivityProvider, (prev, next) {
      final wasOffline = prev?.valueOrNull == false;
      final isOnline = next.valueOrNull == true;
      if (wasOffline && isOnline) {
        replayQueue();
      }
    });
  }

  AppDatabase get _db => _ref.read(databaseProvider);
  SupabaseClient get _client => Supabase.instance.client;

  Future<void> cacheTasksFromRemote(List<model.Task> tasks) async {
    await _db.batch((batch) {
      batch.deleteAll(_db.cachedTasks);
      for (final task in tasks) {
        batch.insert(
          _db.cachedTasks,
          CachedTasksCompanion.insert(
            id: task.id,
            userId: task.userId,
            name: task.name,
            description: Value(task.description),
            typeRaw: task.typeRaw,
            time: task.time,
            social: task.social.name,
            energy: task.energy.name,
            dueDate: Value(task.dueDate?.toIso8601String()),
            recurring: Value(task.recurring.name),
            timesShown: Value(task.timesShown),
            timesSkipped: Value(task.timesSkipped),
            timesCompleted: Value(task.timesCompleted),
            pointsEarned: Value(task.pointsEarned),
            createdAt: task.createdAt.toIso8601String(),
            updatedAt: task.updatedAt.toIso8601String(),
          ),
        );
      }
    });
  }

  Future<List<model.Task>> getCachedTasks() async {
    final rows = await _db.select(_db.cachedTasks).get();
    return rows.map(_rowToTask).toList();
  }

  model.Task _rowToTask(CachedTask row) {
    return model.Task(
      id: row.id,
      userId: row.userId,
      name: row.name,
      description: row.description,
      typeRaw: row.typeRaw,
      time: row.time,
      social: model.Level.fromString(row.social),
      energy: model.Level.fromString(row.energy),
      dueDate: row.dueDate != null ? DateTime.parse(row.dueDate!) : null,
      recurring: model.Recurring.fromString(row.recurring),
      timesShown: row.timesShown,
      timesSkipped: row.timesSkipped,
      timesCompleted: row.timesCompleted,
      pointsEarned: row.pointsEarned,
      createdAt: DateTime.parse(row.createdAt),
      updatedAt: DateTime.parse(row.updatedAt),
    );
  }

  Future<void> enqueue(String action, Map<String, dynamic> payload) async {
    await _db.into(_db.offlineQueue).insert(
          OfflineQueueCompanion.insert(
            action: action,
            payload: jsonEncode(payload),
            createdAt: DateTime.now().toUtc().toIso8601String(),
          ),
        );
  }

  Future<void> replayQueue() async {
    final items = await (_db.select(_db.offlineQueue)
          ..orderBy([(t) => OrderingTerm.asc(t.id)]))
        .get();

    for (final item in items) {
      final payload = jsonDecode(item.payload) as Map<String, dynamic>;
      try {
        switch (item.action) {
          case 'insert':
            await _client.from('tasks').insert(payload);
          case 'update':
            final id = payload.remove('id') as String;
            await _client.from('tasks').update(payload).eq('id', id);
          case 'delete':
            await _client
                .from('tasks')
                .delete()
                .eq('id', payload['id'] as String);
        }
        await (_db.delete(_db.offlineQueue)
              ..where((t) => t.id.equals(item.id)))
            .go();
      } catch (_) {
        break; // Stop on first failure, retry later
      }
    }

    _ref.invalidate(taskListProvider);
  }
}
