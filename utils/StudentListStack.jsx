import React from 'react';
import { TouchableOpacity,Text,StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import StudentList from '../screens/StudentList';
import StudentProfile from '../screens/StudentProfile';

const Stack = createStackNavigator();

export default function StudentListStack({ navigation}) {
    return (
        <Stack.Navigator initialRouteName='Student Lists' screenOptions={{
            headerShown: true,
            headerTitleAlign:'center',
            headerStyle: { backgroundColor: '#233698' },
            headerTintColor: '#ffffff',
        }}>
            <Stack.Screen name="Student Lists" component={StudentList} options={{ headerTitle:"Student List"}} />
            <Stack.Screen name="Student Profile" component={StudentProfile} />
        </Stack.Navigator>
    );
}