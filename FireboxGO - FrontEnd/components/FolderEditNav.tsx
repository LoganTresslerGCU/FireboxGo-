import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Button, TextInput, Alert } from 'react-native';
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
            const response = await fetch('http://192.168.1.28:5189/api/folder/deleteFolder/' + folderID, {
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
            <Button title="Edit" onPress={() => navigation.navigate('Edit Folder', { folderID: folderID, folderName: folderName, description: description, folderTags: folderTags, userID: userID })} />
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