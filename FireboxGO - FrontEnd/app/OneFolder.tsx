import React, { useState, useEffect }from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import BannerNav from '../components/BannerNav';
import FolderEditNav from '../components/FolderEditNav';
import ItemNav from '../components/ItemNav';
import ItemCard from '../components/ItemCard';

export default function OneFolderScreen() {
    const route = useRoute();
    const { id, folderName, description, folderTags, userID } = route.params

    const navigation = useNavigation();

    const [items, setItems] = useState([]);
    const [roomValue, setRoomValue] = useState('');

    const [errorMessage, setErrorMessage] = useState({ response: '' });

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch('http://192.168.1.28:5189/api/item/' + userID + '/' + id, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) {
                    setErrorMessage({ response: 'Could not retrieve items. Reload and try again.' });
                }

                const data = await response.json();
                setItems(data);
            } catch (error) {
                setErrorMessage({ response: 'Server Error.' });
            }
        };

        if (userID && id) {
            fetchItems();
        }
    }, [userID]);

    useEffect(() => {
        const fetchRoomValue = async () => {
            try {
                const response = await fetch('http://192.168.1.28:5189/api/item/value/' + id, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) {
                    setErrorMessage({ response: 'Could not retrieve room value. Reload and try again.' });
                }

                const data = await response.json();
                setRoomValue(data);
            } catch (error) {
                setErrorMessage({ response: 'Server Error.' });
            }
        };

        if (userID && id) {
            fetchRoomValue();
        }
    }, [userID]);

    return (
        <View style={{ flex: 1 }}>
            <BannerNav />
            <FolderEditNav passedData={id, folderName, description, folderTags, userID}/>
            <ItemNav passedData={userID}/>
            <Text>{folderName}</Text>
            <Text>{description}</Text>
            <Text>{roomValue}</Text>
            <FlatList
                data={items}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <ItemCard {...item} userID={userID} />}
                numColumns={3}
                contentContainerStyle={styles.container}
            />
            {errorMessage.response ? <Text style={{ color: 'red' }}>{errorMessage.response}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    }
});