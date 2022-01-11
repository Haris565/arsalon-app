import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View, TouchableOpacity, ActivityIndicator, Text, Pressable, Modal } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import Button from '../Components/Button';
import PaymentScreen from '../Components/PaymentScreen';
import axios from 'axios';
import COLORS from '../consts/color';
import { useRoute, useNavigation } from '@react-navigation/native';
import { local_ip } from './../consts/ip';
import { Ionicons } from '@expo/vector-icons';



export default function Payment() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [paymentSheetEnabled, setPaymentSheetEnabled] = useState(false);
  const [Loading, setLoadng] = useState(false);
  const [loading, setloading] = useState(false)
  const [clientSecret, setClientSecret] = useState();
  const [showModal, setshowModal] = useState(false)
  const route = useRoute()
  const navigation= useNavigation()
  const booking= route.params.booking
  console.log(booking)

  
  const submitHandler = async ()=>{

    setloading(true)
  
    const response = await axios.post(`http://${local_ip}:5000/api/user/booking`, booking)
    console.log("api call", response.data)
    setloading(false)
    setshowModal(true)
    
}

  const fetchPaymentSheetParams = async () => {

    try {
        console.log("____________",booking)
      let response = await axios.post('http://8c00-119-73-118-245.ngrok.io/create-payment-intent', booking)
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
      submitHandler()
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
      <View style={{flex:1}}>


<Modal
                animationType="slide"
                // transparent={true}
                visible={showModal}
                presentationStyle='fullScreen'
                //onRequestClose={() => {
                // Alert.alert('Modal has been closed.');
                // }}
            >
                   <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                                <Ionicons name="checkmark-done" size={30} color={COLORS.primary} />
                                <Text style={styles.modalText}>Your appointment request has been forworded</Text>

                                <Pressable
                                    style={{ ...styles.openButton, backgroundColor: COLORS.primary }}
                                    onPress={() => {
                                        navigation.goBack()
                                    setshowModal(false);
                                    
                                }}>
                                    <Text style={styles.textStyle}>Ok</Text>
                                </Pressable>
                        </View>
                    </View>
                </Modal>


            <TouchableOpacity style={styles.btnPrimary} opacity={0.9} onPress={()=>{submitHandler()}} >
                {loading ? <ActivityIndicator size="large" color={COLORS.white} /> :
                <Text style={{color:COLORS.white, fontSize:16, fontWeight:'bold'}}>
                    Pay Later
                </Text>
                }
      
            </TouchableOpacity>

            <PaymentScreen>
                <Button
                    variant="primary"
                    loading={Loading}
                    disabled={!paymentSheetEnabled}
                    title="Pay online"
                    onPress={openPaymentSheet}
                />
                </PaymentScreen>
      </View>
   
  );
}
const styles = StyleSheet.create({
    headerImage:{
        height:350,
        borderBottomRightRadius: 40,
        borderBottomLeftRadius: 40,
        overflow: 'hidden',
    },
    header:{
        flexDirection:'row',    
        alignItems:"center",
        marginTop: 60,    
        marginHorizontal:20,
        justifyContent:'space-between'
    },
    iconCotainer:{
        position: 'relative',
        height:60,width:60,
        backgroundColor: COLORS.primary,
        borderRadius:40,
        top:-30,
        left:290,
        justifyContent:'center',
        alignItems:'center'
        
    },
    btnPrimary: {
        backgroundColor: COLORS.primary,
        height: 50,
        width:'80%',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom:20,
        marginTop: 30,
    },
    service:{
        flexDirection:"row",
        marginHorizontal:5,
        padding:10,
        borderRadius:10,
        height:50,
        marginTop: 20,
    },

    name:{
        
        fontSize:18,
        fontWeight:'bold',
        paddingHorizontal:10,
        marginRight: 5,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
      modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      openButton: {
        backgroundColor: '#F194FF',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
      },
      textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      modalText: {
        marginBottom: 15,
        textAlign: 'center',
        color:COLORS.primary
      },
})