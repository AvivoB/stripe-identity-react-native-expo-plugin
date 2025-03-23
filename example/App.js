import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { presentIdentityVerificationSheet } from 'stripe-identity-react-native-expo-plugin';

export default function App() {
  const verifyIdentity = async () => {
    try {
      const result = await presentIdentityVerificationSheet({
        verificationSessionId: 'DEMO_SESSION_ID', // Replace with your actual session ID
      });
      console.log('Verification result:', result);
    } catch (error) {
      console.error('Verification error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Stripe Identity Verification Demo</Text>
      <Button title="Verify Identity" onPress={verifyIdentity} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
});