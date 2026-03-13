import 'package:flutter/material.dart';
import '../models/task.dart';

class SwipeCard extends StatefulWidget {
  final Task task;
  final VoidCallback onAccept;
  final VoidCallback onSkip;

  const SwipeCard({
    super.key,
    required this.task,
    required this.onAccept,
    required this.onSkip,
  });

  @override
  State<SwipeCard> createState() => _SwipeCardState();
}

class _SwipeCardState extends State<SwipeCard> {
  Offset _offset = Offset.zero;

  static const _threshold = 100.0;

  void _onPanUpdate(DragUpdateDetails details) {
    setState(() {
      _offset += details.delta;
    });
  }

  void _onPanEnd(DragEndDetails details) {
    if (_offset.dx > _threshold) {
      _animateOff(1);
    } else if (_offset.dx < -_threshold) {
      _animateOff(-1);
    } else {
      setState(() {
        _offset = Offset.zero;
      });
    }
  }

  void _animateOff(int direction) {
    setState(() {
      _offset = Offset(direction * 500, _offset.dy);
    });
    Future.delayed(const Duration(milliseconds: 200), () {
      if (direction > 0) {
        widget.onAccept();
      } else {
        widget.onSkip();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final task = widget.task;
    final timeLabel =
        task.time >= 60 ? '${task.time ~/ 60}hr' : '${task.time}min';

    final rotation = _offset.dx / 300;
    final acceptOpacity = (_offset.dx / _threshold).clamp(0.0, 1.0);
    final skipOpacity = (-_offset.dx / _threshold).clamp(0.0, 1.0);

    return GestureDetector(
      onPanUpdate: _onPanUpdate,
      onPanEnd: _onPanEnd,
      child: Transform.translate(
        offset: _offset,
        child: Transform.rotate(
          angle: rotation,
          child: Card(
            elevation: 8,
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20)),
            child: Padding(
              padding: const EdgeInsets.all(28),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Opacity(
                        opacity: skipOpacity,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            border: Border.all(
                                color: theme.colorScheme.error, width: 2),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text('SKIP',
                              style: TextStyle(
                                  color: theme.colorScheme.error,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16)),
                        ),
                      ),
                      Opacity(
                        opacity: acceptOpacity,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            border: Border.all(
                                color: theme.colorScheme.primary, width: 2),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text("LET'S GO",
                              style: TextStyle(
                                  color: theme.colorScheme.primary,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16)),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.primaryContainer,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(task.typeLabel,
                        style: theme.textTheme.bodyMedium?.copyWith(
                            color: theme.colorScheme.onPrimaryContainer)),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    task.name,
                    style: theme.textTheme.titleLarge,
                    textAlign: TextAlign.center,
                  ),
                  if (task.description != null) ...[
                    const SizedBox(height: 8),
                    Text(
                      task.description!,
                      style: theme.textTheme.bodyMedium?.copyWith(
                          color: theme.colorScheme.onSurfaceVariant),
                      textAlign: TextAlign.center,
                      maxLines: 3,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                  const SizedBox(height: 24),
                  Wrap(
                    spacing: 12,
                    runSpacing: 8,
                    alignment: WrapAlignment.center,
                    children: [
                      _MetaChip(
                          icon: Icons.timer_outlined, label: timeLabel),
                      _MetaChip(
                          icon: Icons.people_outline,
                          label: task.social.label),
                      _MetaChip(
                          icon: Icons.bolt_outlined,
                          label: task.energy.label),
                      if (task.recurring != Recurring.none)
                        _MetaChip(
                            icon: Icons.repeat,
                            label: task.recurring.label),
                    ],
                  ),
                  const SizedBox(height: 24),
                  Text(
                    'Swipe right to start  ·  Swipe left to skip',
                    style: theme.textTheme.bodySmall
                        ?.copyWith(color: theme.colorScheme.outline),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _MetaChip extends StatelessWidget {
  final IconData icon;
  final String label;

  const _MetaChip({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: theme.colorScheme.onSurfaceVariant),
          const SizedBox(width: 4),
          Text(label,
              style: theme.textTheme.bodySmall
                  ?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
        ],
      ),
    );
  }
}
