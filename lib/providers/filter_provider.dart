import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/task.dart';
import 'task_provider.dart';

class FilterState {
  final int? maxTime;
  final Level? maxSocial;
  final Level? maxEnergy;

  const FilterState({this.maxTime, this.maxSocial, this.maxEnergy});

  FilterState copyWith({
    int? Function()? maxTime,
    Level? Function()? maxSocial,
    Level? Function()? maxEnergy,
  }) {
    return FilterState(
      maxTime: maxTime != null ? maxTime() : this.maxTime,
      maxSocial: maxSocial != null ? maxSocial() : this.maxSocial,
      maxEnergy: maxEnergy != null ? maxEnergy() : this.maxEnergy,
    );
  }
}

final filterProvider = NotifierProvider<FilterNotifier, FilterState>(
  FilterNotifier.new,
);

class FilterNotifier extends Notifier<FilterState> {
  @override
  FilterState build() => const FilterState();

  void setMaxTime(int? time) {
    state = state.copyWith(maxTime: () => time);
  }

  void setMaxSocial(Level? level) {
    state = state.copyWith(maxSocial: () => level);
  }

  void setMaxEnergy(Level? level) {
    state = state.copyWith(maxEnergy: () => level);
  }

  void clearAll() {
    state = const FilterState();
  }
}

final filteredTasksProvider = Provider<AsyncValue<List<Task>>>((ref) {
  final tasksAsync = ref.watch(taskListProvider);
  final filters = ref.watch(filterProvider);

  return tasksAsync.whenData((tasks) {
    return tasks.where((task) {
      if (filters.maxTime != null && task.time > filters.maxTime!) {
        return false;
      }
      if (filters.maxSocial != null &&
          task.social.index > filters.maxSocial!.index) {
        return false;
      }
      if (filters.maxEnergy != null &&
          task.energy.index > filters.maxEnergy!.index) {
        return false;
      }
      return true;
    }).toList()
      ..shuffle();
  });
});
