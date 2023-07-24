import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity,ScrollView } from 'react-native';

const SignUp = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignUp = () => {
    setErrorMessage('');
    let error = '';

    if (!firstName || !lastName || !mobileNumber || !email || !password || !confirmPassword) {
      error = 'All fields are required';
    } else if (mobileNumber.length !== 10) {
      error = 'Enter mobile number of 10 digits';
    } else if (!isValidEmail(email)) {
      error = 'Enter a valid email like xyz@xyz.com/in';
    } else if (password !== confirmPassword) {
      error = 'Confirm password should match password';
    }

    setErrorMessage(error);

    if (!error) {
      // Perform signup logic here
      console.log('SignUp:', {
        firstName,
        lastName,
        mobileNumber,
        email,
        password,
        confirmPassword,
      });
    }
  };

  const isValidEmail = (email) => {
    // Simple email validation regex pattern
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <ScrollView>
      <Text style={styles.heading}>Welcome To,</Text>
      <Text style={styles.subheading}>GLOBAL-EDU</Text>
      <Text style={styles.subtitle}>Please Register here</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#ccc"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#ccc"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          keyboardType="numeric"
          placeholderTextColor="#ccc"
          maxLength={10}
          value={mobileNumber}
          onChangeText={setMobileNumber}
        />
        <View style={styles.noteContainer}>
          <Text style={styles.note}>Enter mobile number of 10 digits</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
        />
        <View style={styles.noteContainer}>
          <Text style={styles.note}>Enter a valid email like xyz@xyz.com/in</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <View style={styles.noteContainer}>
          <Text style={styles.note}>Confirm Password is same as Password</Text>
        </View>
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}

        <TouchableOpacity style={styles.registerButton} onPress={handleSignUp}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backToLoginButton} onPress={handleBackToLogin}>
          <Text style={styles.backToLoginButtonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    backgroundColor: '#233698',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
    color: '#fff',
  },
  subheading: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#fff',
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '90%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: '#000',
  },
  noteContainer: {
    alignSelf: 'flex-start',
    marginLeft: 30,
    marginBottom: 10,
  },
  note: {
    fontSize: 14,
    color: '#ffc409',
  },
  errorMessage: {
    fontSize: 14,
    color: 'red',
    marginTop: 5,
    marginBottom: 10,
  },
  registerButton: {
    width: '60%',
    borderWidth: 1,
    borderColor: '#ffc409',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    backgroundColor:"#ffc409",
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  backToLoginButton: {
    marginTop: 10,
  },
  backToLoginButtonText: {
    fontSize: 18,
    color: '#fff',
    textDecorationLine: 'underline',
  },
});

export default SignUp;
