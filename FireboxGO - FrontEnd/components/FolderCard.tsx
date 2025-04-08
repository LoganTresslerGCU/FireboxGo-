import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function FolderCard({ id, folderName, description, folderTags, userID }) {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate('Items', {
            id: id,
            folderName: folderName,
            description: description,
            folderTags: folderTags,
            userID: userID
        });
    }

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress}>
            <Text style={styles.title}>{folderName}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 100,
        height: 100,
        backgroundColor: '#FBB040',
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