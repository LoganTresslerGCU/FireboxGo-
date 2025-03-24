import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function FileCard({ id, docName, docImage, userID }) {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate('File', {
            id: id,
            docName: docName,
            docImage: docImage,
            userID: userID
        });
    }

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress}>
            <Text style={styles.title}>{docName}</Text>
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
    },
    title: {
        color: "black",
        fontWeight: "bold",
        textAlign: "center",
    },
});