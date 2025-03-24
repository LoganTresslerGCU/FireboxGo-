import React, { useState, useMemo } from 'react';
import { View, Text, Image, StyleSheet, Button, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import BannerNav from '../components/BannerNav';
import FolderCard from '../components/FolderCard';
import ItemCard from '../components/ItemCard';
import FileCard from '../components/FileCard';

export default function SearchScreen() {
    const route = useRoute()
    const userID = route?.params?.userID;

    const navigation = useNavigation();
    const [query, setQuery] = useState('');
    const [tagSearch, setTagSearch] = useState(false);
    const [results, setResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const resultsPerPage = 12;

    const fetchQuery = async () => {
        if(!tagSearch) {
            try {
                const response = await fetch('http://172.24.44.3:5189/api/user/searchName/' + query + '/' + userID, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) {
                    setErrorMessage({ response: 'Could not retrieve search results. Reload and try again.' });
                    return;
                }

                const data = await response.json();
                setResults(data)
            } catch (error) {
                setErrorMessage({ response: 'Server Error.' });
            }
        }
        else {
            try {
                const response = await fetch('http://172.24.44.3:5189/api/user/searchTags/' + query + '/' + userID, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) {
                    setErrorMessage({ response: 'Could not retrieve search results. Reload and try again.' });
                    return;
                }

                const data = await response.json();
                setResults(data)
            } catch (error) {
                setErrorMessage({ response: 'Server Error.' });
            }
        }
    };

    const renderCard = (item) => {
        if(item.folderName){
            return <FolderCard {...item} userID={userID} />;
        }
        else if(item.itemName) {
            return <ItemCard {...item} userID={userID} />;
        }
        else {
            return <FileCard {...item} userID={userID} />;
        }
    };

    const totalPages = Math.ceil(results.length / resultsPerPage);
    const paginatedData = results.slice(currentPage * resultsPerPage, (currentPage + 1) * resultsPerPage);

    return (
        <View style={{ flex: 1 }}>
            <BannerNav passedData={userID}/>
            <View style={styles.searchbar}>
                <Text>Search: </Text>
                <TextInput
                    style={styles.field}
                    placeholder="Enter search term"
                    value={query}
                    onChangeText={setQuery}
                />
                <TouchableOpacity onPress={() => setTagSearch(!tagSearch)} style={styles.tagSearch}>
                    <View style={styles.checkbox}>
                        {tagSearch && (<View style={styles.selected} />)}
                    </View>
                    <Text>Tag Search</Text>
                </TouchableOpacity>
                <Button title='Go!' onPress={fetchQuery}/>
            </View>
            {results.length === 0 ? (
                <Text>No matching results found.</Text>
            ) : (
                <FlatList
                    data={paginatedData}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => renderCard(item)}
                    numColumns={3}
                    contentContainerStyle={styles.container}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    field: {
        width: '45%',
        marginVertical: 2,
        borderWidth: 1,
    },
    searchbar: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    tagSearch: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: "#000",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 5,
    },
    selected: {
        width: 12,
        height: 12,
        backgroundColor: "#000",
    }
});