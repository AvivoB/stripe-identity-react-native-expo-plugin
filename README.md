# Stripe Identity React Native SDK

Stripe Identity enables online businesses to securely verify the identities of users around the world. Robust identity verification helps prevent fraud, simplify compliance, and increase trust. Stripe will use biometric technology (on images of you and your IDs) and other data sources. With the Stripe Identity React Native SDK, you can confidently verify the authenticity of ID documents from over 33 countries in your React Native application.

> To get access to the Identity React Native SDK, visit the [Identity Settings](https://dashboard.stripe.com/settings/identity) page and click **Enable**.

## Getting started

Get started with our [📚 integration guides](https://stripe.com/docs/identity/verify-identity-documents?platform=react-native) and [example project](#run-the-example-app).

> Updating to a newer version of the SDK? See our [changelog](https://github.com/stripe/stripe-identity-react-native/blob/main/CHANGELOG.md).

## Features

**Simplified security**: We've made it simple for you to securely collect your user's personally identifiable information (PII) such as identity document images. Sensitive PII data is sent directly to Stripe Identity instead of passing through your server. For more information, see our [integration security guide](https://stripe.com/docs/security).

**Automatic document capture**: We automatically capture images of the front and back of government-issued photo ID to ensure a clear and readable image.

**Prebuilt UI**: We provide [`IdentityVerificationSheet`](https://stripe.dev/stripe-ios/stripe-identity/Classes/IdentityVerificationSheet.html), a prebuilt UI that combines all the steps required to collect ID documents, selfies, and ID numbers into a single sheet that displays on top of your app.

**Automated verification**: Stripe Identity's automated verification technology looks for patterns to help determine if an ID document is real or fake and uses distinctive physiological characteristics of faces to match your users' selfies to photos on their ID document. Collected identity information is checked against a global set of databases to confirm that it exists. Learn more about the [verification checks supported by Stripe Identity](https://stripe.com/docs/identity/verification-checks), [accessing verification results](https://stripe.com/docs/identity/access-verification-results), or our integration guide on [handling verification outcomes](https://stripe.com/docs/identity/handle-verification-outcomes).

### Requirements

The SDK uses TypeScript features available in Babel version `7.9.0` and above.
Alternatively use the `plugin-transform-typescript` plugin in your project.

#### Android
- Compatible with Android 5.0 (API level 21) and above.
- Stripe Identity requires the hosting activity to use material theme. To enable material theme:
  - Open your project's `app/src/main/AndroidManifest.xml`.
  - Make sure the `android:theme` applied to the `application` is a child of one of the material themes(e.g `Theme.MaterialComponents.DayNight`).
    > See more details about material theme [here](https://material.io/develop/android/theming/dark).

#### iOS
> Note: [Xcode 13 is no longer supported by Apple](https://developer.apple.com/news/upcoming-requirements/). Please upgrade to Xcode 14.1 or later.

- Compatible with apps targeting iOS 13.0 or above.
- Run `pod install` in your `ios` directory to ensure that you also install the required native dependencies.
- Stripe Identity requires access to the device’s camera to capture identity documents. To enable your app to request camera permissions:
  - Open your project’s `Info.plist`.
  - Add the `NSCameraUsageDescription` key.
  - Add a string value that explains to your users why your app requires camera permissions(e.g `This app uses the camera to take a picture of your identity documents.`).

## Usage example

Get started with our [📚 integration guides](https://stripe.com/docs/identity/verify-identity-documents?platform=react-native) and [example project](#run-the-example-app), or [📘 browse the SDK reference](https://stripe.dev/stripe-identity-react-native).

To initialize Stripe Identity SDK in your React Native app, use the `useStripeIdentity` hook in the screen where you want to use it.

First you need a server-side endpoint to [create the VerificationSession](https://stripe.com/docs/api/identity/verification_sessions/create) and ephemeral key secret, then you can send a POST request to create verification session:

```ts
const fetchVerificationSessionParams = async () => {
  try {
    const data = await fetch(
      `${YOUR_SERVER_BASE_URL}/create-verification-session`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {},
      }
    );
    const json = await data.json();
    return json;
  } catch (e) {
    return {};
  }
};
```

Once you get options you can use `useStripeIdentity` passing fetchOptions to it.

```tsx
// HomeScreen.tsx
import { useStripeIdentity } from '@stripe/stripe-identity-react-native';
import logo from './assets/logo.png';

function HomeScreen() {
  const fetchOptions = async () => {
    const response = await fetchVerificationSessionParams();

    return {
      sessionId: response.id,
      ephemeralKeySecret: response.ephemeral_key_secret,
      brandLogo: Image.resolveAssetSource(logo),
    };
  };

  const { status, present, loading } = useStripeIdentity(fetchOptions);

  const handlePress = useCallback(() => {
    present();
  }, [present]);

  const renderButton = useCallback(() => {
    if (loading) {
      return <ActivityIndicator />;
    }
    return <Button title="Verify Identity" onPress={handlePress} />;
  }, [loading, handlePress]);

  return (
    <View>
      <View>{renderButton()}</View>
      <Text>Status: {status}</Text>
    </View>
  );
}
```

Or if you don't want to use `useStripeIdentity` hook, you can also use this method to create your own implementation:

```tsx
// HomeScreen.tsx
import { useState } from 'react';
import { presentIdentityVerificationSheet } from '@stripe/stripe-identity-react-native';
import logo from './assets/logo.png';

function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<
    IdentityVerificationSheetStatus | undefined
  >();
  const [error, setError] = useState<StripeError | undefined>();

  const fetchOptions = async () => {
    const response = await fetchVerificationSessionParams();

    return {
      sessionId: response.id,
      ephemeralKeySecret: response.ephemeral_key_secret,
      brandLogo: Image.resolveAssetSource(logo),
    };
  };

  const present = async () => {
    setLoading(true);
    const options = await fetchOptions();
    setLoading(false);
    const { status, error } = await presentIdentityVerificationSheet(options);
    setStatus(status);
    setError(error);
  };

  const handlePress = useCallback(() => {
    present();
  }, [present]);

  const renderButton = useCallback(() => {
    if (loading) {
      return <ActivityIndicator />;
    }
    return <Button title="Verify Identity" onPress={handlePress} />;
  }, [loading, handlePress]);

  return (
    <View>
      <View>{renderButton()}</View>
      <Text>Status: {status}</Text>
    </View>
  );
}
```

There are two types available: StripeError and IdentityVerificationSheetStatus, you can import these in your TypeScript project directly from Stripe Identity React Native SDK:

```tsx
import type {
  StripeError,
  IdentityVerificationSheetStatus,
} from '@stripe/stripe-identity-react-native';
```

## Run the example app

- Run this command from root folder
  - `cd example && yarn`
- Install pods for iOS and update StripeIdentity
  - `cd ios && pod install && pod update StripeIdentity`
- Run example app on a specific simulator/emulator from root folder
  - `yarn example ios`
  - or
  - `yarn example android`
- Or from example folder
  - `yarn ios`
  - or
  - `yarn android`

## Contributing

See the [contributor guidelines](CONTRIBUTING.md) to learn how to contribute to the repository.

# Stripe Identity React Native Expo Plugin

A plugin to use Stripe Identity verification in your Expo app.

## Installation

```sh
npx expo install stripe-identity-react-native-expo-plugin
```

## Configuration

Add the plugin to your Expo config (app.json, app.config.js, or app.config.ts):

```json
{
  "expo": {
    "plugins": ["stripe-identity-react-native-expo-plugin"]
  }
}
```

### Usage

```tsx
import { presentIdentityVerificationSheet } from 'stripe-identity-react-native-expo-plugin';

// In your component:
const verifyIdentity = async () => {
  try {
    const result = await presentIdentityVerificationSheet({
      verificationSessionId: 'vs_...'
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};
```

## Requirements

- Expo SDK 49 or higher
- iOS 13.0 or higher
- Android API level 21 or higher

## Features

- Automatic permission handling for camera access
- Material theme configuration for Android
- TypeScript support
