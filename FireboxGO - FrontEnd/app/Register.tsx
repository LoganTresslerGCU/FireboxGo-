import React, { useState } from 'react';
import { TextInput, View, StyleSheet, Text, Button, Image, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [errorMessage, setErrorMessage] = useState({ email: '', username: '', password: '', confirm: ''});

    const navigation = useNavigation();

    const handleSubmit = () => {
        let errors = { email: '', username: '', password: '', confirm: '' };
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

        if (!email.trim()) errors.email = 'Email is required';

        if (!username.trim()) {
            errors.username = 'Username is required';
        }
        else if (username.length < 5) {
            errors.username = 'Username must be at least 5 characters';
        }
        else if (username.length > 20) {
            errors.username = 'Username must not be longer than 20 characters';
        }

        if (!password.trim()) {
            errors.password = 'Password is required';
        }
        else if (password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        }
        else if (!specialCharRegex.test(password)) {
            errors.password = 'Password must contain one special character';
        }

        if (!confirm.trim()) errors.confirm = 'Confirm your password';

        if (errors.email || errors.username || errors.password || errors.confirm) {
            setErrorMessage(errors);
            return;
        }

        if(password == confirm) {
            handleRegister();
        }
        else {
            setErrorMessage({ email: '', username: '', password: '', confirm: 'These passwords do not match'});
        }
    }

    const handleRegister = async () => {
        setErrorMessage({ email: '', username: '', password: '', confirm: ''});

        try {
            const response = await fetch('http://172.24.44.3:5189/api/user/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName: firstName, lastName: lastName, email: email, username: username, password: password }),
            });

            const responseText = await response.text();
            const apiResponse = Number(responseText);

            if(response.ok) {
                navigation.navigate('Home', { userID: apiResponse });
            }
            else {
                if(apiResponse == -1) {
                    setErrorMessage({ email: '', username: 'Username is already taken', password: '', confirm: ''});
                }
                else if(apiResponse == -2) {
                    setErrorMessage({ email: 'Email is already in use', username: '', password: '', confirm: ''});
                }
                else if(apiResponse == -3) {
                    setErrorMessage({ email: 'Email is already in use', username: 'Username is already taken', password: '', confirm: ''});
                }
                else if(apiResponse == -4) {
                    setErrorMessage({ email: '', username: '', password: '', confirm: 'Server error'});
                }
            }
        } catch (error) {
            setErrorMessage({ email: '', username: '', password: '', confirm: 'Server error'});
        }

    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.container}>
                    <Image source={require('../assets/Logo.png')} style={styles.logoFBG} resizeMode="contain"/>

                    <Text style={{ fontWeight: 'bold' }}>First Name</Text>
                    <TextInput
                        style={styles.field}
                        placeholder="Enter First Name"
                        value={firstName}
                        onChangeText={setFirstName}
                    />

                    <Text style={{ fontWeight: 'bold' }}>Last Name</Text>
                    <TextInput
                        style={styles.field}
                        placeholder="Enter Last Name"
                        value={lastName}
                        onChangeText={setLastName}
                    />

                    <Text style={{ fontWeight: 'bold' }}>Email</Text>
                    <TextInput
                        style={styles.field}
                        placeholder="Enter Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    {errorMessage.email ? <Text style={{ color: 'red' }}>{errorMessage.email}</Text> : null}

                    <Text style={{ fontWeight: 'bold' }}>Username</Text>
                    <TextInput
                        style={styles.field}
                        placeholder="Enter Username"
                        value={username}
                        onChangeText={setUsername}
                    />
                    {errorMessage.username ? <Text style={{ color: 'red' }}>{errorMessage.username}</Text> : null}

                    <Text style={{ fontWeight: 'bold' }}>Password</Text>
                    <TextInput
                        style={styles.field}
                        placeholder="Enter Password"
                        value={password}
                        secureTextEntry
                        onChangeText={setPassword}
                    />
                    {errorMessage.password ? <Text style={{ color: 'red' }}>{errorMessage.password}</Text> : null}

                    <Text style={{ fontWeight: 'bold' }}>Confirm Password</Text>
                    <TextInput
                        style={styles.field}
                        placeholder="Confirm Password"
                        value={confirm}
                        secureTextEntry
                        onChangeText={setConfirm}
                    />
                    {errorMessage.confirm ? <Text style={{ color: 'red' }}>{errorMessage.confirm}</Text> : null}

                    <Button title="Submit" onPress={handleSubmit} />
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    logoFBG: {
        width: 150,
        height: 150,
        marginBottom: 20
    },
    field: {
        width: '100%',
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderRadius: 5
    }
});