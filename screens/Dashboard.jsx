import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView,BackHandler} from 'react-native';
import { UserTypeConstant } from '../constants/userType.constant';
import { sOptions, tOptions } from '../constants/dashboardOptions.constant';
import {getLoginDetails} from '../helper/auth.helper';
import { requestUserPermission,notificationListener} from '../services/fcm.services';

const Dashboard = ({navigation}) => {
  const handlePress = (name) => () => {
    navigation.navigate(name);
  };
  const [options,setOptions]=useState([]);
  const [name,setName]=useState("");
  const [subtitle,setsubtitle]=useState("");


  useFocusEffect(()=>{
      async function getLoginDetail() {
        const val=await getLoginDetails();
        console.log(val);
        if(val.StuStaffTypeId==UserTypeConstant.Student){
          setOptions(sOptions);
          AsyncStorage.getItem('Profile').then((response)=>{
            setName(JSON.parse(response).studentname);
            setsubtitle(JSON.parse(response).classname+" "+JSON.parse(response).sectionname);
          })
        }
        if(val.StuStaffTypeId==UserTypeConstant.Teacher){
          setOptions(tOptions);
          AsyncStorage.getItem('Profile').then((response)=>{
            setName(JSON.parse(response).firstname+" "+JSON.parse(response).lastname);
            setsubtitle(JSON.parse(response).departmentname);
          })
        }
      }
      getLoginDetail();
    requestUserPermission();
    notificationListener();
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  });

  const handleBackPress = () => {
    BackHandler.exitApp();
    return true;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.class}>{subtitle}</Text>
        </View>
        <Image
          source={require('../assets/user1.jpg')}
          alt='Profile Picture'
          style={styles.profilePicture}
          resizeMode="cover"
        />
      </View>
      <View style={styles.optionsSection}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={handlePress(option.name)}
          >
            <Image source={option.image} style={styles.optionImage} />
            <Text style={styles.optionText}>{option.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 60,
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#eaeaf4',
  },
  profileInfo: {
    // marginRight: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color:"#222222"
  },
  class: {
    fontSize: 16,
    color: '#222222',
    fontWeight: 'normal',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 60,
    borderWidth: 7,
    borderColor: '#233698',
  },
  optionsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 20,
    padding: 20,
  },
  option: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 30,
  },
  optionImage: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  optionText: {
    textAlign: 'center',
    color:"#222222",
    fontWeight: 'normal',
  },
});

export default Dashboard;
