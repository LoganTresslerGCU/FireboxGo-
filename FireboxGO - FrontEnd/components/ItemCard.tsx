import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ItemCard({ id, itemName, purchaseDate, purchasePrice, retailPrice, description, ownershipAge, itemTags, itemImage, folderID, userID, folderName }) {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate('Item', {
            id: id,
            itemName: itemName,
            purchaseDate: purchaseDate,
            purchasePrice: purchasePrice,
            retailPrice: retailPrice,
            description: description,
            ownershipAge: ownershipAge,
            itemTags: itemTags,
            itemImage: itemImage,
            folderID: folderID,
            userID: userID,
            folderName: folderName
        });
    }

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress}>
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
            <Text style={styles.title}>{itemName}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        alignItems: "center"
    },
    imageContainer: {
        width: 100,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        margin: 10
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
    },
    title: {
        width: 100,
        color: "black",
        fontWeight: "bold",
        textAlign: "center"
    },
});
