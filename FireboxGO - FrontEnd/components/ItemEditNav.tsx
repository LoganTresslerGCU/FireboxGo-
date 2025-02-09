import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Button, TextInput, Alert } from 'react-native';
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
            const response = await fetch('http://192.168.1.28:5189/api/item/deleteItem/' + itemID, {
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
            <Button title="Edit" onPress={() => navigation.navigate('Edit Item', {
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
            })} />
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