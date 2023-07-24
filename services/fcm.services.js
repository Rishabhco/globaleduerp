import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { menuIDConstant } from '../constants/menuID.constant';
import { menuCodeConstant } from '../constants/menuCode.constant';
import { screenIDConstant } from '../constants/screenID.constant';
import { performDataOperation } from './generic.services';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    getFCMToken();
  }
}

const getFCMToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log('fcmToken', fcmToken);
    if (!fcmToken) {
        try{
            const fcmToken = await messaging().getToken();
            if (fcmToken) {
                await AsyncStorage.setItem('fcmToken', fcmToken);
                console.log('fcmToken', fcmToken);
                saveToken();
            }
        }catch(error){
            console.log('Failed', 'No token received');
        }
    }
}

export const notificationListener = async () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('Notification caused app to open from background state:', remoteMessage.notification);
    });
    messaging().onMessage(async(remoteMessage)=>{
        console.log('FCM Message foreground:', remoteMessage.notification);
    })
    messaging().getInitialNotification().then(remoteMessage => {
        if (remoteMessage) {
            console.log('Notification caused app to open from quit state:',remoteMessage.notification);
        }
    });
};

const saveToken = async () => {
    const fcmToken = await AsyncStorage.getItem('fcmToken');
    const device={
        model:DeviceInfo.getModel(),
        manufacturer:await DeviceInfo.getManufacturer(),
        operatingSystem:DeviceInfo.getSystemName(),
        osVersion:DeviceInfo.getSystemVersion(),
    }
    const model={
        menuID:menuIDConstant.MobileGeneric,
        menuCode:menuCodeConstant.MobileGeneric,
        screenID:screenIDConstant.MOBILE_SAVE_TOKEN,
        operation:"Add",
        rows:{
            data:[{
                rowIndex:0,
                keyName:'deviceInfo',
                valueData:JSON.stringify(device)
            },{
                rowIndex:0,
                keyName:'token',
                valueData:fcmToken
            },{
                rowIndex:0,
                keyName:'oldtoken',
                valueData:''
            }]
        }
    }
    performDataOperation(model).then(res=>{
        console.log(res);
    }).catch(error=>{
        console.log(error);
    });
};
