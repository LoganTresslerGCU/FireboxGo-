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
        <View style={styles.main}>
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

                <TouchableOpacity style={styles.searchWrapper} onPress={fetchQuery}>
                    <Text style={styles.buttonText}>Go!</Text>
                </TouchableOpacity>

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

            <View style={styles.pageNav}>
                <TouchableOpacity style={styles.buttonWrapper} onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 0))} disabled={currentPage === 0}>
                    <Text style={styles.buttonText}>Prev</Text>
                </TouchableOpacity>

                <Text>Page {currentPage + 1} of {totalPages}</Text>

                <TouchableOpacity style={styles.buttonWrapper} onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))} disabled={currentPage >= totalPages - 1}>
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
      flex: 1
    },
    field: {
        width: 150,
        height: 50,
        borderWidth: 1,
        borderRadius: 5
    },
    searchbar: {
        top: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
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
    },
    searchWrapper: {
        width: 50,
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
    buttonWrapper: {
        width: 100,
        backgroundColor: '#FBB040',
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
        alignItems: 'center',
        margin: 5
    },
    pageNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    }
});