import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Button, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export default function ItemNav({ query, setQuery }) {
    const route = useRoute()
    const userID = route?.params?.userID;
    const [docName, setDocName] = useState('');
    const [docImage, setDocImage] = useState(null);

    const navigation = useNavigation();

    const pickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "image/*"
            });

            if (result && result.assets && result.assets.length > 0) {
                const uri = result.assets[0].uri;
                const name = result.assets[0].name;
                const base64 = await FileSystem.readAsStringAsync(uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                setDocName(name);
                setDocImage(base64);
                handleUpload(name, base64);
            } else {
                Alert.alert('Selection Canceled.');
            }
        } catch (err) {
            Alert.alert('Unknown Error.');
        }
    };

    const pickDoc = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "application/pdf"
            });

            if (result && result.assets && result.assets.length > 0) {
                const uri = result.assets[0].uri;
                const name = result.assets[0].name;
                const base64 = await FileSystem.readAsStringAsync(uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                setDocName(name);
                setDocImage(base64);
                handleUpload(name, base64);
            } else {
                Alert.alert('Selection Canceled.');
            }
        } catch (err) {
            Alert.alert('Unknown Error.');
        }
    };

    const handleUpload = async (docName, docImage) => {
        try {
            const response = await fetch('http://172.24.44.3:5189/api/doc/upload/' + userID, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    docName: docName,
                    docImage: docImage
                })
            });

            const responseText = await response.text();
            const apiResponse = Number(responseText);

            if(response.ok) {
                navigation.navigate('Account', { userID: apiResponse })
            }
            else {
                Alert.alert('Failed to upload image. Reload and try again.');
            }
        } catch (error) {
            Alert.alert('Server Error.');
        }
    }
    return (
        <View style={styles.banner}>
            <TouchableOpacity style={styles.buttonWrapper} onPress={pickFile}>
                <Text style={styles.buttonText}>+Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonWrapper} onPress={pickDoc}>
                <Text style={styles.buttonText}>+PDF</Text>
            </TouchableOpacity>

            <TextInput
                style={styles.field}
                placeholder="Search Files"
                value={query}
                onChangeText={setQuery}
            />
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
    field: {
        width: '50%',
        padding: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderRadius: 5
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
    }
});