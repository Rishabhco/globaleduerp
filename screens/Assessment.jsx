import React,{useEffect} from 'react';
import { View, Text, StyleSheet,BackHandler } from 'react-native';

const Assessment = ({navigation}) => {
    useEffect(() => {
        const handleBackPress = () => {
            navigation.goBack();
            return true;
          };
          BackHandler.addEventListener('hardwareBackPress', handleBackPress);
          return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
          };
    },[])
    return (
        <View style={styles.container}>
            <Text style={styles.logo}>My App</Text>
            <Text style={styles.text}>Welcome to the Assessment!</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems:'center',
        justifyContent: 'center',
    },
    logo: {
        fontWeight: 'bold',
        fontSize: 30,
        color: '#fb5b5a',
        marginBottom: 40,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#fb5b5a',
        marginBottom: 40,
    },
});

export default Assessment;