import * as React from 'react';
import { Text, View, StyleSheet, Image, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LandingScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Image source={require('../assets/Logo.png')} style={styles.logoFBG} resizeMode="contain"/>
            <Text style={styles.titleFBG}>FireboxGO!</Text>

            <Button title="Login" onPress={() => navigation.navigate('Login')} />
            <Button title="Register" onPress={() => navigation.navigate('Register')} />
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
        fontStyle: 'italic'
    }
});