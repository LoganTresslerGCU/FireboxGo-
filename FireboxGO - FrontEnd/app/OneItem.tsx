import React from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import BannerNav from '../components/BannerNav';
import ItemEditNav from '../components/ItemEditNav';

export default function OneItemScreen() {
    const route = useRoute();
    const {
        id,
        itemName,
        purchaseDate,
        purchasePrice,
        retailPrice,
        description,
        ownershipAge,
        itemTags,
        itemImage,
        folderID,
        userID
    } = route.params

    const navigation = useNavigation();

    return (
        <View style={{ flex: 1 }}>
            <BannerNav />
            <ItemEditNav passedData={
                id,
                itemName,
                purchaseDate,
                purchasePrice,
                retailPrice,
                description,
                ownershipAge,
                itemTags,
                itemImage,
                folderID,
                userID
            }/>
            <Text>{itemName}</Text>
        </View>
    );
}