export type IdentityVerificationSheetOptions = {
  verificationSessionId: string;
  ephemeralKeySecret?: string;
  brandLogo?: {
    uri?: string;
    width?: number;
    height?: number;
    scale?: number;
  };
};

export type IdentityVerificationSheetStatus =
  | 'FlowCompleted'
  | 'FlowCanceled'
  | 'FlowFailed'
  | 'Undefined';

export type IdentityVerificationSheetResult = {
  status: IdentityVerificationSheetStatus;
  error?: StripeError;
};

export type InitIdentityVerificationSheet = (
  options: IdentityVerificationSheetOptions
) => Promise<void>;

export type PresentIdentityVerificationSheet =
  () => Promise<IdentityVerificationSheetResult>;

export type ErrorType =
  | 'api_connection_error'
  | 'api_error'
  | 'authentication_error'
  | 'card_error'
  | 'idempotency_error'
  | 'invalid_request_error'
  | 'rate_limit_error';

export type StripeError = {
  code: string;
  message: string;
  localizedMessage?: string;
  declineCode?: string;
  stripeErrorCode?: string;
  type?: ErrorType;
};
