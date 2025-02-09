import React, { useState, useEffect } from 'react';
import { TextInput, View, StyleSheet, Text, Button, Image, ScrollView, TouchableWithoutFeedback, TouchableOpacity, Keyboard } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Checkbox } from 'react-native-paper';
import BannerNav from '../components/BannerNav';

export default function CreateFolderScreen() {
    const route = useRoute()
    const userID = route?.params?.userID;

    const navigation = useNavigation();

    const [folderName, setFolderName] = useState('');
    const [description, setDescription] = useState('');
    const [folderTags, setFolderTags] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);

    const [errorMessage, setErrorMessage] = useState({ response: '', tags: '' });

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch('http://192.168.1.28:5189/api/folder/tags', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok || availableTags.length < 1) {
                    setErrorMessage({ response: '', tags: 'Failed to retrieve tags. Reload and try again.' });
                }

                const data = await response.json();
                setAvailableTags(data);
            } catch (error) {
                setErrorMessage({ response: 'Server Error.' });
            }
        };
        fetchTags();
    }, []);

    const toggleTag= (tag: string) => {
        setFolderTags(prevTags =>
            prevTags.includes(tag)
                ? prevTags.filter(t => t !== tag)
                : [...prevTags, tag]
        );
    };

    const handleSubmit = () => {
        handleCreate();
    }

    const handleCreate = async () => {
        try {
            const response = await fetch('http://192.168.1.28:5189/api/folder/createFolder/' + userID, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ folderName: folderName, description: description, folderTags: folderTags })
            });

            const responseText = await response.text();
            const apiResponse = Number(responseText);
            if(response.ok) {
                navigation.navigate('Home', { userID: apiResponse })
            }
            else {
                setErrorMessage({ response: 'Failed to create folder. Reload and try again.', tags: '' });
            }
        } catch (error) {
            setErrorMessage({ response: 'Server Error.', tags: '' });
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.container}>
                    <BannerNav />
                    <Text>Create a Room Folder</Text>

                    <Text>Room Name</Text>
                    <TextInput
                        style={styles.field}
                        placeholder="Enter room name"
                        value={folderName}
                        onChangeText={setFolderName}
                    />

                    <Text>Description</Text>
                    <TextInput
                        style={styles.field}
                        placeholder="Enter description"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                    />

                    <Text>Add Tags</Text>
                    {errorMessage.tags ? <Text style={{ color: 'red' }}>{errorMessage.tags}</Text> : null}
                    {availableTags.map((tag, index) => (
                        <View key={index} style={styles.checkboxContainer}>
                            <Checkbox
                                status={folderTags.includes(tag) ? 'checked' : 'unchecked'}
                                onPress={() => toggleTag(tag)}
                            />
                            <Text>{tag}</Text>
                        </View>
                    ))}

                    <Button title="Create!" onPress={handleSubmit} />
                    {errorMessage.response ? <Text style={{ color: 'red' }}>{errorMessage.response}</Text> : null}
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    field: {
        width: '100%',
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderRadius: 5
    },
    checkboxes: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
});