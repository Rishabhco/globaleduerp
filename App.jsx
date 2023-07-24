import React, { useState,useEffect,useRef} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import Login from './screens/Login';
import MainTabs from './utils/MainTabs';
import SignUp from './screens/SignUp';
import ForgotPassword from './screens/ForgotPassword';
import Splash from './screens/Splash';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName='Splash'>
        <Stack.Screen name="Splash" component={Splash}/>
        <Stack.Screen name="MainTabs" component={MainTabs}/>
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
