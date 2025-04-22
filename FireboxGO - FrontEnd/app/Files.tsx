import React, { useState, useEffect, useMemo } from 'react';
import { Text, View, StyleSheet, Button, FlatList, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import BannerNav from '../components/BannerNav';
import FileNav from '../components/FileNav';
import FileCard from '../components/FileCard';

export default function FileScreen() {
    const route = useRoute()
    const userID = route?.params?.userID;

    const navigation = useNavigation();
    const [files, setFiles] = useState([]);
    const [query, setQuery] = useState('');
    const [errorMessage, setErrorMessage] = useState({ response: '' });
    const [currentPage, setCurrentPage] = useState(0);
    const filesPerPage = 12;

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await fetch('http://172.24.44.3:5189/api/doc/' + userID, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) {
                    setErrorMessage({ response: 'Could not retrieve files. Reload and try again.' });
                    return;
                }

                const data = await response.json();
                setFiles(data);
            } catch (error) {
                setErrorMessage({ response: 'Server Error.' });
            }
        };

        if (userID) {
            fetchFiles();
        }
    }, [userID]);

    const filteredFiles = useMemo(() => {
        return files.filter(file => {
            return file.docName.toLowerCase().includes(query.toLowerCase());
        });
    }, [query, files]);

    const totalPages = Math.ceil(filteredFiles.length / filesPerPage);
    const paginatedData = filteredFiles.slice(currentPage * filesPerPage, (currentPage + 1) * filesPerPage);

    return (
        <View style={styles.main}>
            <BannerNav passedData={userID}/>
            <FileNav passedData={userID} query={query} setQuery={setQuery}/>
            {filteredFiles.length === 0 ? (
                <Text>No matching results found.</Text>
            ) : (
                <FlatList
                    data={paginatedData}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <FileCard {...item} userID={userID} />}
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
    container: {
        padding: 10,
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