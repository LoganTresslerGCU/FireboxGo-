import React, { useState, useEffect } from 'react';
import { TextInput, View, StyleSheet, Text, Modal, Image, ScrollView, TouchableWithoutFeedback, TouchableOpacity, Keyboard } from 'react-native';
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

    const [dropdownVisible, setDropdownVisible] = useState(false);
    const toggleDropdown = () => setDropdownVisible(prev => !prev);

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
                    <Text style={styles.mainTitle}>Edit Your Room Folder</Text>

                    <Text style={styles.title}>Room Name</Text>
                    <TextInput
                        style={styles.field}
                        multiline
                        placeholder={folderName}
                        value={folderName}
                        onChangeText={setFolderName}
                    />

                    <Text style={styles.title}>Description</Text>
                    <TextInput
                        style={styles.field}
                        multiline
                        placeholder={description}
                        value={description}
                        onChangeText={setDescription}
                    />

                    <View style={styles.dropContainer}>
                        <TouchableOpacity onPress={toggleDropdown} style={styles.buttonWrapper}>
                            <Text style={styles.buttonText}>Add Tags</Text>
                        </TouchableOpacity>

                        <Modal
                            visible={dropdownVisible}
                            transparent
                            animationType="fade"
                            onRequestClose={() => setDropdownVisible(false)}
                        >
                            <View style={styles.modalBackground}>
                                <TouchableOpacity
                                    style={styles.absoluteFill}
                                    activeOpacity={1}
                                />

                                <View style={styles.dropdown}>
                                    <ScrollView style={styles.dropdownScroll}>
                                        {availableTags.map((tag, index) => (
                                            <View key={index} style={styles.checkboxContainer}>
                                                <Checkbox
                                                    status={folderTags.includes(tag) ? 'checked' : 'unchecked'}
                                                    onPress={() => toggleTag(tag)}
                                                />
                                                <Text>{tag}</Text>
                                            </View>
                                        ))}
                                    </ScrollView>
                                    <TouchableOpacity style={styles.buttonWrapper} onPress={() => setDropdownVisible(false)}>
                                        <Text style={styles.buttonText}>Done</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </View>

                    <TouchableOpacity style={styles.buttonWrapper} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Update!</Text>
                    </TouchableOpacity>
                    {errorMessage.response ? <Text style={styles.error}>{errorMessage.response}</Text> : null}
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    scrollContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    mainTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginVertical: 20
    },
    title: {
        fontWeight: 'bold'
    },
    field: {
        width: 200,
        height: 50,
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 5
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
    },
    error: {
        color: 'red',
        marginBottom: 10
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
	dropContainer: {
		alignItems: 'center',
	},
	modalBackground: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	dropdown: {
		backgroundColor: '#fff',
		width: 250,
		maxHeight: 300,
		borderRadius: 8,
		padding: 10,
		elevation: 4,
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowOffset: { width: 0, height: 2 },
	},
	dropdownScroll: {
		width: '100%',
	}
});