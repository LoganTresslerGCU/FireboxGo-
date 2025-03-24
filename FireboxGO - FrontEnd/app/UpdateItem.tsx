import React, { useState, useEffect } from 'react';
import { TextInput, View, StyleSheet, Text, Button, Image, ScrollView, TouchableWithoutFeedback, TouchableOpacity, Keyboard } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Checkbox } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import BannerNav from '../components/BannerNav';

export default function UpdateItemScreen() {
    const navigation = useNavigation();

    const route = useRoute()
    const itemID = route?.params?.itemID;
    const userID = route?.params?.userID;

    const [itemName, setItemName] = useState(route?.params?.itemName);
    const [purchaseDate, setPurchaseDate] = useState(route?.params?.purchaseDate);
    const [purchasePrice, setPurchasePrice] = useState(route?.params?.purchasePrice?.toString());
    const [retailPrice, setRetailPrice] = useState(route?.params?.retailPrice?.toString());
    const [description, setDescription] = useState(route?.params?.description);
    const [ownershipAge, setOwnershipAge] = useState(route?.params?.ownershipAge?.toString());
    const [itemTags, setItemTags] = useState(route?.params?.itemTags);
    const [itemImage, setItemImage] = useState(route?.params?.itemImage);
    const [folderID, setFolderID] = useState(route?.params?.folderID);
    const [imageSelected, setImageSelected] = useState('No Image Selected');

    const [availableFolders, setAvailableFolders] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);

    const [errorMessage, setErrorMessage] = useState({ response: '', tags: '', folders: '' });

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch('http://172.24.44.3:5189/api/folder/tags', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
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
                const response = await fetch('http://172.24.44.3:5189/api/folder/home/' + userID, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    setErrorMessage({ response: '', tags: '', folders: 'Failed to retrieve your folders. Reload and try again.' });
                }

                const folderData = await response.json();
                setAvailableFolders(folderData);
            } catch (error) {
                setErrorMessage({ response: 'Server Error', tags: '', folders: '' });
            }
        };
        fetchFolders();
    }, []);

    const pickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "image/*"
            });

            if (result && result.assets && result.assets.length > 0) {
                const uri = result.assets[0].uri;

                const base64 = await FileSystem.readAsStringAsync(uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                setImageSelected('Image Is Selected');
                setItemImage(base64);
            } else {
                setErrorMessage({ response: '', image: 'Error Picking Image', tags: '', folders: '' });
            }
        } catch (err) {
            setErrorMessage({ response: '', image: 'Unknown Error', tags: '', folders: '' });
        }
    };

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
        handleUpdate();
    }

    const handleUpdate = async () => {
        try {
            const response = await fetch('http://172.24.44.3:5189/api/item/updateItem/' + userID + '/' + itemID, {
                method: 'PUT',
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
                setErrorMessage({ response: 'Failed to update item. Reload and try again.', tags: '', folders: '' });
            }
        } catch (error) {
            setErrorMessage({ response: 'Server Error.', tags: '', folders: '' });
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.container}>
                    <BannerNav passedData={userID}/>
                    <Text style={styles.title}>Edit Your Item</Text>

                    <View style={styles.imageContainer}>
                        {itemImage ? (
                            itemImage.startsWith('data:image/jpeg') ? (
                                <Image style={styles.image} source={{ uri: `data:image/jpeg;base64,${itemImage}` }} />
                            ) : (
                                <Image style={styles.image} source={{ uri: `data:image/png;base64,${itemImage}` }} />
                            )
                        ) : (
                            <Text style={styles.title}>No Image</Text>
                        )}
                    </View>

                    <Button title="Add Image" onPress={pickFile}/>
                    <Text>{imageSelected}</Text>
                    {errorMessage.image ? <Text style={{ color: 'red' }}>{errorMessage.image}</Text> : null}

                    <Text style={styles.label}>Item Name</Text>
                    <TextInput
                        style={styles.field}
                        placeholder={itemName}
                        value={itemName}
                        onChangeText={setItemName}
                    />

                    <Text>Purchase Date (YYYY-MM-DD)</Text>
                    <TextInput
                        style={styles.calendar}
                        placeholder={purchaseDate}
                        value={purchaseDate}
                        onChangeText={handlePurchaseDateChange}
                        keyboardType="numeric"
                    />

                    <Text style={styles.label}>Purchase Price</Text>
                    <TextInput
                        style={styles.calendar}
                        placeholder={purchasePrice}
                        value={purchasePrice}
                        onChangeText={setPurchasePrice}
                        keyboardType="numeric"
                    />

                    <Text style={styles.label}>Retail Price</Text>
                    <TextInput
                        style={styles.calendar}
                        placeholder={retailPrice}
                        value={retailPrice}
                        onChangeText={setRetailPrice}
                        keyboardType="numeric"
                    />

                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={styles.field}
                        placeholder={description}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                    />

                    <Text style={styles.label}>Ownership Age</Text>
                    <TextInput
                        style={styles.field}
                        placeholder={ownershipAge}
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

                    <Button title="Update!" onPress={handleSubmit} />
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
    imageContainer: {
        width: 200,
        height: 200,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        margin: 10
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
    }
});