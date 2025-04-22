import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingScreen from './app/Landing';
import LoginScreen from './app/Login';
import RegisterScreen from './app/Register';
import HomeScreen from './app/Home';
import AccountScreen from './app/Account';
import SearchScreen from './app/Search';
import CreateFolderScreen from './app/CreateFolder';
import UpdateFolderScreen from './app/UpdateFolder';
import OneFolderScreen from './app/OneFolder';
import CreateItemScreen from './app/CreateItem';
import UpdateItemScreen from './app/UpdateItem';
import OneItemScreen from './app/OneItem';
import FileScreen from './app/Files';
import OneFileScreen from './app/OneFile';
import CodeScreen from './app/CodeForm';
import ResetScreen from './app/ResetForm';

const Stack = createNativeStackNavigator();
function Navigation() {
    return (
        <NavigationContainer>
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
                <Stack.Screen name="Files" component={Files} />
                <Stack.Screen name="File" component={OneFile} />
                <Stack.Screen name="Code" component={Code} />
                <Stack.Screen name="Reset" component={Reset} />
            </Stack.Navigator>
        </NavigationContainer>
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

function Files({ navigation }) {
    return (
        <FileScreen />
    );
}

function OneFile({ navigation }) {
    return (
        <OneFileScreen />
    );
}

function Code({ navigation }) {
    return (
        <CodeScreen />
    );
}

function Reset({ navigation }) {
    return (
        <ResetScreen />
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <Navigation />
        </NavigationContainer>
    );
}