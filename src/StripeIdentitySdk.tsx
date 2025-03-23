import { NativeModules, Platform } from 'react-native';
import type {
  IdentityVerificationSheetOptions,
  IdentityVerificationSheetResult,
} from './types';

const LINKING_ERROR =
  `The package 'stripe-identity-react-native-expo-plugin' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n';

const StripeIdentityModule = NativeModules.StripeIdentityReactNative
  ? NativeModules.StripeIdentityReactNative
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export async function presentIdentityVerificationSheet(
  options: IdentityVerificationSheetOptions
): Promise<IdentityVerificationSheetResult> {
  try {
    const result = await StripeIdentityModule.presentIdentityVerificationSheet(options);
    return result;
  } catch (error) {
    throw error;
  }
}
