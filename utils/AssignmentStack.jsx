import { createStackNavigator } from '@react-navigation/stack';
import Assignment from '../screens/Assignment';
import AssignmentDetail from '../screens/AssignmentDetail';

const Stack = createStackNavigator();

export default function AssignmentStack() {
    return (
        <Stack.Navigator initialRouteName='Assignments' screenOptions={{
            headerShown: true,
            headerTitleAlign:'center',
            headerStyle:{backgroundColor: '#233698'},
            headerTintColor:"#ffffff",
            title: 'Assignments',
        }}>
            <Stack.Screen name="Assignments" component={Assignment} />
            <Stack.Screen name="AssignmentDetail" component={AssignmentDetail} />
        </Stack.Navigator>
    );
}