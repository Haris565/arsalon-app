import { initStripe } from '@stripe/stripe-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text } from 'react-native';
import COLORS from '../consts/color';
import { fetchPublishableKey } from '../helpers';



const PaymentScreen = ({ paymentMethod, children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initialize() {
        const publishableKey = "pk_test_51JVLh7GHsDLdda7Zw1h5Qb4UKMOboJVO3klC09CytOh6qBaPAdEiUOIZyunCQKlJmBPdhG47cax8etvHZ5mvRb1O00At4F5Huy"
      if (publishableKey) {
        await initStripe({
          publishableKey,
          merchantIdentifier: 'merchant.com.stripe.react.native',
          urlScheme: 'stripe-example',
          setUrlSchemeOnAndroid: true,
        });
        setLoading(false);
        console.log("PaymentScreen")

      }
    }
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loading ? (
    <ActivityIndicator size="large" style={StyleSheet.absoluteFill} />
  ) : (
    <ScrollView
      accessibilityLabel="payment-screen"
      style={styles.container}
      keyboardShouldPersistTaps="handled">
      {children}
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <Text style={{ opacity: 0 }}>appium fix</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
});

export default PaymentScreen;
