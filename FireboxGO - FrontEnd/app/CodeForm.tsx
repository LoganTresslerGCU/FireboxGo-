import React, { useState } from 'react';
import { TextInput, View, StyleSheet, Text, TouchableOpacity, Image, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function CodeScreen() {
    const [email, setEmail] = useState('');
    const [enteredCode, setEnteredCode] = useState('');
    const [activeCode, setActiveCode] = useState('');
    const [errorMessage, setErrorMessage] = useState({ email: '', code: '' });

    const navigation = useNavigation();

    const handleEmail = async () => {
        setErrorMessage({ email: '', code: '' });

        try {
            const response = await fetch('http://172.24.44.3:5189/api/user/sendCode/' + email, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            const responseText = await response.text();
            setActiveCode(responseText)

            if(response.ok) {
                setErrorMessage({ email: 'Code has been sent', code: '' });
            }
            else {
                setErrorMessage({ email: 'There was an issue. Please try again or try a different email.', code: '' });
            }
        } catch (error) {
            setErrorMessage({ email: 'Server Error', code: '' });
        }
    console.log(activeCode)
    }

    const handleCode = () => {
        let errors = { email: '', code: '' };

        if(!enteredCode.trim()) {
            errors.code = 'Code is required';
        }
        else if (enteredCode.length < 6) {
            errors.code = 'Code must be six digits';
        }
        else if (enteredCode == activeCode) {
            navigation.navigate('Reset');
        }
        else {
            errors.code = 'Invalid code. Please try again.'
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.container}>
                    <Image source={require('../assets/Logo.png')} style={styles.logoFBG} resizeMode="contain"/>

                    <Text style={styles.title}>Email</Text>
                    <TextInput
                        style={styles.field}
                        placeholder="Enter Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TouchableOpacity style={styles.buttonWrapper} onPress={handleEmail}>
                        <Text style={styles.buttonText}>Send Code</Text>
                    </TouchableOpacity>
                    {errorMessage.email ? <Text style={styles.error}>{errorMessage.email}</Text> : null}

                    <Text style={styles.title}>Reset Code</Text>
                    <TextInput
                        style={styles.field}
                        placeholder="Enter Reset Code"
                        value={enteredCode}
                        keyboardType="numeric"
                        onChangeText={setEnteredCode}
                    />
                    <TouchableOpacity style={styles.buttonWrapper} onPress={handleCode}>
                        <Text style={styles.buttonText}>Confirm</Text>
                    </TouchableOpacity>
                    {errorMessage.code ? <Text style={styles.error}>{errorMessage.code}</Text> : null}
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
        width: 175,
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