import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Button, TextInput } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function ItemNav() {
    const route = useRoute()
    const userID = route?.params?.userID;
    const [item, setItem] = useState('');

    const navigation = useNavigation();

    return (
        <View style={styles.banner}>
            <Button title="New +" onPress={() => navigation.navigate('Create Item', { userID: userID })} />
            <TextInput
                style={styles.field}
                placeholder="  Search Items"
                value={item}
                onChangeText={setItem}
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