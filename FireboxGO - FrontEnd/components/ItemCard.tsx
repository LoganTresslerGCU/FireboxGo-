import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ItemCard({ id, itemName, purchaseDate, purchasePrice, retailPrice, description, ownershipAge, itemTags, itemImage, folderID, userID }) {
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
            folderID: folderID,
            userID: userID
        });
    }

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress}>
            <View style={styles.imageContainer}>
                {itemImage ? (
                    <Image source={{ uri: itemImage }} style={styles.image} />
                ) : (
                    <View style={styles.placeholder} />
                )}
            </View>
            <Text style={styles.title}>{itemName}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 100,
        height: 100,
        backgroundColor: "#B2B6B8",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        margin: 10,
        padding: 5,
    },
    imageContainer: {
        width: 80,
        height: 80,
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
    },
    placeholder: {
        width: "100%",
        height: "100%",
        backgroundColor: "#FFFFFF"
    },
    title: {
        color: "black",
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 5,
    },
});
