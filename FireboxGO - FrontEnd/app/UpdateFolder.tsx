import React, { useState, useEffect } from 'react';
import { TextInput, View, StyleSheet, Text, Button, Image, ScrollView, TouchableWithoutFeedback, TouchableOpacity, Keyboard } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Checkbox } from 'react-native-paper';
import BannerNav from '../components/BannerNav';

export default function UpdateFolderScreen() {
    const route = useRoute()
    const folderID = route?.params?.folderID;
    const userID = route?.params?.userID;

    const navigation = useNavigation();

    const [folderName, setFolderName] = useState(route?.params?.folderName);
    const [description, setDescription] = useState(route?.params?.description);
    const [folderTags, setFolderTags] = useState(route?.params?.folderTags);
    const [availableTags, setAvailableTags] = useState([]);

    const [errorMessage, setErrorMessage] = useState({ response: '', tags: '' });

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch('http://172.24.44.3:5189/api/folder/tags', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
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
        handleUpdate();
    }

    const handleUpdate = async () => {
        try {
            const response = await fetch('http://172.24.44.3:5189/api/folder/updateFolder/' + userID + '/' + folderID, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ folderName: folderName, description: description, folderTags: folderTags })
            });

            const responseText = await response.text();
            const apiResponse = Number(responseText);

            if(response.ok) {
                navigation.navigate('Home', { userID: apiResponse })
            }
            else {
                setErrorMessage({ response: 'Failed to update folder. Reload and try again.', tags: '' });
            }
        } catch (error) {
            setErrorMessage({ response: 'Server Error.', tags: '' });
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.container}>
                    <BannerNav passedData={userID}/>
                    <Text>Edit Your Room Folder</Text>

                    <Text>Room Name</Text>
                    <TextInput
                        style={styles.field}
                        placeholder={folderName}
                        value={folderName}
                        onChangeText={setFolderName}
                    />

                    <Text>Description</Text>
                    <TextInput
                        style={styles.field}
                        placeholder={description}
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

                    <Button title="Update!" onPress={handleSubmit} />
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
    logoFBG: {
        width: 150,
        height: 150,
        marginBottom: 20
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