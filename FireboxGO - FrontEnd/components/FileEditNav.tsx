import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
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
            <TouchableOpacity style={styles.buttonWrapper} onPress={handleDelete}>
                <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonWrapper} onPress={handleDownload}>
                <Text style={styles.buttonText}>Download</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    banner: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        paddingHorizontal: 5,
        height: 50
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