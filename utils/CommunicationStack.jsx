import { createStackNavigator } from '@react-navigation/stack';
import CommunicationTabs from './CommunicationTabs';
import CommunicationDetail from '../screens/CommunicationDetail';
import SendCommunication from '../screens/SendCommunication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserTypeConstant } from '../constants/userType.constant';
import React,{useState,useEffect} from 'react';

const Stack = createStackNavigator();

export default function CommunicationStack({ navigation}) {
    const [visible, setVisible] = useState(false);

    useEffect(()=>{
        AsyncStorage.getItem('loginDetails').then((response)=>{
            if(JSON.parse(response).StuStaffTypeId==UserTypeConstant.Teacher){
                setVisible(true);
            }
        })
    },[])

    return (
        <Stack.Navigator initialRouteName='Communications' screenOptions={{
            headerShown: true,
            headerTitleAlign:'center',
            headerStyle:{backgroundColor: '#233698'},
            headerTintColor:"#ffffff",
            title: 'Communication',
        }}>
            <Stack.Screen name="Communications" >{()=><CommunicationTabs navigation={navigation}/>}</Stack.Screen>
            <Stack.Screen name="CommunicationDetail" component={CommunicationDetail} />
            { visible && <Stack.Screen name="Send Communication" component={SendCommunication} options={{title: 'Send Communication'}}/>}
        </Stack.Navigator>
    );
}