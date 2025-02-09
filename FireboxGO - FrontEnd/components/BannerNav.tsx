import React from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function BannerNav() {
     const navigation = useNavigation();

     return (
         <View style={styles.banner}>
             <Image source={require('@/assets/images/Logo.png')} style={styles.logo} />

             <View style={styles.buttonContainer}>
                 <View style={styles.buttonWrapper}>
                     <Button title="Details" onPress={() => navigation.navigate('Account')} />
                 </View>
                 <View style={styles.buttonWrapper}>
                     <Button title="Logout" onPress={() => navigation.navigate('Welcome')} />
                 </View>
             </View>
         </View>
     );
 }

const styles = StyleSheet.create({
    banner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
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
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    buttonWrapper: {
        marginLeft: 10,
    },
});