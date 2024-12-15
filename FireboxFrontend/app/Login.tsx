import React, { useState } from 'react';
import { TextInput, View, StyleSheet, Text, Button, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigation = useNavigation();

    const handleSubmit = () => {
        handleLogin();
    }

    const handleLogin = async () => {
        try {
            const response = await fetch('http://192.168.1.28:5189/api/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username, password: password }),
            });
            if(response.ok){
                navigation.navigate('Welcome Home!');
            }
            else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            console.error('Caught error:', error);
        }
    }

    return (
        <View style={styles.container}>
            <Image source={require('@/assets/images/FBG_Logo.png')} style={styles.logoFBG}/>
            <Text style={{ fontWeight: 'bold' }}>Username</Text>
            <TextInput
                style={styles.field}
                placeholder="Enter Username"
                value={username}
                onChangeText={setUsername}
            />
            <Text></Text>
            <Text style={{ fontWeight: 'bold' }}>Password</Text>
            <TextInput
                style={styles.field}
                placeholder="Enter Password"
                value={password}
                onChangeText={setPassword}
            />
            <Text></Text>
            <Text></Text>
            <Button title="Submit" onPress={handleSubmit} />
            <Text></Text>
            <Button title="Forgot Password?" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        top: 100
    },
    logoFBG: {
        height: 100,
        width: 125
    },
    field: {
        height: 35,
        width: 200,
        borderColor: 'black',
        borderWidth: 1
    }
});