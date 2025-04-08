import * as React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LandingScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Image source={require('../assets/Logo.png')} style={styles.logoFBG} resizeMode="contain"/>
            <Text style={styles.titleFBG}>FireboxGO!</Text>

            <TouchableOpacity style={styles.buttonWrapper} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonWrapper} onPress={() => navigation.navigate('Register')}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        top: 150
    },
    logoFBG: {
        height: 150,
        width: 250
    },
    titleFBG: {
        fontSize: 32,
        fontWeight: 'bold',
        fontStyle: 'italic',
        marginBottom: 25
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
    }
});