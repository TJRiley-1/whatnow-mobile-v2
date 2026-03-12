import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/group.dart';
import 'auth_provider.dart';

final userGroupsProvider =
    AsyncNotifierProvider<UserGroupsNotifier, List<Group>>(
        UserGroupsNotifier.new);

class UserGroupsNotifier extends AsyncNotifier<List<Group>> {
  SupabaseClient get _client => Supabase.instance.client;

  @override
  Future<List<Group>> build() async {
    final user = ref.watch(currentUserProvider);
    if (user == null) return [];

    final memberships = await _client
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id);

    if (memberships.isEmpty) return [];

    final groupIds =
        memberships.map((m) => m['group_id'] as String).toList();

    final groups =
        await _client.from('groups').select().inFilter('id', groupIds);

    return groups.map((json) => Group.fromJson(json)).toList();
  }

  Future<void> createGroup(String name, String? description) async {
    final user = ref.read(currentUserProvider);
    if (user == null) return;

    final inviteCode = await _client.rpc('generate_invite_code') as String;

    final groupData = await _client
        .from('groups')
        .insert({
          'name': name,
          'description': description,
          'invite_code': inviteCode,
          'created_by': user.id,
        })
        .select()
        .single();

    await _client.from('group_members').insert({
      'group_id': groupData['id'],
      'user_id': user.id,
    });

    ref.invalidateSelf();
  }

  Future<String?> joinByCode(String code) async {
    final user = ref.read(currentUserProvider);
    if (user == null) return 'Not signed in';

    final groups = await _client
        .from('groups')
        .select()
        .eq('invite_code', code.toUpperCase());

    if (groups.isEmpty) return 'Invalid invite code';

    final groupId = groups.first['id'] as String;

    final existing = await _client
        .from('group_members')
        .select()
        .eq('group_id', groupId)
        .eq('user_id', user.id);

    if (existing.isNotEmpty) return 'Already a member';

    await _client.from('group_members').insert({
      'group_id': groupId,
      'user_id': user.id,
    });

    ref.invalidateSelf();
    return null;
  }

  Future<void> leaveGroup(String groupId) async {
    final user = ref.read(currentUserProvider);
    if (user == null) return;

    await _client
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);

    ref.invalidateSelf();
  }
}

final leaderboardProvider =
    FutureProvider.family<List<LeaderboardEntry>, String>(
        (ref, groupId) async {
  final data = await Supabase.instance.client
      .from('weekly_leaderboard')
      .select()
      .eq('group_id', groupId)
      .order('weekly_points', ascending: false);

  return data.map((json) => LeaderboardEntry.fromJson(json)).toList();
});
