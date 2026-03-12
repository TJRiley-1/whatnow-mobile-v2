import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/profile.dart';
import 'auth_provider.dart';

final profileProvider = FutureProvider<Profile?>((ref) async {
  final user = ref.watch(currentUserProvider);
  if (user == null) return null;

  final data = await Supabase.instance.client
      .from('profiles')
      .select()
      .eq('id', user.id)
      .single();

  return Profile.fromJson(data);
});
