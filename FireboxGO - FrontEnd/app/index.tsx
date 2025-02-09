import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingScreen from './Landing';
import LoginScreen from './Login';
import RegisterScreen from './Register';
import HomeScreen from './Home';
import AccountScreen from './Account';
import SearchScreen from './Search';
import CreateFolderScreen from './CreateFolder';
import UpdateFolderScreen from './UpdateFolder';
import OneFolderScreen from './OneFolder';
import CreateItemScreen from './CreateItem';
import UpdateItemScreen from './UpdateItem';
import OneItemScreen from './OneItem';

const Stack = createNativeStackNavigator();
function Navigation() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Welcome" component={Landing} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Account" component={Account} />
            <Stack.Screen name="Search" component={Search} />
            <Stack.Screen name="Create Folder" component={CreateFolder} />
            <Stack.Screen name="Edit Folder" component={UpdateFolder} />
            <Stack.Screen name="Items" component={OneFolder} />
            <Stack.Screen name="Create Item" component={CreateItem} />
            <Stack.Screen name="Edit Item" component={UpdateItem} />
            <Stack.Screen name="Item" component={OneItem} />
        </Stack.Navigator>
    );
}
export default Navigation;

function Landing({ navigation }) {
    return (
        <LandingScreen />
    );
}

function Login({ navigation }) {
    return (
        <LoginScreen />
    );
}

function Register({ navigation }) {
    return (
        <RegisterScreen />
    );
}

function Home({ navigation }) {
    return (
        <HomeScreen />
    );
}

function Account({ navigation }) {
    return (
        <AccountScreen />
    );
}

function Search({ navigation }) {
    return (
        <SearchScreen />
    );
}

function CreateFolder({ navigation }) {
    return (
        <CreateFolderScreen />
    );
}

function UpdateFolder({ navigation }) {
    return (
        <UpdateFolderScreen />
    );
}

function OneFolder({ navigation }) {
    return (
        <OneFolderScreen />
    );
}

function CreateItem({ navigation }) {
    return (
        <CreateItemScreen />
    );
}

function UpdateItem({ navigation }) {
    return (
        <UpdateItemScreen />
    );
}

function OneItem({ navigation }) {
    return (
        <OneItemScreen />
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <Navigation />
        </NavigationContainer>
    );
}