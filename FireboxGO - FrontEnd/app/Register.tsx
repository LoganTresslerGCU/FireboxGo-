import React, { useState } from 'react';
import { TextInput, View, StyleSheet, Text, TouchableOpacity, Image, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
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

                    <Text style={styles.title}>First Name</Text>
                    <TextInput
                        style={styles.field}
                        multiline
                        placeholder="Enter First Name"
                        value={firstName}
                        onChangeText={setFirstName}
                    />

                    <Text style={styles.title}>Last Name</Text>
                    <TextInput
                        style={styles.field}
                        multiline
                        placeholder="Enter Last Name"
                        value={lastName}
                        onChangeText={setLastName}
                    />

                    <Text style={styles.title}>Email</Text>
                    <TextInput
                        style={styles.field}
                        multiline
                        placeholder="Enter Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    {errorMessage.email ? <Text style={styles.error}>{errorMessage.email}</Text> : null}

                    <Text style={styles.title}>Username</Text>
                    <TextInput
                        style={styles.field}
                        multiline
                        placeholder="Enter Username"
                        value={username}
                        onChangeText={setUsername}
                    />
                    {errorMessage.username ? <Text style={styles.error}>{errorMessage.username}</Text> : null}

                    <Text style={styles.title}>Password</Text>
                    <TextInput
                        style={styles.field}
                        multiline
                        placeholder="Enter Password"
                        value={password}
                        secureTextEntry
                        onChangeText={setPassword}
                    />
                    {errorMessage.password ? <Text style={styles.error}>{errorMessage.password}</Text> : null}

                    <Text style={styles.title}>Confirm Password</Text>
                    <TextInput
                        style={styles.field}
                        multiline
                        placeholder="Confirm Password"
                        value={confirm}
                        secureTextEntry
                        onChangeText={setConfirm}
                    />
                    {errorMessage.confirm ? <Text style={styles.error}>{errorMessage.confirm}</Text> : null}


                    <TouchableOpacity style={styles.buttonWrapper} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Register!</Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoFBG: {
        width: 125,
        height: 125
    },
    title: {
        fontWeight: 'bold'
    },
    field: {
        width: 200,
        height: 50,
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 5
    },
    buttonWrapper: {
        width: 100,
        backgroundColor: '#FBB040',
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
        alignItems: 'center',
        margin: 5
    },
    buttonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        marginBottom: 10
    }
});