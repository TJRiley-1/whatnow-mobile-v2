import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'profile_provider.dart';
import 'task_provider.dart';

const freeTaskLimit = 20;

final isPremiumProvider = Provider<bool>((ref) {
  final profile = ref.watch(profileProvider).valueOrNull;
  return profile?.isPremium ?? false;
});

final canAddTaskProvider = Provider<bool>((ref) {
  final isPremium = ref.watch(isPremiumProvider);
  if (isPremium) return true;

  final tasks = ref.watch(taskListProvider).valueOrNull ?? [];
  return tasks.length < freeTaskLimit;
});

final taskCountProvider = Provider<int>((ref) {
  return ref.watch(taskListProvider).valueOrNull?.length ?? 0;
});
