import React, { useState, useEffect } from 'react';
import { TextInput, View, StyleSheet, Text, Button, ScrollView, TouchableWithoutFeedback, TouchableOpacity, Keyboard } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Checkbox } from 'react-native-paper';
import BannerNav from '../components/BannerNav';

export default function CreateItemScreen() {
    const navigation = useNavigation();

    const route = useRoute()
    const userID = route?.params?.userID;

    const [itemName, setItemName] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [purchasePrice, setPurchasePrice] = useState('');
    const [retailPrice, setRetailPrice] = useState('');
    const [description, setDescription] = useState('');
    const [ownershipAge, setOwnershipAge] = useState('');
    const [itemTags, setItemTags] = useState([]);
    const [itemImage, setItemImage] = useState('');

    const [availableFolders, setAvailableFolders] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);

    const [errorMessage, setErrorMessage] = useState({ response: '', tags: '', folders: '' });

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch('http://192.168.1.28:5189/api/folder/tags', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok || availableTags.length < 1) {
                    setErrorMessage({ response: '', tags: 'Failed to retrieve tags. Reload and try again.', folders: '' });
                }

                const tagData = await response.json();
                setAvailableTags(tagData);
            } catch (error) {
                setErrorMessage({ response: 'Server Error.', tags: '', folders: '' });
            }
        };
        fetchTags();
    }, []);

    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const response = await fetch('http://192.168.1.28:5189/api/folder/home/' + userID, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    setErrorMessage({ response: '', tags: '', folders: 'Failed to retrieve your folders. Reload and try again.' });
                }
                else if(availableFolders.length < 1){
                    setErrorMessage({ response: '', tags: '', folders: 'No folders found. Please make a folder first.' });
                }

                const folderData = await response.json();
                setAvailableFolders(folderData);
            } catch (error) {
                setErrorMessage({ response: 'Server Error', tags: '', folders: '' });
            }
        };
        fetchFolders();
    }, []);

    const toggleTag= (tag: string) => {
        setItemTags(prevTags =>
            prevTags.includes(tag)
                ? prevTags.filter(t => t !== tag)
                : [...prevTags, tag]
        );
    };

    const toggleFolder = (folder) => {
        setSelectedFolder(prevFolder => (prevFolder?.id === folder.id ? null : folder));
    };

    const handlePurchaseDateChange = (text) => {
        let cleaned = text.replace(/\D/g, '').slice(0, 8);
        let formatted = cleaned;

        if (cleaned.length > 4) formatted = `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
        if (cleaned.length > 6) formatted = `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6)}`;

        setPurchaseDate(formatted);
    };

    const handleSubmit = () => {
        handleCreate();
    }

    const handleCreate = async () => {
        try {
            const response = await fetch('http://192.168.1.28:5189/api/item/createItem/' + userID, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    itemName: itemName,
                    purchaseDate: purchaseDate,
                    purchasePrice: purchasePrice,
                    retailPrice: retailPrice,
                    description: description,
                    ownershipAge: ownershipAge,
                    itemTags: itemTags,
                    itemImage: itemImage,
                    folderID: selectedFolder?.id
                })
            });

            const responseText = await response.text();
            const apiResponse = Number(responseText);

            if(response.ok) {
                navigation.navigate('Home', { userID: apiResponse })
            }
            else {
                setErrorMessage({ response: 'Failed to create item. Reload and try again.', tags: '', folders: '' });
            }
        } catch (error) {
            setErrorMessage({ response: 'Server Error.', tags: '', folders: '' });
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.container}>
                    <BannerNav />
                    <Text style={styles.title}>Create an Item</Text>

                    <Text style={styles.label}>Item Name</Text>
                    <TextInput
                        style={styles.field}
                        placeholder="Enter item name"
                        value={itemName}
                        onChangeText={setItemName}
                    />

                    <Text>Purchase Date (YYYY-MM-DD)</Text>
                    <TextInput
                        style={styles.calendar}
                        placeholder="YYYY-MM-DD"
                        value={purchaseDate}
                        onChangeText={handlePurchaseDateChange}
                        keyboardType="numeric"
                    />

                    <Text style={styles.label}>Purchase Price</Text>
                    <TextInput
                        style={styles.field}
                        placeholder="Enter purchase price"
                        keyboardType="numeric"
                        value={purchasePrice}
                        onChangeText={setPurchasePrice}
                    />

                    <Text style={styles.label}>Retail Price</Text>
                    <TextInput
                        style={styles.field}
                        placeholder="Enter retail price"
                        keyboardType="numeric"
                        value={retailPrice}
                        onChangeText={setRetailPrice}
                    />

                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={styles.field}
                        placeholder="Enter description"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                    />

                    <Text style={styles.label}>Ownership Age</Text>
                    <TextInput
                        style={styles.field}
                        placeholder="Enter ownership age (years)"
                        keyboardType="numeric"
                        value={ownershipAge}
                        onChangeText={setOwnershipAge}
                    />

                    <Text style={styles.label}>Add Tags</Text>
                    {errorMessage.tags ? <Text style={{ color: 'red' }}>{errorMessage.tags}</Text> : null}
                    {availableTags.map((tag, index) => (
                        <View key={index} style={styles.checkboxContainer}>
                            <Checkbox
                                status={itemTags.includes(tag) ? 'checked' : 'unchecked'}
                                onPress={() => toggleTag(tag)}
                            />
                            <Text>{tag}</Text>
                        </View>
                    ))}

                    <Text style={styles.label}>Select a Folder</Text>
                    {errorMessage.folders ? <Text style={{ color: 'red' }}>{errorMessage.folders}</Text> : null}
                    {availableFolders.map((folder) => (
                        <TouchableOpacity key={folder.id} style={styles.radioContainer} onPress={() => toggleFolder(folder)}>
                            <View style={styles.radioCircle}>
                                {selectedFolder?.id === folder.id && <View style={styles.radioSelected} />}
                            </View>
                            <Text style={styles.radioText}>{folder.folderName}</Text>
                        </TouchableOpacity>
                    ))}

                    <Button title="Create!" onPress={handleSubmit} />
                    {errorMessage.response ? <Text style={{ color: 'red' }}>{errorMessage.response}</Text> : null}
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>
    );
};

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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 10
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    radioSelected: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#000',
    },
    radioText: {
        fontSize: 16
    },
    calendar: {
        borderWidth: 1,
        padding: 8,
        marginBottom: 10
    },
});