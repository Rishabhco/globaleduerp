import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import BirthdayList from '../screens/BirthdayList';
import React,{useEffect} from 'react';
import { BackHandler} from 'react-native';

const Tab = createMaterialTopTabNavigator();

function BirthdayListTabs({navigation}) {
  useEffect(() => {
    const handleBackPress = () => {
      navigation.goBack();
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => { BackHandler.removeEventListener('hardwareBackPress', handleBackPress);};
  }, []);
  return (
    <Tab.Navigator initialRouteName='Staff'>
      <Tab.Screen name="Staff">{() => <BirthdayList name="Staff"/>}</Tab.Screen>
      <Tab.Screen name="Students">{() => <BirthdayList name="Students"/>}</Tab.Screen>
    </Tab.Navigator>
  );
}

export default BirthdayListTabs;