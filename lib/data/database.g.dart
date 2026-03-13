// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'database.dart';

// ignore_for_file: type=lint
class $CachedTasksTable extends CachedTasks
    with TableInfo<$CachedTasksTable, CachedTask> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $CachedTasksTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _userIdMeta = const VerificationMeta('userId');
  @override
  late final GeneratedColumn<String> userId = GeneratedColumn<String>(
    'user_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _nameMeta = const VerificationMeta('name');
  @override
  late final GeneratedColumn<String> name = GeneratedColumn<String>(
    'name',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _descriptionMeta = const VerificationMeta(
    'description',
  );
  @override
  late final GeneratedColumn<String> description = GeneratedColumn<String>(
    'description',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _typeRawMeta = const VerificationMeta(
    'typeRaw',
  );
  @override
  late final GeneratedColumn<String> typeRaw = GeneratedColumn<String>(
    'type_raw',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _timeMeta = const VerificationMeta('time');
  @override
  late final GeneratedColumn<int> time = GeneratedColumn<int>(
    'time',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _socialMeta = const VerificationMeta('social');
  @override
  late final GeneratedColumn<String> social = GeneratedColumn<String>(
    'social',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _energyMeta = const VerificationMeta('energy');
  @override
  late final GeneratedColumn<String> energy = GeneratedColumn<String>(
    'energy',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _dueDateMeta = const VerificationMeta(
    'dueDate',
  );
  @override
  late final GeneratedColumn<String> dueDate = GeneratedColumn<String>(
    'due_date',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _recurringMeta = const VerificationMeta(
    'recurring',
  );
  @override
  late final GeneratedColumn<String> recurring = GeneratedColumn<String>(
    'recurring',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
    defaultValue: const Constant('none'),
  );
  static const VerificationMeta _timesShownMeta = const VerificationMeta(
    'timesShown',
  );
  @override
  late final GeneratedColumn<int> timesShown = GeneratedColumn<int>(
    'times_shown',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
    defaultValue: const Constant(0),
  );
  static const VerificationMeta _timesSkippedMeta = const VerificationMeta(
    'timesSkipped',
  );
  @override
  late final GeneratedColumn<int> timesSkipped = GeneratedColumn<int>(
    'times_skipped',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
    defaultValue: const Constant(0),
  );
  static const VerificationMeta _timesCompletedMeta = const VerificationMeta(
    'timesCompleted',
  );
  @override
  late final GeneratedColumn<int> timesCompleted = GeneratedColumn<int>(
    'times_completed',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
    defaultValue: const Constant(0),
  );
  static const VerificationMeta _pointsEarnedMeta = const VerificationMeta(
    'pointsEarned',
  );
  @override
  late final GeneratedColumn<int> pointsEarned = GeneratedColumn<int>(
    'points_earned',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
    defaultValue: const Constant(0),
  );
  static const VerificationMeta _createdAtMeta = const VerificationMeta(
    'createdAt',
  );
  @override
  late final GeneratedColumn<String> createdAt = GeneratedColumn<String>(
    'created_at',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _updatedAtMeta = const VerificationMeta(
    'updatedAt',
  );
  @override
  late final GeneratedColumn<String> updatedAt = GeneratedColumn<String>(
    'updated_at',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    userId,
    name,
    description,
    typeRaw,
    time,
    social,
    energy,
    dueDate,
    recurring,
    timesShown,
    timesSkipped,
    timesCompleted,
    pointsEarned,
    createdAt,
    updatedAt,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'cached_tasks';
  @override
  VerificationContext validateIntegrity(
    Insertable<CachedTask> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('user_id')) {
      context.handle(
        _userIdMeta,
        userId.isAcceptableOrUnknown(data['user_id']!, _userIdMeta),
      );
    } else if (isInserting) {
      context.missing(_userIdMeta);
    }
    if (data.containsKey('name')) {
      context.handle(
        _nameMeta,
        name.isAcceptableOrUnknown(data['name']!, _nameMeta),
      );
    } else if (isInserting) {
      context.missing(_nameMeta);
    }
    if (data.containsKey('description')) {
      context.handle(
        _descriptionMeta,
        description.isAcceptableOrUnknown(
          data['description']!,
          _descriptionMeta,
        ),
      );
    }
    if (data.containsKey('type_raw')) {
      context.handle(
        _typeRawMeta,
        typeRaw.isAcceptableOrUnknown(data['type_raw']!, _typeRawMeta),
      );
    } else if (isInserting) {
      context.missing(_typeRawMeta);
    }
    if (data.containsKey('time')) {
      context.handle(
        _timeMeta,
        time.isAcceptableOrUnknown(data['time']!, _timeMeta),
      );
    } else if (isInserting) {
      context.missing(_timeMeta);
    }
    if (data.containsKey('social')) {
      context.handle(
        _socialMeta,
        social.isAcceptableOrUnknown(data['social']!, _socialMeta),
      );
    } else if (isInserting) {
      context.missing(_socialMeta);
    }
    if (data.containsKey('energy')) {
      context.handle(
        _energyMeta,
        energy.isAcceptableOrUnknown(data['energy']!, _energyMeta),
      );
    } else if (isInserting) {
      context.missing(_energyMeta);
    }
    if (data.containsKey('due_date')) {
      context.handle(
        _dueDateMeta,
        dueDate.isAcceptableOrUnknown(data['due_date']!, _dueDateMeta),
      );
    }
    if (data.containsKey('recurring')) {
      context.handle(
        _recurringMeta,
        recurring.isAcceptableOrUnknown(data['recurring']!, _recurringMeta),
      );
    }
    if (data.containsKey('times_shown')) {
      context.handle(
        _timesShownMeta,
        timesShown.isAcceptableOrUnknown(data['times_shown']!, _timesShownMeta),
      );
    }
    if (data.containsKey('times_skipped')) {
      context.handle(
        _timesSkippedMeta,
        timesSkipped.isAcceptableOrUnknown(
          data['times_skipped']!,
          _timesSkippedMeta,
        ),
      );
    }
    if (data.containsKey('times_completed')) {
      context.handle(
        _timesCompletedMeta,
        timesCompleted.isAcceptableOrUnknown(
          data['times_completed']!,
          _timesCompletedMeta,
        ),
      );
    }
    if (data.containsKey('points_earned')) {
      context.handle(
        _pointsEarnedMeta,
        pointsEarned.isAcceptableOrUnknown(
          data['points_earned']!,
          _pointsEarnedMeta,
        ),
      );
    }
    if (data.containsKey('created_at')) {
      context.handle(
        _createdAtMeta,
        createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta),
      );
    } else if (isInserting) {
      context.missing(_createdAtMeta);
    }
    if (data.containsKey('updated_at')) {
      context.handle(
        _updatedAtMeta,
        updatedAt.isAcceptableOrUnknown(data['updated_at']!, _updatedAtMeta),
      );
    } else if (isInserting) {
      context.missing(_updatedAtMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  CachedTask map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return CachedTask(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      userId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}user_id'],
      )!,
      name: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}name'],
      )!,
      description: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}description'],
      ),
      typeRaw: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}type_raw'],
      )!,
      time: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}time'],
      )!,
      social: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}social'],
      )!,
      energy: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}energy'],
      )!,
      dueDate: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}due_date'],
      ),
      recurring: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}recurring'],
      )!,
      timesShown: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}times_shown'],
      )!,
      timesSkipped: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}times_skipped'],
      )!,
      timesCompleted: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}times_completed'],
      )!,
      pointsEarned: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}points_earned'],
      )!,
      createdAt: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}created_at'],
      )!,
      updatedAt: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}updated_at'],
      )!,
    );
  }

  @override
  $CachedTasksTable createAlias(String alias) {
    return $CachedTasksTable(attachedDatabase, alias);
  }
}

