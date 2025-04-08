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
        <View style={styles.main}>
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
                    <Text style={styles.name}>No Preview Available</Text>
                )}
            </View>
            <Text style={styles.title}>{itemName}</Text>
            <Text style={styles.infoText}>{description}</Text>
            <Text style={styles.infoText}>• Purchased On: <Text style={styles.value}>{purchaseDate}</Text></Text>
            <Text style={styles.infoText}>• Purchase Price: $<Text style={styles.value}>{purchasePrice}</Text></Text>
            <Text style={styles.infoText}>• Retail Price: $<Text style={styles.value}>{retailPrice}</Text></Text>
            <Text style={styles.infoText}>• Age: $<Text style={styles.value}>{ownershipAge}</Text></Text>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
      flex: 1
    },
    imageContainer: {
        width: 300,
        height: 300,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        margin: 10
    },
    image: {
        width: 300,
        height: 300,
        resizeMode: "contain",
    },
    name: {
        color: '#fbb040',
        padding: 10,
        fontSize: 22
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 5,
        marginHorizontal: 10
    },
    infoText: {
        fontSize: 16,
        marginVertical: 5,
        marginHorizontal: 10
    },
    value: {
        fontWeight: 'bold',
        color: '#fbb040'
    },
});