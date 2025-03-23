import { NativeModules } from 'react-native';
import type {
  IdentityVerificationSheetOptions,
  IdentityVerificationSheetResult,
} from './types';

export async function presentIdentityVerificationSheet(
  options: IdentityVerificationSheetOptions
): Promise<IdentityVerificationSheetResult> {
  await NativeModules.StripeIdentityReactNative.initIdentityVerificationSheet(options);
  return await NativeModules.StripeIdentityReactNative.PresentIdentityVerificationSheet();
}
