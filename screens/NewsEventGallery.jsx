import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NewsEventGallery = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.logo}>My App</Text>
            <Text style={styles.text}>Welcome to the NewsEventGallery!</Text>
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

export default NewsEventGallery;