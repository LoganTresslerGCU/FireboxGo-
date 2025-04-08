import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function BannerNav() {
    const route = useRoute()
    const userID = route?.params?.userID;

    const navigation = useNavigation();

    return (
        <View style={styles.banner}>
            <TouchableOpacity onPress={() => navigation.navigate('Home', { userID: userID })}>
                <Image source={require('../assets/Logo.png')} style={styles.logo} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Search', { userID: userID })}>
                <Image source={require('../assets/Search.png')} style={styles.search} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonWrapper} onPress={() => navigation.navigate('Account', { userID: userID })}>
                <Text style={styles.buttonText}>Account</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonWrapper} onPress={() => navigation.navigate('Welcome')}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 60,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: '#000000',
        backgroundColor: '#B2B6B8'
    },
    logo: {
        width: 100,
        height: 40,
        resizeMode: 'contain',
        marginLeft: 10,
        marginRight: 50
    },
    buttonWrapper: {
        backgroundColor: '#FBB040',
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
        alignItems: 'center',
        margin: 2,
        marginRight: 10,
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    search: {
        height: 50,
        width: 50,
        resizeMode: 'contain'
    }
});