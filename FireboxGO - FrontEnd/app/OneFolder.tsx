import React, { useState, useEffect, useMemo }from 'react';
import { Text, View, StyleSheet, FlatList, Button } from 'react-native';
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
    const [currentPage, setCurrentPage] = useState(0);
    const [query, setQuery] = useState('');
    const [tagSearch, setTagSearch] = useState(false);
    const [errorMessage, setErrorMessage] = useState({ response: '' });
    const itemsPerPage = 12;

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch('http://172.24.44.3:5189/api/item/' + userID + '/' + id, {
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
                const response = await fetch('http://172.24.44.3:5189/api/item/value/' + id, {
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

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            if (tagSearch) {
                return item.itemTags?.some(itemTag => itemTag.toLowerCase().includes(query.toLowerCase()));
            } else {
                return item.itemName.toLowerCase().includes(query.toLowerCase());
            }
        });
    }, [query, items, tagSearch]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedData = filteredItems.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <View style={{ flex: 1 }}>
            <BannerNav passedData={userID}/>
            <FolderEditNav passedData={id, folderName, description, folderTags, userID}/>
            <ItemNav passedData={userID} query={query} setQuery={setQuery} tagSearch={tagSearch} setTagSearch={setTagSearch}/>
            <Text>{folderName}</Text>
            <Text>{description}</Text>
            <Text>{roomValue}</Text>
            {filteredItems.length === 0 ? (
                <Text>No matching results found.</Text>
            ) : (
                <FlatList
                    data={paginatedData}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <ItemCard {...item} userID={userID} />}
                    numColumns={3}
                    contentContainerStyle={styles.container}
                />
            )}

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                <Button
                    title="Previous"
                    onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                    disabled={currentPage === 0}
                />
                <Text>Page {currentPage + 1} of {totalPages}</Text>
                <Button
                    title="Next"
                    onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                    disabled={currentPage >= totalPages - 1}
                />
            </View>
            {errorMessage.response ? <Text style={{ color: 'red' }}>{errorMessage.response}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    }
});