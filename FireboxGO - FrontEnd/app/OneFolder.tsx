import React, { useState, useEffect, useMemo }from 'react';
import { Text, View, StyleSheet, FlatList, Button, TouchableOpacity } from 'react-native';
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
        <View style={styles.main}>
            <BannerNav passedData={userID}/>
            <ItemNav passedData={userID} query={query} setQuery={setQuery} tagSearch={tagSearch} setTagSearch={setTagSearch}/>
            <FolderEditNav passedData={id, folderName, description, folderTags, userID}/>
            <Text style={styles.title}>{folderName}</Text>
            <Text style={styles.text}>{description}</Text>
            <Text style={styles.header}>Room Value:<Text style={styles.value}> ${roomValue}</Text></Text>
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

            <View style={styles.pageNav}>
            <TouchableOpacity style={styles.buttonWrapper} onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 0))} disabled={currentPage === 0}>
                <Text style={styles.buttonText}>Prev</Text>
            </TouchableOpacity>

            <Text>Page {currentPage + 1} of {totalPages}</Text>

            <TouchableOpacity style={styles.buttonWrapper} onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))} disabled={currentPage >= totalPages - 1}>
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
            </View>
            {errorMessage.response ? <Text style={{ color: 'red' }}>{errorMessage.response}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
      flex: 1
    },
    container: {
        padding: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 5,
        marginHorizontal: 10
    },
    text: {
        fontSize: 14,
        marginVertical: 5,
        marginHorizontal: 10
    },
    value: {
        fontSize: 14,
        color: '#000'
    },
    header: {
        fontSize: 14,
        marginVertical: 5,
        marginHorizontal: 10,
        color: '#FBB040'
    },
    buttonWrapper: {
        width: 100,
        backgroundColor: '#FBB040',
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
        alignItems: 'center',
        margin: 5
    },
    buttonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    pageNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10
    }
});