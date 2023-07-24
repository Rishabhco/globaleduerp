import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const ForgotPassword = ({ navigation }) => {
  const [schoolCode, setSchoolCode] = useState('');
  const [loginId, setLoginId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = () => {
    if (!schoolCode || !username || !password) {
        setErrorMessage('All fields are required');
    } else {
        // Perform login logic here
        console.log('Reset password for:', schoolCode, loginId);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Forgot Password?</Text>
      <Text style={styles.subtitle}>Provide your account's email for which you want to reset your password</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="School Code"
          placeholderTextColor="#ccc"
          value={schoolCode}
          onChangeText={setSchoolCode}
        />
        <View style={styles.loginContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Your Login ID"
          placeholderTextColor="#ccc"
          value={loginId}
          onChangeText={setLoginId}
        />
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}
        </View>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backToLoginButton} onPress={handleBackToLogin}>
          <Text style={styles.backToLoginButtonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#233698',
  },
  heading: {
    marginTop: 80,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    color: '#fff'
  },
  formContainer: {
    width: '80%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  loginContainer: {
    width: '100%',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: 'red',
  },
  submitButton: {
    width: '70%',
    borderWidth: 1,
    borderColor: '#ffc409',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor:"#ffc409"
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  backToLoginButton: {
    marginTop: 40,
  },
  backToLoginButtonText: {
    fontSize: 16,
    color: 'white',
    textDecorationLine: 'underline',
  },
});

export default ForgotPassword;
