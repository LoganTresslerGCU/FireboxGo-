import * as React from 'react';
import { View, StyleSheet, Text, Image, Button } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './Login.tsx';
import RegisterScreen from './Register.tsx';
import HomeScreen from './Home.tsx';

function Landing({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.titleFBG}>FireboxGO!</Text>
            <Image source={require('@/assets/images/FBG_Logo.png')} style={styles.logoFBG}/>
            <Button
                title="Login"
                onPress={() => navigation.navigate('Login to FireboxGO!')}
            />
            <Text></Text>
            <Button
                title="Register"
                onPress={() => navigation.navigate('Register for FireboxGO!')}
            />
        </View>
    );
}

function Login({ navigation }) {
    return (
        <View>
            <LoginScreen />
        </View>
    );
}

function Register({ navigation }) {
    return (
        <View>
            <RegisterScreen />
        </View>
    );
}

function Home({ navigation }) {
    return (
        <View>
            <HomeScreen />
        </View>
    );
}

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Welcome" component={Landing} />
            <Stack.Screen name="Login to FireboxGO!" component={Login} />
            <Stack.Screen name="Register for FireboxGO!" component={Register} />
            <Stack.Screen name="Welcome Home!" component={Home} />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        top: 100
    },
    logoFBG: {
        height: 200,
        width: 300,
    },
    titleFBG: {
        fontSize: 32,
        fontWeight: 'bold',
        fontStyle: 'italic'
    }
});