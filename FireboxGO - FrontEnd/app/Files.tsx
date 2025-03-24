import React, { useState, useEffect, useMemo } from 'react';
import { Text, View, StyleSheet, Button, FlatList } from 'react-native';
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

    return (
        <View style={{ flex: 1 }}>
            <BannerNav passedData={userID}/>
            <FileNav passedData={userID} query={query} setQuery={setQuery}/>
            {filteredFiles.length === 0 ? (
                <Text>No matching results found.</Text>
            ) : (
                <FlatList
                    data={filteredFiles}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <FileCard {...item} userID={userID} />}
                    numColumns={3}
                    contentContainerStyle={styles.container}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    }
});