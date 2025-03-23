# Stripe Identity Expo Example

This example demonstrates how to use the Stripe Identity plugin in an Expo app.

## Setup

1. Install dependencies:
```sh
npm install
```

2. Create a server endpoint that creates a VerificationSession. Here's an example using Express:

```typescript
import express from 'express';
import Stripe from 'stripe';

const app = express();
const stripe = new Stripe('your_stripe_secret_key', {
  apiVersion: '2023-10-16',
});

app.post('/create-verification-session', async (req, res) => {
  try {
    const verificationSession = await stripe.identity.verificationSessions.create({
      type: 'document',
      metadata: {
        user_id: 'user_123', // Your user's ID
      }
    });

    // Create an ephemeral key for the verification session
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { verification_session: verificationSession.id },
      { apiVersion: '2023-10-16' }
    );

    res.json({
      id: verificationSession.id,
      ephemeral_key_secret: ephemeralKey.secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
```

3. Update the verifyIdentity function in App.js with your server URL:

```typescript
const verifyIdentity = async () => {
  try {
    const response = await fetch('YOUR_SERVER_URL/create-verification-session', {
      method: 'POST',
    });
    const { id, ephemeral_key_secret } = await response.json();
    
    const result = await presentIdentityVerificationSheet({
      verificationSessionId: id,
      ephemeralKeySecret: ephemeral_key_secret,
    });
    
    console.log('Verification result:', result);
  } catch (error) {
    console.error('Verification error:', error);
  }
};
```

## Running the Example

For iOS:
```sh
npm run ios
```

For Android:
```sh
npm run android
```

## Note

Make sure you have [enabled Identity Verification](https://dashboard.stripe.com/settings/identity) in your Stripe Dashboard before testing.