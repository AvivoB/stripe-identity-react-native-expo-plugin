import { useState, useCallback } from 'react';
import { presentIdentityVerificationSheet } from '../StripeIdentitySdk';
import type {
  IdentityVerificationSheetOptions,
  IdentityVerificationSheetStatus,
  StripeError,
} from '../types';

/**
 * useStripeIdentity hook.
 *
 * This hook provides access to the present method,
 * verification status, and loading flag.
 *
 * @param optionsProvider - An optionsProvider method that fetches the
 * VerificationSession ID, ephemeral key secret, and brandLogo.
 *
 * @example
 * ```ts
 * const fechOptionsProvider = async () => {
 *    const response = await fetch('https://${YOUR_SERVER_BASE_URL}/create-verification-session');
 *    const { id, ephemeral_key_secret } = await response.json();
 *    return {
 *      sessionId: id,
 *      ephemeralKeySecret: ephemeral_key_secret,
 *      brandLogo: Image.resolveAssetSource(logo),
 *    };
 *  };
 *
 * const { present, status, loading, error } = useStripeIdentity(fetchOptionsProvider)
 * ```
 */

type FetchVerificationOptionsCallback = () => Promise<IdentityVerificationSheetOptions>;

export function useStripeIdentity(fetchOptionsCallback: FetchVerificationOptionsCallback) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<IdentityVerificationSheetStatus>();
  const [error, setError] = useState<StripeError>();

  const present = useCallback(async () => {
    setLoading(true);
    try {
      const options = await fetchOptionsCallback();
      const result = await presentIdentityVerificationSheet(options);
      setStatus(result.status);
      if (result.error) {
        setError(result.error);
      }
    } catch (e) {
      setError(e as StripeError);
    } finally {
      setLoading(false);
    }
  }, [fetchOptionsCallback]);

  return {
    present,
    loading,
    status,
    error,
  };
}
