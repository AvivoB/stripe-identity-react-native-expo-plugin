// Hooks
export { useStripeIdentity } from './hooks/useStripeIdentity';

// Functions
export { presentIdentityVerificationSheet } from './StripeIdentitySdk';

// Types
export type {
  IdentityVerificationSheetOptions,
  IdentityVerificationSheetResult,
  IdentityVerificationSheetStatus,
  ErrorType,
  StripeError,
} from './types';
