import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { Button, ToastAndroid, View } from 'react-native';
import auth from '@react-native-firebase/auth';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  GoogleSignin.configure({
    webClientId: '980312292967-lkbl5faq39tofi5ukt6h4e0jprcdagb4.apps.googleusercontent.com',
  });
  function sighOut(){
    auth().signOut().then(()=>{
      console.log("SignOut");
      GoogleSignin.revokeAccess();
    })
  }
  async function onGoogleButtonPress() {
    try{
      // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const userInfo = await GoogleSignin.signIn();
    console.log(userInfo.data?.user);
  
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(userInfo!.data!.idToken);
    console.log(googleCredential);
    if(googleCredential){
      ToastAndroid.show("DANG NHAP THANH CONG", ToastAndroid.SHORT);
    }
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
    }catch(error: any){
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        ToastAndroid.show("error occured SIGN_IN_CANCELLED", ToastAndroid.SHORT);
        console.log("error occured SIGN_IN_CANCELLED");
        // user cancelled the login flow
    } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("error occured IN_PROGRESS");
        // operation (f.e. sign in) is in progress already
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("error occured PLAY_SERVICES_NOT_AVAILABLE");
    } else {
        console.log(error)
        console.log("error occured unknow error");
        ToastAndroid.show("BAN DA HUY DANG NHAP!", ToastAndroid.SHORT);
    }
    }
  }   
  return (
    <View style={{flex: 2, backgroundColor:"grey",display:"flex",justifyContent:"center",alignItems:"center"}}>
    <Button color={"green"}
      title="Google Sign-In"
      onPress={()=>onGoogleButtonPress()}
    />
    <Button color={"blue"}
      title="Google Sign-Out"
      onPress={()=>sighOut()}
    />
    </View>
  );
}
