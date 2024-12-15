import React, { useState } from 'react';
import { TextInput, View, StyleSheet, Text, Button, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
     const [firstName, setFirstName] = useState('');
     const [lastName, setLastName] = useState('');
     const [email, setEmail] = useState('');
     const [username, setUsername] = useState('');
     const [password, setPassword] = useState('');
     const [confirm, setConfirm] = useState('');

     const navigation = useNavigation();

     const handleSubmit = () => {
         if(password == confirm){
             handleRegister();
         }
         else{
             throw new Error('Passwords do not match');
         }
     }

     const handleRegister = async () => {
         try {
             const response = await fetch('http://192.168.1.28:5189/api/user/register', {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ firstName: firstName, lastName: lastName, email: email, username: username, password: password }),
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
            <Text style={{ fontWeight: 'bold' }}>First Name</Text>
            <TextInput
                style={styles.field}
                placeholder="Enter First Name"
                value={firstName}
                onChangeText={setFirstName}
            />
            <Text></Text>
            <Text style={{ fontWeight: 'bold' }}>Last Name</Text>
            <TextInput
                style={styles.field}
                placeholder="Enter Last Name"
                value={lastName}
                onChangeText={setLastName}
            />
            <Text></Text>
            <Text style={{ fontWeight: 'bold' }}>Email</Text>
            <TextInput
                style={styles.field}
                placeholder="Enter Email"
                value={email}
                onChangeText={setEmail}
            />
            <Text></Text>
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
            <Text style={{ fontWeight: 'bold' }}>Confirm Password</Text>
            <TextInput
                style={styles.field}
                placeholder="Enter Confirmation"
                value={confirm}
                onChangeText={setConfirm}
            />
            <Text></Text>
            <Text></Text>
            <Button title="Submit" onPress={handleSubmit} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        top: 50
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