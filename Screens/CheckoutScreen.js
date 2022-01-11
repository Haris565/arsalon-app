import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import Button from '../Components/Button';
import PaymentScreen from '../Components/PaymentScreen';
import axios from 'axios';



export default function PaymentsUICompleteScreen() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [paymentSheetEnabled, setPaymentSheetEnabled] = useState(false);
  const [loading, setLoadng] = useState(false);
  const [clientSecret, setClientSecret] = useState();

  const fetchPaymentSheetParams = async () => {

    try {
      let response = await axios.post('http://1fee-119-73-118-245.ngrok.io/create-payment-intent')
      let  {clientsecret} = response.data
      setClientSecret(clientsecret);
      console.log(clientsecret)
      return {
        clientsecret
       };
    }
    catch (e){
      console.log("error")
    }
    // axios.post('http://c55e-119-73-118-245.ngrok.io/create-payment-intent')
    // .then(function (response) {
    //   let  {clientsecret} = response.data
    //   setClientSecret(clientsecret);
    //   console.log(clientsecret)
    //   return {
    //     clientsecret
    //    };
    // })
    // .catch(function (error) {
    //   console.log(error);
    // });


    // const response = await fetch(`http://42e7-119-73-118-245.ngrok.io/create-payment-intent`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });
    // // const { paymentIntent, ephemeralKey, customer } = await response.json();
    // // console.log(paymentIntent, ephemeralKey, customer)
    // const res = await response.json();
    // console.log(res)
    // setClientSecret(res);
    // // return {
    // //   paymentIntent,
    // //   ephemeralKey,
    // //   customer,
    // // };
    // return {
    //  clientsecret
    // };
  };

  const openPaymentSheet = async () => {
    if (!clientSecret) {
      return;
    }
    setLoadng(true);
    const { error } = await presentPaymentSheet({
      clientSecret,
    });

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'The payment was confirmed successfully');
    }
    setPaymentSheetEnabled(false);
    setLoadng(false);
  };

  const initialisePaymentSheet = async () => {
    const {
      clientsecret
    } = await fetchPaymentSheetParams();
    console.log(clientsecret, "123")

    const { error } = await initPaymentSheet({
    
      paymentIntentClientSecret: clientsecret,
      customFlow: false,
      merchantDisplayName: 'Example Inc.',
      style: 'alwaysDark',
    });
    if (!error) {
      setPaymentSheetEnabled(true);
    }
  };

  useEffect(() => {
    // In your app’s checkout, make a network request to the backend and initialize PaymentSheet.
    // To reduce loading time, make this request before the Checkout button is tapped, e.g. when the screen is loaded.
    initialisePaymentSheet();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PaymentScreen>
      <Button
        variant="primary"
        loading={loading}
        disabled={!paymentSheetEnabled}
        title="Checkout"
        onPress={openPaymentSheet}
      />
    </PaymentScreen>
  );
}
