import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Button, TextInput, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function FileEditNav() {
    const route = useRoute()
    const docID = route?.params?.id;
    const docName = route?.params?.docName;
    const docImage = route?.params?.docImage;
    const userID = route?.params?.userID;

    const navigation = useNavigation();

    const handleDelete = async () => {
        try {
            const response = await fetch('http://172.24.44.3:5189/api/doc/deleteDoc/' + docID, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            const responseText = await response.text();
            const apiResponse = Number(responseText);

            if(response.ok) {
                navigation.navigate('Files', { userID })
            }
            else {
                showError('Failed to delete file. Reload and try again.');
            }

        } catch (error) {
            showError('Server Error.');
        }
    }

    const showError = (message) => {
      Alert.alert('Error', message, [{ text: 'OK' }]);
    };

    const requestPermissions = async () => {
        const { status } = await FileSystem.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission denied', 'We need permission to access your file system.');
            return false;
        }
        return true;
    };

    const handleDownload = async () => {
        const fileUri = FileSystem.documentDirectory + docName;

        try {
            await FileSystem.writeAsStringAsync(fileUri, docImage, {
                encoding: FileSystem.EncodingType.Base64,
            });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
            }
        } catch (error) {
            Alert.alert('Error', 'There was an issue saving the file.');
        }
    };

    return (
        <View style={styles.banner}>
            <Button title="Download" onPress={handleDownload}/>
            <Button title="Delete" onPress={handleDelete} />
        </View>
    );
}

const styles = StyleSheet.create({
    banner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 50,
        borderBottomWidth: 2,
        borderColor: '#000000',
        backgroundColor: '#B2B6B8'
    },
});