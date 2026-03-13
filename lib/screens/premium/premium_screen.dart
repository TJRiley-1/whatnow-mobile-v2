import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../providers/premium_provider.dart';

class PremiumScreen extends ConsumerWidget {
  const PremiumScreen({super.key});

  static const _stripePaymentUrl = 'https://buy.stripe.com/test_aFacN754Iarx1Y07VKenS00';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final isPremium = ref.watch(isPremiumProvider);

    if (isPremium) {
      return Scaffold(
        appBar: AppBar(title: const Text('Premium')),
        body: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.workspace_premium,
                  size: 64, color: theme.colorScheme.primary),
              const SizedBox(height: 16),
              Text("You're a Premium member!",
                  style: theme.textTheme.titleLarge),
              const SizedBox(height: 8),
              Text('Enjoy unlimited tasks and an ad-free experience.',
                  style: theme.textTheme.bodyMedium),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Go Premium')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Icon(Icons.workspace_premium,
                size: 72, color: theme.colorScheme.primary),
            const SizedBox(height: 24),
            Text(
              'Unlock Whatnow Premium',
              style: theme.textTheme.headlineSmall,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 32),
            _FeatureRow(
              icon: Icons.all_inclusive,
              title: 'Unlimited Tasks',
              subtitle: 'Free plan is limited to $freeTaskLimit tasks',
            ),
            const SizedBox(height: 16),
            const _FeatureRow(
              icon: Icons.block,
              title: 'No Ads',
              subtitle: 'Clean, distraction-free experience',
            ),
            const SizedBox(height: 16),
            const _FeatureRow(
              icon: Icons.star_outline,
              title: 'Priority Support',
              subtitle: 'Get help when you need it',
            ),
            const SizedBox(height: 40),
            FilledButton.icon(
              onPressed: () => _launchStripe(),
              icon: const Icon(Icons.lock_open),
              label: const Text('Upgrade Now'),
              style: FilledButton.styleFrom(
                minimumSize: const Size(double.infinity, 56),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Secure payment via Stripe',
              style: theme.textTheme.bodySmall?.copyWith(
                color: theme.colorScheme.outline,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _launchStripe() async {
    final uri = Uri.parse(_stripePaymentUrl);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }
}

class _FeatureRow extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;

  const _FeatureRow({
    required this.icon,
    required this.title,
    required this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Row(
      children: [
        Icon(icon, size: 32, color: theme.colorScheme.primary),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: theme.textTheme.titleSmall),
              Text(subtitle,
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: theme.colorScheme.onSurfaceVariant,
                  )),
            ],
          ),
        ),
      ],
    );
  }
}
