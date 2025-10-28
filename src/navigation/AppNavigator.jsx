import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import AnimalFormScreen from '../screens/AnimalFormScreen';
import AnimalDetailScreen from '../screens/AnimalDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import colors from '../constants/colors';
import Toast from 'react-native-toast-message';



const Stack = createNativeStackNavigator();

function AppNavigator (){

    return(
      <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
   <NavigationContainer>
     <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} /> 
         <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} /> 
         <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />   
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AnimalForm" component={AnimalFormScreen} />
          <Stack.Screen name="AnimalDetail" component={AnimalDetailScreen} /> 
        <Stack.Screen name="Settings" component={SettingsScreen} />   
      </Stack.Navigator>
      <Toast position="top" topOffset={50}/>
    </NavigationContainer>
  </SafeAreaView>
    </SafeAreaProvider>
   
    )
}
export default AppNavigator;