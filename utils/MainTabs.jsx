import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import DashboardStack from './DashboardStack';
import Profile from '../screens/Profile';
import SettingsScreen from '../screens/Settings';
import NotificationsScreen from '../screens/Notifications';
import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <>
      <Tab.Navigator initialRouteName="Dashboard" screenOptions={{
          tabBarStyle: { backgroundColor:"#233698",height:60,paddingTop:10,paddingBottom:10},
          tabBarShowLabel:false,
          tabBarActiveTintColor:"#ffffff",
          tabBarInactiveTintColor:"#ffffff",
      }}>
        <Tab.Screen name="Dashboard" component={DashboardStack}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="home" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen name="Profile" component={Profile}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="user" color={color} size={size} />
            ),
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle:{
              backgroundColor: '#233698', 
            },
            headerTitleStyle:{
              color: '#ffffff',
            }
          }}
        />
        <Tab.Screen name="Settings" component={SettingsScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="gear" color={color} size={size} />
            ),
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle:{
              backgroundColor: '#233698', 
            },
            headerTitleStyle:{
              color: '#ffffff',
            }
          }}
        />
        <Tab.Screen name="Notifications" component={NotificationsScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="bell" color={color} size={size} />
            ),
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle:{
              backgroundColor: '#233698', 
            },
            headerTitleStyle:{
              color: '#ffffff',
            }
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default MainTabs;