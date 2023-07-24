import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AboutUs from '../screens/AboutUs';
import React,{useEffect} from 'react';
import { BackHandler} from 'react-native';

const Tab = createMaterialTopTabNavigator();

function NewsAndEventsGalleryStack({navigation}) {
  useEffect(() => {
    const handleBackPress = () => {
        navigation.goBack();
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
  }, []);
  return (
    <Tab.Navigator>
      <Tab.Screen name="News" component={AboutUs} />
      <Tab.Screen name="Event Gallery" component={AboutUs} />
    </Tab.Navigator>
  );
}

export default NewsAndEventsGalleryStack;