import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import BannerNav from '../components/BannerNav';
import FolderNav from '../components/FolderNav';
import FolderCard from '../components/FolderCard';

export default function HomeScreen() {
    const route = useRoute()
    const userID = route?.params?.userID;

    const navigation = useNavigation();

    const [folders, setFolders] = useState([]);

    const [errorMessage, setErrorMessage] = useState({ response: '' });

    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const response = await fetch('http://192.168.1.28:5189/api/folder/home/' + userID, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) {
                    setErrorMessage({ response: 'Could not retrieve folders. Reload and try again.' });
                }

                const data = await response.json();
                setFolders(data);
            } catch (error) {
                setErrorMessage({ response: 'Server Error.' });
            }
        };

        if (userID) {
            fetchFolders();
        }
    }, [userID]);

    return (
        <View style={{ flex: 1 }}>
            <BannerNav />
            <FolderNav passedData={userID}/>
            <FlatList
                data={folders}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <FolderCard {...item} userID={userID} />}
                numColumns={3}
                contentContainerStyle={styles.container}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    }
});