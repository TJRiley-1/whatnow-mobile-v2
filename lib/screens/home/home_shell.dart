import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../providers/connectivity_provider.dart';

class HomeShell extends ConsumerWidget {
  final StatefulNavigationShell navigationShell;

  const HomeShell({super.key, required this.navigationShell});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isOnline = ref.watch(connectivityProvider).valueOrNull ?? true;

    return Scaffold(
      body: Column(
        children: [
          if (!isOnline)
            MaterialBanner(
              content: const Text('You are offline. Changes will sync when reconnected.'),
              leading: const Icon(Icons.cloud_off),
              backgroundColor: Theme.of(context).colorScheme.errorContainer,
              actions: const [SizedBox.shrink()],
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            ),
          Expanded(child: navigationShell),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: navigationShell.currentIndex,
        onDestinationSelected: (index) {
          navigationShell.goBranch(index, initialLocation: index == navigationShell.currentIndex);
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.shuffle),
            selectedIcon: Icon(Icons.shuffle),
            label: 'What Next',
          ),
          NavigationDestination(
            icon: Icon(Icons.checklist),
            selectedIcon: Icon(Icons.checklist),
            label: 'Tasks',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
