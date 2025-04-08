import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function ItemEditNav() {
    const route = useRoute()
    const itemID = route?.params?.id;
    const itemName = route?.params?.itemName;
    const purchaseDate = route?.params?.purchaseDate;
    const purchasePrice = route?.params?.purchasePrice;
    const retailPrice = route?.params?.retailPrice;
    const description = route?.params?.description;
    const ownershipAge = route?.params?.ownershipAge;
    const itemTags = route?.params?.itemTags;
    const itemImage = route?.params?.itemImage;
    const folderID = route?.params?.folderID;
    const userID = route?.params?.userID;

    const navigation = useNavigation();

    const handleDelete = async () => {
        try {
            const response = await fetch('http://172.24.44.3:5189/api/item/deleteItem/' + itemID, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            const responseText = await response.text();
            const apiResponse = Number(responseText);

            if(response.ok) {
                navigation.navigate('Home', { userID })
            }
            else {
                showError('Failed to delete item. Reload and try again.');
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
                <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonWrapper} onPress={() => navigation.navigate('Edit Item', {
                itemID: itemID,
                itemName: itemName,
                purchaseDate: purchaseDate,
                purchasePrice: purchasePrice,
                retailPrice: retailPrice,
                description: description,
                ownershipAge: ownershipAge,
                itemTags: itemTags,
                itemImage: itemImage,
                folderID: folderID,
                userID: userID
            })}>
                <Text style={styles.buttonText}>Edit</Text>
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