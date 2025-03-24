import React, { useState, useEffect, useMemo } from 'react';
import { Text, View, FlatList, StyleSheet, Button } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import BannerNav from '../components/BannerNav';
import FolderNav from '../components/FolderNav';
import FolderCard from '../components/FolderCard';

export default function HomeScreen() {
    const route = useRoute()
    const userID = route?.params?.userID;

    const navigation = useNavigation();
    const [folders, setFolders] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [query, setQuery] = useState('');
    const [tagSearch, setTagSearch] = useState(false);
    const [errorMessage, setErrorMessage] = useState({ response: '' });
    const foldersPerPage = 12;

    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const response = await fetch('http://172.24.44.3:5189/api/folder/home/' + userID, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) {
                    setErrorMessage({ response: 'Could not retrieve folders. Reload and try again.' });
                    return;
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

    const filteredFolders = useMemo(() => {
        return folders.filter(folder => {
            if (tagSearch) {
                return folder.folderTags?.some(folderTag => folderTag.toLowerCase().includes(query.toLowerCase()));
            } else {
                return folder.folderName.toLowerCase().includes(query.toLowerCase());
            }
        });
    }, [query, folders, tagSearch]);

    const totalPages = Math.ceil(filteredFolders.length / foldersPerPage);
    const paginatedData = filteredFolders.slice(currentPage * foldersPerPage, (currentPage + 1) * foldersPerPage);

    return (
        <View style={{ flex: 1 }}>
            <BannerNav passedData={userID}/>
            <FolderNav passedData={userID} query={query} setQuery={setQuery} tagSearch={tagSearch} setTagSearch={setTagSearch}/>
            {filteredFolders.length === 0 ? (
                <Text>No matching results found.</Text>
            ) : (
                <FlatList
                    data={paginatedData}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <FolderCard {...item} userID={userID} />}
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    }
});