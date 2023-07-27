import React,{useEffect} from 'react';
import { PermissionsAndroid,View, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Splash = ({navigation}) => {
    const checkApplicationPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,);
            } catch (error) {
                console.log(error);
            }
        }
    };
    useEffect(() => {  
        checkApplicationPermission();
        AsyncStorage.getItem('isLoggedIn').then(val=>{
            if(val==="true"){
                setTimeout(() => {
                    navigation.navigate('MainTabs');
                }, 1500);
            }else{
                setTimeout(() => {
                    navigation.navigate('Login');
                }, 1500);
            }
        })
    },[]);

    return (
        <View style={styles.container}>
            <Image source={require('../assets/app_logo.png')} style={styles.image} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#233698',
        alignItems: 'center',
        justifyContent: 'center',
      },
      image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
      },
});

export default Splash;