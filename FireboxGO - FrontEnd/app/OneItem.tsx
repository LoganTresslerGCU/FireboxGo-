import React from 'react';
import { Text, View, StyleSheet, FlatList, Image } from 'react-native';
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
            <BannerNav passedData={userID}/>
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
            <Text>{itemName}</Text>
            <Text>{purchaseDate}</Text>
            <Text>{purchasePrice}</Text>
            <Text>{retailPrice}</Text>
            <Text>{description}</Text>
            <Text>Owned for {ownershipAge} years</Text>
            <Text>{itemTags && itemTags.length > 0
                ? itemTags.join(', ') : 'No Tags Available'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        width: 300,
        height: 300,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        margin: 10
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
    }
});