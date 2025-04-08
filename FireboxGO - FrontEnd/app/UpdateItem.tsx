import React, { useState, useEffect } from 'react';
import { TextInput, View, StyleSheet, Text, Modal, Image, ScrollView, TouchableWithoutFeedback, TouchableOpacity, Keyboard } from 'react-native';
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

    const [tagDropdownVisible, setTagDropdownVisible] = useState(false);
    const toggleTagDropdown = () => setTagDropdownVisible(prev => !prev);

    const [folderDropdownVisible, setFolderDropdownVisible] = useState(false);
    const toggleFolderDropdown = () => setFolderDropdownVisible(prev => !prev);

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
                    <Text style={styles.mainTitle}>Edit Your Item</Text>

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

                    <TouchableOpacity onPress={pickFile} style={styles.buttonWrapper}>
                        <Text style={styles.buttonText}>Add Image</Text>
                    </TouchableOpacity>
                    <Text>{imageSelected}</Text>
                    {errorMessage.image ? <Text style={styles.error}>{errorMessage.image}</Text> : null}

                    <Text style={styles.title}>Item Name</Text>
                    <TextInput
                        style={styles.field}
                        multiline
                        placeholder={itemName}
                        value={itemName}
                        onChangeText={setItemName}
                    />

                    <Text style={styles.title}>Purchase Date (YYYY-MM-DD)</Text>
                    <TextInput
                        style={styles.field}
                        placeholder={purchaseDate}
                        value={purchaseDate}
                        onChangeText={handlePurchaseDateChange}
                        keyboardType="numeric"
                    />

                    <Text style={styles.title}>Purchase Price</Text>
                    <TextInput
                        style={styles.field}
                        placeholder={purchasePrice}
                        value={purchasePrice}
                        onChangeText={setPurchasePrice}
                        keyboardType="numeric"
                    />

                    <Text style={styles.title}>Retail Price</Text>
                    <TextInput
                        style={styles.field}
                        placeholder={retailPrice}
                        value={retailPrice}
                        onChangeText={setRetailPrice}
                        keyboardType="numeric"
                    />

                    <Text style={styles.title}>Description</Text>
                    <TextInput
                        style={styles.field}
                        multiline
                        placeholder={description}
                        value={description}
                        onChangeText={setDescription}
                    />

                    <Text style={styles.title}>Ownership Age</Text>
                    <TextInput
                        style={styles.field}
                        placeholder={ownershipAge}
                        keyboardType="numeric"
                        value={ownershipAge}
                        onChangeText={setOwnershipAge}
                    />

                    <View style={styles.dropContainer}>
                        <TouchableOpacity onPress={toggleTagDropdown} style={styles.buttonWrapper}>
                            <Text style={styles.buttonText}>Add Tags</Text>
                        </TouchableOpacity>

                        <Modal
                            visible={tagDropdownVisible}
                            transparent
                            animationType="fade"
                            onRequestClose={() => setTagDropdownVisible(false)}
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
                                                    status={itemTags.includes(tag) ? 'checked' : 'unchecked'}
                                                    onPress={() => toggleTag(tag)}
                                                />
                                                <Text>{tag}</Text>
                                            </View>
                                        ))}
                                    </ScrollView>
                                    <TouchableOpacity style={styles.buttonWrapper} onPress={() => setTagDropdownVisible(false)}>
                                        <Text style={styles.buttonText}>Done</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </View>

                    <View style={styles.dropContainer}>
                        <TouchableOpacity onPress={toggleFolderDropdown} style={styles.buttonWrapper}>
                            <Text style={styles.buttonText}>Select Folder</Text>
                        </TouchableOpacity>

                        <Modal
                            visible={folderDropdownVisible}
                            transparent
                            animationType="fade"
                            onRequestClose={() => setFolderDropdownVisible(false)}
                        >
                            <View style={styles.modalBackground}>
                                <TouchableOpacity
                                    style={styles.absoluteFill}
                                    activeOpacity={1}
                                />

                                <View style={styles.dropdown}>
                                    <ScrollView style={styles.dropdownScroll}>
                                        {availableFolders.map((folder) => (
                                            <TouchableOpacity key={folder.id} style={styles.radioContainer} onPress={() => toggleFolder(folder)}>
                                                <View style={styles.radioCircle}>
                                                    {selectedFolder?.id === folder.id && <View style={styles.radioSelected} />}
                                                </View>
                                                <Text style={styles.radioText}>{folder.folderName}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                    <TouchableOpacity style={styles.buttonWrapper} onPress={() => setFolderDropdownVisible(false)}>
                                        <Text style={styles.buttonText}>Done</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </View>

                    <TouchableOpacity onPress={handleSubmit} style={styles.buttonWrapper}>
                        <Text style={styles.buttonText}>Update</Text>
                    </TouchableOpacity>
                    {errorMessage.response ? <Text style={styles.error}>{errorMessage.response}</Text> : null}
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>
    );
};

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
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
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