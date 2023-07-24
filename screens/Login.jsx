import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image,BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getSchoolDetails from '../services/global.services';
import { login } from '../services/auth.services';
import { UserTypeConstant } from '../constants/userType.constant';
import { getStudentDetails,getTeacherDetails } from '../services/user.services';
import { setStudentDetails,setTeacherDetails } from '../services/application.context.services';

const Login = ({ navigation }) => {
  const [schoolCode, setSchoolCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useFocusEffect(()=>{
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  })

  const handleBackPress = () => {
    BackHandler.exitApp();
    return true;
  };

  const handleLogin = async () => {
    if (!schoolCode || !username || !password) {
      setErrorMessage('All fields are required');
    } else {
      getSchoolDetails(schoolCode).then((response) => {
        if (response.status === 200 && response.data.length!=0) {
          login(username,password).then(async (response) => {
            if (response.status === 200) {
              if(response.data.StuStaffTypeId==UserTypeConstant.Student){
                getStudentDetails().then(async (response) => {
                  setStudentDetails(response).then(async (res) => {
                    await AsyncStorage.setItem('isLoggedIn', 'true');
                    navigation.navigate('MainTabs');
                  });
                }).catch(error=>{
                  console.log(error.response.data);
                  setErrorMessage("Student Details not found");
                });
              }
              if(response.data.StuStaffTypeId==UserTypeConstant.Teacher){
                getTeacherDetails().then(async (res) => {
                  setTeacherDetails(res).then(async (response) => {
                    await AsyncStorage.setItem('isLoggedIn', 'true');
                    navigation.navigate('MainTabs');
                  });
                }).catch(error=>{
                  console.log(error.response.data);
                  setErrorMessage("Teacher Details not found");
                });
              }
            }else{
              setErrorMessage('Something Went Wrong');
            }
          }).catch((error) => {
            if(error.response.status === 400)
              setErrorMessage(error.response.data.error_description);
            else 
              setErrorMessage(error);
          });
        }else{
          setErrorMessage('School Code is not valid');
        }
      }).catch((error) => {
        console.log(error);
        if(error.response.status === 400)
          setErrorMessage(error.response.data.error_description);
        else
          setErrorMessage(error.response); 
      });
    }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  useEffect(() => {
    AsyncStorage.getItem('schoolcode').then((response) => {
      setSchoolCode(response);
      setUsername('');
      setPassword('');
      setErrorMessage('');
    });
  }, []);



  return (
    <View style={styles.container}>
      <Text style={styles.appName}>GE-ERP</Text>
      <Text style={styles.subtitle}>Please Login to continue</Text>

      <View style={styles.passwordContainer}>
      <TextInput
        style={styles.input}
        placeholder="School Code *"
        placeholderTextColor="#ccc"
        value={schoolCode}
        onChangeText={setSchoolCode}
      />
      <TextInput
        style={styles.input}
        placeholder="Username *"
        placeholderTextColor="#ccc"
        value={username}
        onChangeText={setUsername}
      />
        <TextInput
          style={styles.input}
          placeholder="Password *"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionButton} onPress={handleForgotPassword}>
          <Text style={styles.optionButtonText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={handleSignUp}>
          <Text style={styles.optionButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Image
          source={require('../assets/app_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.poweredBy}>Powered by GlobalEduErp LLP</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#233698',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    width: '90%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#fff',
    fontSize: 16,
  },
  passwordContainer: {
    width: '100%',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: 'red',
    marginTop: 5,
  },
  optionsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  optionButton: {
    marginLeft: 10,
    paddingVertical: 5,
  },
  optionButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  loginButton: {
    width: '60%',
    borderWidth: 1,
    borderColor: '#eaeaf4',
    backgroundColor: '#eaeaf4',
    borderRadius: 20,
    paddingVertical: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  footer: {
    alignItems: 'center',
    marginTop: 80,
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 10,
  },
  poweredBy: {
    fontSize: 12,
    color: '#fff',
  },
});

export default Login;
