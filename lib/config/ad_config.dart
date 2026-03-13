import 'dart:io';

class AdConfig {
  static String get bannerAdUnitId {
    if (Platform.isAndroid) {
      return 'ca-app-pub-3940256099942544/6300978111'; // Test banner
    } else {
      return 'ca-app-pub-3940256099942544/2934735716'; // Test banner
    }
  }

  // Replace with real AdMob app IDs before release
  static const androidAppId = 'ca-app-pub-3940256099942544~3347511713'; // Test
  static const iosAppId = 'ca-app-pub-3940256099942544~1458002511'; // Test
}
