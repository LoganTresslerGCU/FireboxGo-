import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Button, TextInput } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function FolderNav() {
    const route = useRoute()
    const userID = route?.params?.userID;
    const [folder, setFolder] = useState('');

    const navigation = useNavigation();

    return (
        <View style={styles.banner}>
            <Button title="New +" onPress={() => navigation.navigate('Create Folder', { userID: userID })} />
            <TextInput
                style={styles.field}
                placeholder="  Search Folders"
                value={folder}
                onChangeText={setFolder}
            />
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
    field: {
        width: '65%',
        marginVertical: 10,
        borderWidth: 1,

    }
});