import 'package:drift/drift.dart';
import 'package:drift_flutter/drift_flutter.dart';

part 'database.g.dart';

class CachedTasks extends Table {
  TextColumn get id => text()();
  TextColumn get userId => text()();
  TextColumn get name => text()();
  TextColumn get description => text().nullable()();
  TextColumn get typeRaw => text()();
  IntColumn get time => integer()();
  TextColumn get social => text()();
  TextColumn get energy => text()();
  TextColumn get dueDate => text().nullable()();
  TextColumn get recurring => text().withDefault(const Constant('none'))();
  IntColumn get timesShown => integer().withDefault(const Constant(0))();
  IntColumn get timesSkipped => integer().withDefault(const Constant(0))();
  IntColumn get timesCompleted => integer().withDefault(const Constant(0))();
  IntColumn get pointsEarned => integer().withDefault(const Constant(0))();
  TextColumn get createdAt => text()();
  TextColumn get updatedAt => text()();

  @override
  Set<Column> get primaryKey => {id};
}

class OfflineQueue extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get action => text()(); // insert, update, delete
  TextColumn get payload => text()(); // JSON-encoded task data
  TextColumn get createdAt => text()();
}

@DriftDatabase(tables: [CachedTasks, OfflineQueue])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 1;

  static QueryExecutor _openConnection() {
    return driftDatabase(name: 'whatnow_db');
  }
}
