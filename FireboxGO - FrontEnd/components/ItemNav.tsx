import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Button, TextInput, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function ItemNav({ query, setQuery, tagSearch, setTagSearch }) {
    const route = useRoute()
    const userID = route?.params?.userID;

    const navigation = useNavigation();

    return (
        <View style={styles.banner}>
            <TouchableOpacity style={styles.buttonWrapper} onPress={() => navigation.navigate('Create Item', { userID: userID })}>
                <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
            <TextInput
                style={styles.field}
                placeholder="Search Items"
                value={query}
                onChangeText={setQuery}
            />
            <TouchableOpacity
                onPress={() => setTagSearch(!tagSearch)}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 10,
                }}
            >
                <View
                    style={{
                        width: 20,
                        height: 20,
                        borderWidth: 2,
                        borderColor: "#000",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 5,
                    }}
                >
                    {tagSearch && (
                        <View
                            style={{
                                width: 12,
                                height: 12,
                                backgroundColor: "#000",
                            }}
                        />
                    )}
                </View>
                <Text>Tag Search</Text>
            </TouchableOpacity>
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
        width: '50%',
        padding: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderRadius: 5
    },
    buttonWrapper: {
        backgroundColor: '#FBB040',
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
        alignItems: 'center',
        margin: 2,
        marginRight: 10,
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    }
});