class CachedTask extends DataClass implements Insertable<CachedTask> {
  final String id;
  final String userId;
  final String name;
  final String? description;
  final String typeRaw;
  final int time;
  final String social;
  final String energy;
  final String? dueDate;
  final String recurring;
  final int timesShown;
  final int timesSkipped;
  final int timesCompleted;
  final int pointsEarned;
  final String createdAt;
  final String updatedAt;
  const CachedTask({
    required this.id,
    required this.userId,
    required this.name,
    this.description,
    required this.typeRaw,
    required this.time,
    required this.social,
    required this.energy,
    this.dueDate,
    required this.recurring,
    required this.timesShown,
    required this.timesSkipped,
    required this.timesCompleted,
    required this.pointsEarned,
    required this.createdAt,
    required this.updatedAt,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['user_id'] = Variable<String>(userId);
    map['name'] = Variable<String>(name);
    if (!nullToAbsent || description != null) {
      map['description'] = Variable<String>(description);
    }
    map['type_raw'] = Variable<String>(typeRaw);
    map['time'] = Variable<int>(time);
    map['social'] = Variable<String>(social);
    map['energy'] = Variable<String>(energy);
    if (!nullToAbsent || dueDate != null) {
      map['due_date'] = Variable<String>(dueDate);
    }
    map['recurring'] = Variable<String>(recurring);
    map['times_shown'] = Variable<int>(timesShown);
    map['times_skipped'] = Variable<int>(timesSkipped);
    map['times_completed'] = Variable<int>(timesCompleted);
    map['points_earned'] = Variable<int>(pointsEarned);
    map['created_at'] = Variable<String>(createdAt);
    map['updated_at'] = Variable<String>(updatedAt);
    return map;
  }

  CachedTasksCompanion toCompanion(bool nullToAbsent) {
    return CachedTasksCompanion(
      id: Value(id),
      userId: Value(userId),
      name: Value(name),
      description: description == null && nullToAbsent
          ? const Value.absent()
          : Value(description),
      typeRaw: Value(typeRaw),
      time: Value(time),
      social: Value(social),
      energy: Value(energy),
      dueDate: dueDate == null && nullToAbsent
          ? const Value.absent()
          : Value(dueDate),
      recurring: Value(recurring),
      timesShown: Value(timesShown),
      timesSkipped: Value(timesSkipped),
      timesCompleted: Value(timesCompleted),
      pointsEarned: Value(pointsEarned),
      createdAt: Value(createdAt),
      updatedAt: Value(updatedAt),
    );
  }

  factory CachedTask.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return CachedTask(
      id: serializer.fromJson<String>(json['id']),
      userId: serializer.fromJson<String>(json['userId']),
      name: serializer.fromJson<String>(json['name']),
      description: serializer.fromJson<String?>(json['description']),
      typeRaw: serializer.fromJson<String>(json['typeRaw']),
      time: serializer.fromJson<int>(json['time']),
      social: serializer.fromJson<String>(json['social']),
      energy: serializer.fromJson<String>(json['energy']),
      dueDate: serializer.fromJson<String?>(json['dueDate']),
      recurring: serializer.fromJson<String>(json['recurring']),
      timesShown: serializer.fromJson<int>(json['timesShown']),
      timesSkipped: serializer.fromJson<int>(json['timesSkipped']),
      timesCompleted: serializer.fromJson<int>(json['timesCompleted']),
      pointsEarned: serializer.fromJson<int>(json['pointsEarned']),
      createdAt: serializer.fromJson<String>(json['createdAt']),
      updatedAt: serializer.fromJson<String>(json['updatedAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'userId': serializer.toJson<String>(userId),
      'name': serializer.toJson<String>(name),
      'description': serializer.toJson<String?>(description),
      'typeRaw': serializer.toJson<String>(typeRaw),
      'time': serializer.toJson<int>(time),
      'social': serializer.toJson<String>(social),
      'energy': serializer.toJson<String>(energy),
      'dueDate': serializer.toJson<String?>(dueDate),
      'recurring': serializer.toJson<String>(recurring),
      'timesShown': serializer.toJson<int>(timesShown),
      'timesSkipped': serializer.toJson<int>(timesSkipped),
      'timesCompleted': serializer.toJson<int>(timesCompleted),
      'pointsEarned': serializer.toJson<int>(pointsEarned),
      'createdAt': serializer.toJson<String>(createdAt),
      'updatedAt': serializer.toJson<String>(updatedAt),
    };
  }

  CachedTask copyWith({
    String? id,
    String? userId,
    String? name,
    Value<String?> description = const Value.absent(),
    String? typeRaw,
    int? time,
    String? social,
    String? energy,
    Value<String?> dueDate = const Value.absent(),
    String? recurring,
    int? timesShown,
    int? timesSkipped,
    int? timesCompleted,
    int? pointsEarned,
    String? createdAt,
    String? updatedAt,
  }) => CachedTask(
    id: id ?? this.id,
    userId: userId ?? this.userId,
    name: name ?? this.name,
    description: description.present ? description.value : this.description,
    typeRaw: typeRaw ?? this.typeRaw,
    time: time ?? this.time,
    social: social ?? this.social,
    energy: energy ?? this.energy,
    dueDate: dueDate.present ? dueDate.value : this.dueDate,
    recurring: recurring ?? this.recurring,
    timesShown: timesShown ?? this.timesShown,
    timesSkipped: timesSkipped ?? this.timesSkipped,
    timesCompleted: timesCompleted ?? this.timesCompleted,
    pointsEarned: pointsEarned ?? this.pointsEarned,
    createdAt: createdAt ?? this.createdAt,
    updatedAt: updatedAt ?? this.updatedAt,
  );
  CachedTask copyWithCompanion(CachedTasksCompanion data) {
    return CachedTask(
      id: data.id.present ? data.id.value : this.id,
      userId: data.userId.present ? data.userId.value : this.userId,
      name: data.name.present ? data.name.value : this.name,
      description: data.description.present
          ? data.description.value
          : this.description,
      typeRaw: data.typeRaw.present ? data.typeRaw.value : this.typeRaw,
      time: data.time.present ? data.time.value : this.time,
      social: data.social.present ? data.social.value : this.social,
      energy: data.energy.present ? data.energy.value : this.energy,
      dueDate: data.dueDate.present ? data.dueDate.value : this.dueDate,
      recurring: data.recurring.present ? data.recurring.value : this.recurring,
      timesShown: data.timesShown.present
          ? data.timesShown.value
          : this.timesShown,
      timesSkipped: data.timesSkipped.present
          ? data.timesSkipped.value
          : this.timesSkipped,
      timesCompleted: data.timesCompleted.present
          ? data.timesCompleted.value
          : this.timesCompleted,
      pointsEarned: data.pointsEarned.present
          ? data.pointsEarned.value
          : this.pointsEarned,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
      updatedAt: data.updatedAt.present ? data.updatedAt.value : this.updatedAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('CachedTask(')
          ..write('id: $id, ')
          ..write('userId: $userId, ')
          ..write('name: $name, ')
          ..write('description: $description, ')
          ..write('typeRaw: $typeRaw, ')
          ..write('time: $time, ')
          ..write('social: $social, ')
          ..write('energy: $energy, ')
          ..write('dueDate: $dueDate, ')
          ..write('recurring: $recurring, ')
          ..write('timesShown: $timesShown, ')
          ..write('timesSkipped: $timesSkipped, ')
          ..write('timesCompleted: $timesCompleted, ')
          ..write('pointsEarned: $pointsEarned, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    userId,
    name,
    description,
    typeRaw,
    time,
    social,
    energy,
    dueDate,
    recurring,
    timesShown,
    timesSkipped,
    timesCompleted,
    pointsEarned,
    createdAt,
    updatedAt,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is CachedTask &&
          other.id == this.id &&
          other.userId == this.userId &&
          other.name == this.name &&
          other.description == this.description &&
          other.typeRaw == this.typeRaw &&
          other.time == this.time &&
          other.social == this.social &&
          other.energy == this.energy &&
          other.dueDate == this.dueDate &&
          other.recurring == this.recurring &&
          other.timesShown == this.timesShown &&
          other.timesSkipped == this.timesSkipped &&
          other.timesCompleted == this.timesCompleted &&
          other.pointsEarned == this.pointsEarned &&
          other.createdAt == this.createdAt &&
          other.updatedAt == this.updatedAt);
}

class CachedTasksCompanion extends UpdateCompanion<CachedTask> {
  final Value<String> id;
  final Value<String> userId;
  final Value<String> name;
  final Value<String?> description;
  final Value<String> typeRaw;
  final Value<int> time;
  final Value<String> social;
  final Value<String> energy;
  final Value<String?> dueDate;
  final Value<String> recurring;
  final Value<int> timesShown;
  final Value<int> timesSkipped;
  final Value<int> timesCompleted;
  final Value<int> pointsEarned;
  final Value<String> createdAt;
  final Value<String> updatedAt;
  final Value<int> rowid;
  const CachedTasksCompanion({
    this.id = const Value.absent(),
    this.userId = const Value.absent(),
    this.name = const Value.absent(),
    this.description = const Value.absent(),
    this.typeRaw = const Value.absent(),
    this.time = const Value.absent(),
    this.social = const Value.absent(),
    this.energy = const Value.absent(),
    this.dueDate = const Value.absent(),
    this.recurring = const Value.absent(),
    this.timesShown = const Value.absent(),
    this.timesSkipped = const Value.absent(),
    this.timesCompleted = const Value.absent(),
    this.pointsEarned = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.updatedAt = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  CachedTasksCompanion.insert({
    required String id,
    required String userId,
    required String name,
    this.description = const Value.absent(),
    required String typeRaw,
    required int time,
    required String social,
    required String energy,
    this.dueDate = const Value.absent(),
    this.recurring = const Value.absent(),
    this.timesShown = const Value.absent(),
    this.timesSkipped = const Value.absent(),
    this.timesCompleted = const Value.absent(),
    this.pointsEarned = const Value.absent(),
    required String createdAt,
    required String updatedAt,
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       userId = Value(userId),
       name = Value(name),
       typeRaw = Value(typeRaw),
       time = Value(time),
       social = Value(social),
       energy = Value(energy),
       createdAt = Value(createdAt),
       updatedAt = Value(updatedAt);
  static Insertable<CachedTask> custom({
    Expression<String>? id,
    Expression<String>? userId,
    Expression<String>? name,
    Expression<String>? description,
    Expression<String>? typeRaw,
    Expression<int>? time,
    Expression<String>? social,
    Expression<String>? energy,
    Expression<String>? dueDate,
    Expression<String>? recurring,
    Expression<int>? timesShown,
    Expression<int>? timesSkipped,
    Expression<int>? timesCompleted,
    Expression<int>? pointsEarned,
    Expression<String>? createdAt,
    Expression<String>? updatedAt,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (userId != null) 'user_id': userId,
      if (name != null) 'name': name,
      if (description != null) 'description': description,
      if (typeRaw != null) 'type_raw': typeRaw,
      if (time != null) 'time': time,
      if (social != null) 'social': social,
      if (energy != null) 'energy': energy,
      if (dueDate != null) 'due_date': dueDate,
      if (recurring != null) 'recurring': recurring,
      if (timesShown != null) 'times_shown': timesShown,
      if (timesSkipped != null) 'times_skipped': timesSkipped,
      if (timesCompleted != null) 'times_completed': timesCompleted,
      if (pointsEarned != null) 'points_earned': pointsEarned,
      if (createdAt != null) 'created_at': createdAt,
      if (updatedAt != null) 'updated_at': updatedAt,
      if (rowid != null) 'rowid': rowid,
    });
  }

  CachedTasksCompanion copyWith({
    Value<String>? id,
    Value<String>? userId,
    Value<String>? name,
    Value<String?>? description,
    Value<String>? typeRaw,
    Value<int>? time,
    Value<String>? social,
    Value<String>? energy,
    Value<String?>? dueDate,
    Value<String>? recurring,
    Value<int>? timesShown,
    Value<int>? timesSkipped,
    Value<int>? timesCompleted,
    Value<int>? pointsEarned,
    Value<String>? createdAt,
    Value<String>? updatedAt,
    Value<int>? rowid,
  }) {
    return CachedTasksCompanion(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      name: name ?? this.name,
      description: description ?? this.description,
      typeRaw: typeRaw ?? this.typeRaw,
      time: time ?? this.time,
      social: social ?? this.social,
      energy: energy ?? this.energy,
      dueDate: dueDate ?? this.dueDate,
      recurring: recurring ?? this.recurring,
      timesShown: timesShown ?? this.timesShown,
      timesSkipped: timesSkipped ?? this.timesSkipped,
      timesCompleted: timesCompleted ?? this.timesCompleted,
      pointsEarned: pointsEarned ?? this.pointsEarned,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (userId.present) {
      map['user_id'] = Variable<String>(userId.value);
    }
    if (name.present) {
      map['name'] = Variable<String>(name.value);
    }
    if (description.present) {
      map['description'] = Variable<String>(description.value);
    }
    if (typeRaw.present) {
      map['type_raw'] = Variable<String>(typeRaw.value);
    }
    if (time.present) {
      map['time'] = Variable<int>(time.value);
    }
    if (social.present) {
      map['social'] = Variable<String>(social.value);
    }
    if (energy.present) {
      map['energy'] = Variable<String>(energy.value);
    }
    if (dueDate.present) {
      map['due_date'] = Variable<String>(dueDate.value);
    }
    if (recurring.present) {
      map['recurring'] = Variable<String>(recurring.value);
    }
    if (timesShown.present) {
      map['times_shown'] = Variable<int>(timesShown.value);
    }
    if (timesSkipped.present) {
      map['times_skipped'] = Variable<int>(timesSkipped.value);
    }
    if (timesCompleted.present) {
      map['times_completed'] = Variable<int>(timesCompleted.value);
    }
    if (pointsEarned.present) {
      map['points_earned'] = Variable<int>(pointsEarned.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<String>(createdAt.value);
    }
    if (updatedAt.present) {
      map['updated_at'] = Variable<String>(updatedAt.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('CachedTasksCompanion(')
          ..write('id: $id, ')
          ..write('userId: $userId, ')
          ..write('name: $name, ')
          ..write('description: $description, ')
          ..write('typeRaw: $typeRaw, ')
          ..write('time: $time, ')
          ..write('social: $social, ')
          ..write('energy: $energy, ')
          ..write('dueDate: $dueDate, ')
          ..write('recurring: $recurring, ')
          ..write('timesShown: $timesShown, ')
          ..write('timesSkipped: $timesSkipped, ')
          ..write('timesCompleted: $timesCompleted, ')
          ..write('pointsEarned: $pointsEarned, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $OfflineQueueTable extends OfflineQueue
    with TableInfo<$OfflineQueueTable, OfflineQueueData> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $OfflineQueueTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
    'id',
    aliasedName,
    false,
    hasAutoIncrement: true,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'PRIMARY KEY AUTOINCREMENT',
    ),
  );
  static const VerificationMeta _actionMeta = const VerificationMeta('action');
  @override
  late final GeneratedColumn<String> action = GeneratedColumn<String>(
    'action',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _payloadMeta = const VerificationMeta(
    'payload',
  );
  @override
  late final GeneratedColumn<String> payload = GeneratedColumn<String>(
    'payload',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _createdAtMeta = const VerificationMeta(
    'createdAt',
  );
  @override
  late final GeneratedColumn<String> createdAt = GeneratedColumn<String>(
    'created_at',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  @override
  List<GeneratedColumn> get $columns => [id, action, payload, createdAt];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'offline_queue';
  @override
  VerificationContext validateIntegrity(
    Insertable<OfflineQueueData> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('action')) {
      context.handle(
        _actionMeta,
        action.isAcceptableOrUnknown(data['action']!, _actionMeta),
      );
    } else if (isInserting) {
      context.missing(_actionMeta);
    }
    if (data.containsKey('payload')) {
      context.handle(
        _payloadMeta,
        payload.isAcceptableOrUnknown(data['payload']!, _payloadMeta),
      );
    } else if (isInserting) {
      context.missing(_payloadMeta);
    }
    if (data.containsKey('created_at')) {
      context.handle(
        _createdAtMeta,
        createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta),
      );
    } else if (isInserting) {
      context.missing(_createdAtMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  OfflineQueueData map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return OfflineQueueData(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}id'],
      )!,
      action: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}action'],
      )!,
      payload: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}payload'],
      )!,
      createdAt: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}created_at'],
      )!,
    );
  }

  @override
  $OfflineQueueTable createAlias(String alias) {
    return $OfflineQueueTable(attachedDatabase, alias);
  }
}

class OfflineQueueData extends DataClass
    implements Insertable<OfflineQueueData> {
  final int id;
  final String action;
  final String payload;
  final String createdAt;
  const OfflineQueueData({
    required this.id,
    required this.action,
    required this.payload,
    required this.createdAt,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['action'] = Variable<String>(action);
    map['payload'] = Variable<String>(payload);
    map['created_at'] = Variable<String>(createdAt);
    return map;
  }

  OfflineQueueCompanion toCompanion(bool nullToAbsent) {
    return OfflineQueueCompanion(
      id: Value(id),
      action: Value(action),
      payload: Value(payload),
      createdAt: Value(createdAt),
    );
  }

  factory OfflineQueueData.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return OfflineQueueData(
      id: serializer.fromJson<int>(json['id']),
      action: serializer.fromJson<String>(json['action']),
      payload: serializer.fromJson<String>(json['payload']),
      createdAt: serializer.fromJson<String>(json['createdAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'action': serializer.toJson<String>(action),
      'payload': serializer.toJson<String>(payload),
      'createdAt': serializer.toJson<String>(createdAt),
    };
  }

  OfflineQueueData copyWith({
    int? id,
    String? action,
    String? payload,
    String? createdAt,
  }) => OfflineQueueData(
    id: id ?? this.id,
    action: action ?? this.action,
    payload: payload ?? this.payload,
    createdAt: createdAt ?? this.createdAt,
  );
  OfflineQueueData copyWithCompanion(OfflineQueueCompanion data) {
    return OfflineQueueData(
      id: data.id.present ? data.id.value : this.id,
      action: data.action.present ? data.action.value : this.action,
      payload: data.payload.present ? data.payload.value : this.payload,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('OfflineQueueData(')
          ..write('id: $id, ')
          ..write('action: $action, ')
          ..write('payload: $payload, ')
          ..write('createdAt: $createdAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, action, payload, createdAt);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is OfflineQueueData &&
          other.id == this.id &&
          other.action == this.action &&
          other.payload == this.payload &&
          other.createdAt == this.createdAt);
}

class OfflineQueueCompanion extends UpdateCompanion<OfflineQueueData> {
  final Value<int> id;
  final Value<String> action;
  final Value<String> payload;
  final Value<String> createdAt;
  const OfflineQueueCompanion({
    this.id = const Value.absent(),
    this.action = const Value.absent(),
    this.payload = const Value.absent(),
    this.createdAt = const Value.absent(),
  });
  OfflineQueueCompanion.insert({
    this.id = const Value.absent(),
    required String action,
    required String payload,
    required String createdAt,
  }) : action = Value(action),
       payload = Value(payload),
       createdAt = Value(createdAt);
  static Insertable<OfflineQueueData> custom({
    Expression<int>? id,
    Expression<String>? action,
    Expression<String>? payload,
    Expression<String>? createdAt,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (action != null) 'action': action,
      if (payload != null) 'payload': payload,
      if (createdAt != null) 'created_at': createdAt,
    });
  }

  OfflineQueueCompanion copyWith({
    Value<int>? id,
    Value<String>? action,
    Value<String>? payload,
    Value<String>? createdAt,
  }) {
    return OfflineQueueCompanion(
      id: id ?? this.id,
      action: action ?? this.action,
      payload: payload ?? this.payload,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (action.present) {
      map['action'] = Variable<String>(action.value);
    }
    if (payload.present) {
      map['payload'] = Variable<String>(payload.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<String>(createdAt.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('OfflineQueueCompanion(')
          ..write('id: $id, ')
          ..write('action: $action, ')
          ..write('payload: $payload, ')
          ..write('createdAt: $createdAt')
          ..write(')'))
        .toString();
  }
}

abstract class _$AppDatabase extends GeneratedDatabase {
  _$AppDatabase(QueryExecutor e) : super(e);
  $AppDatabaseManager get managers => $AppDatabaseManager(this);
  late final $CachedTasksTable cachedTasks = $CachedTasksTable(this);
  late final $OfflineQueueTable offlineQueue = $OfflineQueueTable(this);
  @override
  Iterable<TableInfo<Table, Object?>> get allTables =>
      allSchemaEntities.whereType<TableInfo<Table, Object?>>();
  @override
  List<DatabaseSchemaEntity> get allSchemaEntities => [
    cachedTasks,
    offlineQueue,
  ];
}

typedef $$CachedTasksTableCreateCompanionBuilder =
    CachedTasksCompanion Function({
      required String id,
      required String userId,
      required String name,
      Value<String?> description,
      required String typeRaw,
      required int time,
      required String social,
      required String energy,
      Value<String?> dueDate,
      Value<String> recurring,
      Value<int> timesShown,
      Value<int> timesSkipped,
      Value<int> timesCompleted,
      Value<int> pointsEarned,
      required String createdAt,
      required String updatedAt,
      Value<int> rowid,
    });
typedef $$CachedTasksTableUpdateCompanionBuilder =
    CachedTasksCompanion Function({
      Value<String> id,
      Value<String> userId,
      Value<String> name,
      Value<String?> description,
      Value<String> typeRaw,
      Value<int> time,
      Value<String> social,
      Value<String> energy,
      Value<String?> dueDate,
      Value<String> recurring,
      Value<int> timesShown,
      Value<int> timesSkipped,
      Value<int> timesCompleted,
      Value<int> pointsEarned,
      Value<String> createdAt,
      Value<String> updatedAt,
      Value<int> rowid,
    });

class $$CachedTasksTableFilterComposer
    extends Composer<_$AppDatabase, $CachedTasksTable> {
  $$CachedTasksTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get userId => $composableBuilder(
    column: $table.userId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get description => $composableBuilder(
    column: $table.description,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get typeRaw => $composableBuilder(
    column: $table.typeRaw,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get time => $composableBuilder(
    column: $table.time,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get social => $composableBuilder(
    column: $table.social,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get energy => $composableBuilder(
    column: $table.energy,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get dueDate => $composableBuilder(
    column: $table.dueDate,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get recurring => $composableBuilder(
    column: $table.recurring,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get timesShown => $composableBuilder(
    column: $table.timesShown,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get timesSkipped => $composableBuilder(
    column: $table.timesSkipped,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get timesCompleted => $composableBuilder(
    column: $table.timesCompleted,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get pointsEarned => $composableBuilder(
    column: $table.pointsEarned,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get updatedAt => $composableBuilder(
    column: $table.updatedAt,
    builder: (column) => ColumnFilters(column),
  );
}

class $$CachedTasksTableOrderingComposer
    extends Composer<_$AppDatabase, $CachedTasksTable> {
  $$CachedTasksTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get userId => $composableBuilder(
    column: $table.userId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get description => $composableBuilder(
    column: $table.description,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get typeRaw => $composableBuilder(
    column: $table.typeRaw,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get time => $composableBuilder(
    column: $table.time,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get social => $composableBuilder(
    column: $table.social,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get energy => $composableBuilder(
    column: $table.energy,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get dueDate => $composableBuilder(
    column: $table.dueDate,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get recurring => $composableBuilder(
    column: $table.recurring,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get timesShown => $composableBuilder(
    column: $table.timesShown,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get timesSkipped => $composableBuilder(
    column: $table.timesSkipped,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get timesCompleted => $composableBuilder(
    column: $table.timesCompleted,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get pointsEarned => $composableBuilder(
    column: $table.pointsEarned,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get updatedAt => $composableBuilder(
    column: $table.updatedAt,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$CachedTasksTableAnnotationComposer
    extends Composer<_$AppDatabase, $CachedTasksTable> {
  $$CachedTasksTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get userId =>
      $composableBuilder(column: $table.userId, builder: (column) => column);

  GeneratedColumn<String> get name =>
      $composableBuilder(column: $table.name, builder: (column) => column);

  GeneratedColumn<String> get description => $composableBuilder(
    column: $table.description,
    builder: (column) => column,
  );

  GeneratedColumn<String> get typeRaw =>
      $composableBuilder(column: $table.typeRaw, builder: (column) => column);

  GeneratedColumn<int> get time =>
      $composableBuilder(column: $table.time, builder: (column) => column);

  GeneratedColumn<String> get social =>
      $composableBuilder(column: $table.social, builder: (column) => column);

  GeneratedColumn<String> get energy =>
      $composableBuilder(column: $table.energy, builder: (column) => column);

  GeneratedColumn<String> get dueDate =>
      $composableBuilder(column: $table.dueDate, builder: (column) => column);

  GeneratedColumn<String> get recurring =>
      $composableBuilder(column: $table.recurring, builder: (column) => column);

  GeneratedColumn<int> get timesShown => $composableBuilder(
    column: $table.timesShown,
    builder: (column) => column,
  );

  GeneratedColumn<int> get timesSkipped => $composableBuilder(
    column: $table.timesSkipped,
    builder: (column) => column,
  );

  GeneratedColumn<int> get timesCompleted => $composableBuilder(
    column: $table.timesCompleted,
    builder: (column) => column,
  );

  GeneratedColumn<int> get pointsEarned => $composableBuilder(
    column: $table.pointsEarned,
    builder: (column) => column,
  );

  GeneratedColumn<String> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);

  GeneratedColumn<String> get updatedAt =>
      $composableBuilder(column: $table.updatedAt, builder: (column) => column);
}

class $$CachedTasksTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $CachedTasksTable,
          CachedTask,
          $$CachedTasksTableFilterComposer,
          $$CachedTasksTableOrderingComposer,
          $$CachedTasksTableAnnotationComposer,
          $$CachedTasksTableCreateCompanionBuilder,
          $$CachedTasksTableUpdateCompanionBuilder,
          (
            CachedTask,
            BaseReferences<_$AppDatabase, $CachedTasksTable, CachedTask>,
          ),
          CachedTask,
          PrefetchHooks Function()
        > {
  $$CachedTasksTableTableManager(_$AppDatabase db, $CachedTasksTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$CachedTasksTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$CachedTasksTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$CachedTasksTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> userId = const Value.absent(),
                Value<String> name = const Value.absent(),
                Value<String?> description = const Value.absent(),
                Value<String> typeRaw = const Value.absent(),
                Value<int> time = const Value.absent(),
                Value<String> social = const Value.absent(),
                Value<String> energy = const Value.absent(),
                Value<String?> dueDate = const Value.absent(),
                Value<String> recurring = const Value.absent(),
                Value<int> timesShown = const Value.absent(),
                Value<int> timesSkipped = const Value.absent(),
                Value<int> timesCompleted = const Value.absent(),
                Value<int> pointsEarned = const Value.absent(),
                Value<String> createdAt = const Value.absent(),
                Value<String> updatedAt = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => CachedTasksCompanion(
                id: id,
                userId: userId,
                name: name,
                description: description,
                typeRaw: typeRaw,
                time: time,
                social: social,
                energy: energy,
                dueDate: dueDate,
                recurring: recurring,
                timesShown: timesShown,
                timesSkipped: timesSkipped,
                timesCompleted: timesCompleted,
                pointsEarned: pointsEarned,
                createdAt: createdAt,
                updatedAt: updatedAt,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String userId,
                required String name,
                Value<String?> description = const Value.absent(),
                required String typeRaw,
                required int time,
                required String social,
                required String energy,
                Value<String?> dueDate = const Value.absent(),
                Value<String> recurring = const Value.absent(),
                Value<int> timesShown = const Value.absent(),
                Value<int> timesSkipped = const Value.absent(),
                Value<int> timesCompleted = const Value.absent(),
                Value<int> pointsEarned = const Value.absent(),
                required String createdAt,
                required String updatedAt,
                Value<int> rowid = const Value.absent(),
              }) => CachedTasksCompanion.insert(
                id: id,
                userId: userId,
                name: name,
                description: description,
                typeRaw: typeRaw,
                time: time,
                social: social,
                energy: energy,
                dueDate: dueDate,
                recurring: recurring,
                timesShown: timesShown,
                timesSkipped: timesSkipped,
                timesCompleted: timesCompleted,
                pointsEarned: pointsEarned,
                createdAt: createdAt,
                updatedAt: updatedAt,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$CachedTasksTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $CachedTasksTable,
      CachedTask,
      $$CachedTasksTableFilterComposer,
      $$CachedTasksTableOrderingComposer,
      $$CachedTasksTableAnnotationComposer,
      $$CachedTasksTableCreateCompanionBuilder,
      $$CachedTasksTableUpdateCompanionBuilder,
      (
        CachedTask,
        BaseReferences<_$AppDatabase, $CachedTasksTable, CachedTask>,
      ),
      CachedTask,
      PrefetchHooks Function()
    >;
typedef $$OfflineQueueTableCreateCompanionBuilder =
    OfflineQueueCompanion Function({
      Value<int> id,
      required String action,
      required String payload,
      required String createdAt,
    });
typedef $$OfflineQueueTableUpdateCompanionBuilder =
    OfflineQueueCompanion Function({
      Value<int> id,
      Value<String> action,
      Value<String> payload,
      Value<String> createdAt,
    });

class $$OfflineQueueTableFilterComposer
    extends Composer<_$AppDatabase, $OfflineQueueTable> {
  $$OfflineQueueTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<int> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get action => $composableBuilder(
    column: $table.action,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get payload => $composableBuilder(
    column: $table.payload,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnFilters(column),
  );
}

class $$OfflineQueueTableOrderingComposer
    extends Composer<_$AppDatabase, $OfflineQueueTable> {
  $$OfflineQueueTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<int> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get action => $composableBuilder(
    column: $table.action,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get payload => $composableBuilder(
    column: $table.payload,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get createdAt => $composableBuilder(
    column: $table.createdAt,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$OfflineQueueTableAnnotationComposer
    extends Composer<_$AppDatabase, $OfflineQueueTable> {
  $$OfflineQueueTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<int> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get action =>
      $composableBuilder(column: $table.action, builder: (column) => column);

  GeneratedColumn<String> get payload =>
      $composableBuilder(column: $table.payload, builder: (column) => column);

  GeneratedColumn<String> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);
}

class $$OfflineQueueTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $OfflineQueueTable,
          OfflineQueueData,
          $$OfflineQueueTableFilterComposer,
          $$OfflineQueueTableOrderingComposer,
          $$OfflineQueueTableAnnotationComposer,
          $$OfflineQueueTableCreateCompanionBuilder,
          $$OfflineQueueTableUpdateCompanionBuilder,
          (
            OfflineQueueData,
            BaseReferences<_$AppDatabase, $OfflineQueueTable, OfflineQueueData>,
          ),
          OfflineQueueData,
          PrefetchHooks Function()
        > {
  $$OfflineQueueTableTableManager(_$AppDatabase db, $OfflineQueueTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$OfflineQueueTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$OfflineQueueTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$OfflineQueueTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<int> id = const Value.absent(),
                Value<String> action = const Value.absent(),
                Value<String> payload = const Value.absent(),
                Value<String> createdAt = const Value.absent(),
              }) => OfflineQueueCompanion(
                id: id,
                action: action,
                payload: payload,
                createdAt: createdAt,
              ),
          createCompanionCallback:
              ({
                Value<int> id = const Value.absent(),
                required String action,
                required String payload,
                required String createdAt,
              }) => OfflineQueueCompanion.insert(
                id: id,
                action: action,
                payload: payload,
                createdAt: createdAt,
              ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$OfflineQueueTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $OfflineQueueTable,
      OfflineQueueData,
      $$OfflineQueueTableFilterComposer,
      $$OfflineQueueTableOrderingComposer,
      $$OfflineQueueTableAnnotationComposer,
      $$OfflineQueueTableCreateCompanionBuilder,
      $$OfflineQueueTableUpdateCompanionBuilder,
      (
        OfflineQueueData,
        BaseReferences<_$AppDatabase, $OfflineQueueTable, OfflineQueueData>,
      ),
      OfflineQueueData,
      PrefetchHooks Function()
    >;

class $AppDatabaseManager {
  final _$AppDatabase _db;
  $AppDatabaseManager(this._db);
  $$CachedTasksTableTableManager get cachedTasks =>
      $$CachedTasksTableTableManager(_db, _db.cachedTasks);
  $$OfflineQueueTableTableManager get offlineQueue =>
      $$OfflineQueueTableTableManager(_db, _db.offlineQueue);
}
