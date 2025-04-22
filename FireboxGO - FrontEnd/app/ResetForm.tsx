import React, { useState } from 'react';
import { TextInput, View, StyleSheet, Text, TouchableOpacity, Image, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ResetScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [errorMessage, setErrorMessage] = useState({username: '', password: '', confirm: ''});

    const navigation = useNavigation();

    const handleSubmit = () => {
        let errors = { username: '', password: '', confirm: '' };
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

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
            handleReset();
        }
        else {
            setErrorMessage({ username: '', password: '', confirm: 'These passwords do not match'});
        }
    }

    const handleReset = async () => {
        setErrorMessage({ username: '', password: '', confirm: ''});

        try {
            const response = await fetch('http://172.24.44.3:5189/api/user/updatePW', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username, password: password }),
            });

            if(response.ok) {
                navigation.navigate('Login');
            }
            else {
                setErrorMessage({ username: '', password: '', confirm: 'Server error'});
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
                        placeholder="Enter Password"
                        value={password}
                        secureTextEntry={true}
                        onChangeText={setPassword}
                    />
                    {errorMessage.password ? <Text style={styles.error}>{errorMessage.password}</Text> : null}

                    <Text style={styles.title}>Confirm Password</Text>
                    <TextInput
                        style={styles.field}
                        placeholder="Confirm Password"
                        value={confirm}
                        secureTextEntry={true}
                        onChangeText={setConfirm}
                    />
                    {errorMessage.confirm ? <Text style={styles.error}>{errorMessage.confirm}</Text> : null}


                    <TouchableOpacity style={styles.buttonWrapper} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Update</Text>
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