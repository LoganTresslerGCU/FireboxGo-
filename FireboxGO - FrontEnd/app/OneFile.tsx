import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import BannerNav from '../components/BannerNav';
import FileEditNav from '../components/FileEditNav';

export default function OneFileScreen() {
    const route = useRoute();
    const { id, docName, docImage, userID } = route.params

    const navigation = useNavigation();

    return (
        <View style={{ flex: 1 }}>
            <BannerNav passedData={userID}/>
            <FileEditNav passedData={ id, docName, docImage, userID }/>
            <Text>{docName}</Text>
            <View style={styles.imageContainer}>
                {docImage ? (
                    docImage.startsWith('data:image/jpeg') ? (
                        <Image style={styles.image} source={{ uri: `data:image/jpeg;base64,${docImage}` }} />
                    ) : (
                        <Image style={styles.image} source={{ uri: `data:image/png;base64,${docImage}` }} />
                    )
                ) : (
                    <Text style={styles.title}>No File</Text>
                )}
            </View>
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