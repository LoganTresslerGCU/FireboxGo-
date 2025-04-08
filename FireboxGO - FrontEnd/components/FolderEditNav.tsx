import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Button, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function FolderEditNav() {
    const route = useRoute()
    const folderID = route?.params?.id;
    const folderName = route?.params?.folderName;
    const description = route?.params?.description;
    const folderTags = route?.params?.folderTags;
    const userID = route?.params?.userID;

    const navigation = useNavigation();

    const handleDelete = async () => {
        try {
            const response = await fetch('http://172.24.44.3:5189/api/folder/deleteFolder/' + folderID, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            const responseText = await response.text();
            const apiResponse = Number(responseText);

            if(response.ok) {
                navigation.navigate('Home', { userID })
            }
            else {
                showError('Failed to delete folder. Ensure you are not trying to delete one with items inside. Reload and try again.');
            }

        } catch (error) {
            showError('Server Error.');
        }
    }

    const showError = (message) => {
      Alert.alert('Error', message, [{ text: 'OK' }]);
    };

    return (
        <View style={styles.banner}>
            <TouchableOpacity style={styles.buttonWrapper} onPress={handleDelete}>
                <Text style={styles.buttonText}>Delete Folder</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonWrapper} onPress={() => navigation.navigate('Edit Folder', { folderID: folderID, folderName: folderName, description: description, folderTags: folderTags, userID: userID })}>
                <Text style={styles.buttonText}>Edit Folder</Text>
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
        width: 125,
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