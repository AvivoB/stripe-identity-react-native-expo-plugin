const {
  withPlugins,
  withInfoPlist,
  withAndroidManifest,
  withDangerousMod,
  WarningAggregator,
  createRunOncePlugin,
} = require('@expo/config-plugins');

const withStripeIdentity = (config) => {
  // iOS: Add camera usage description and required version
  config = withInfoPlist(config, (config) => {
    if (!config.modResults.NSCameraUsageDescription) {
      config.modResults.NSCameraUsageDescription = 
        'This app needs access to your camera to scan identity documents';
    }
    if (!config.modResults.MinimumOSVersion) {
      config.modResults.MinimumOSVersion = '13.0';
    }
    return config;
  });

  // Android: Material theme and permissions
  config = withAndroidManifest(config, async (config) => {
    const mainApplication = getMainApplication(config.modResults);
    if (mainApplication) {
      // Add theme
      if (!mainApplication.$['android:theme']) {
        mainApplication.$['android:theme'] = '@style/Theme.MaterialComponents.DayNight';
      }

      // Add required permissions
      const permissions = [
        'android.permission.CAMERA',
      ];

      permissions.forEach(permission => {
        if (!isPermissionDeclared(config.modResults, permission)) {
          if (!config.modResults.manifest['uses-permission']) {
            config.modResults.manifest['uses-permission'] = [];
          }
          config.modResults.manifest['uses-permission'].push({
            $: {
              'android:name': permission,
            },
          });
        }
      });
    }
    return config;
  });

  return config;
};

function getMainApplication(androidManifest) {
  if (androidManifest.manifest.application) {
    return androidManifest.manifest.application.length
      ? androidManifest.manifest.application[0]
      : androidManifest.manifest.application;
  }
  return null;
}

function isPermissionDeclared(manifest, permission) {
  return (
    manifest.manifest['uses-permission']?.some?.(
      (el) => el.$['android:name'] === permission
    ) ?? false
  );
}

module.exports = createRunOncePlugin(
  withStripeIdentity,
  'stripe-identity-react-native-expo-plugin',
  '1.0.0'
);