import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import BannerNav from '../components/BannerNav';

export default function AccountScreen() {
    const route = useRoute()
    const navigation = useNavigation();
    const userID = route?.params?.userID;

    const [account, setAccount] = useState({});
    const [totals, setTotals] = useState([]);
    const labels = ["Total Purchase Price", "Total Retail Price", "Total Rooms", "Total Items"];
    const [errorMessage, setErrorMessage] = useState({ data: '', totals: ''});

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const response = await fetch('http://172.24.44.3:5189/api/user/info/' + userID, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) {
                    setErrorMessage({ data: 'Could not retrieve account data. Reload and try again.', totals: ''});
                }

                const data = await response.json();
                setAccount(data);
            } catch (error) {
                setErrorMessage({ data: 'Server Error.', totals: '' });
            }
        };

        if (userID) {
            fetchInfo();
        }
    }, [userID]);

    useEffect(() => {
        const fetchTotals = async () => {
            try {
                const response = await fetch('http://172.24.44.3:5189/api/user/totals/' + userID, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) {
                    setErrorMessage({ data: '', totals: 'Could not retrieve household totals. Reload and try again.'});
                }

                const data = await response.json();
                setTotals(data);
            } catch (error) {
                setErrorMessage({ data: '', totals: 'Server Error.'});
            }
        };

        if (userID) {
            fetchTotals();
        }
    }, [userID]);

    return (
        <View style={{ flex: 1 }}>
            <BannerNav passedData={userID}/>
            <Button title="Files" onPress={() => navigation.navigate('Files', { userID: userID })} />

            <Text style={styles.greeting}> Hello, <Text style={styles.name}>{account.firstName}</Text>!</Text>

            <Text style={styles.sectionTitle}> Account Information:</Text>
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>• Full Name: <Text style={styles.value}>{account.firstName} {account.lastName}</Text></Text>
                <Text style={styles.infoText}>• Email: <Text style={styles.value}>{account.email}</Text></Text>
                <Text style={styles.infoText}>• Username: <Text style={styles.value}>{account.username}</Text></Text>
            </View>
            {errorMessage.data ? <Text style={{ color: 'red' }}>{errorMessage.data}</Text> : null}

            <Text style={styles.sectionTitle}> Household Totals:</Text>
            <View style={styles.infoContainer}>
                {totals.map((value, index) => (
                    <Text style={styles.infoText} key={index}>• {labels[index]}: <Text style={styles.value}>{value}</Text></Text>
                ))}
            </View>
            {errorMessage.totals ? <Text style={{ color: 'red' }}>{errorMessage.totals}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    greeting: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 15,
        marginTop: 10
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 10,
    },
    infoContainer: {
        marginBottom: 10,
        marginLeft: 20
    },
    name: {
        color: '#fbb040'
    },
    infoText: {
        fontSize: 16,
        marginVertical: 5
    },
    value: {
        fontWeight: 'bold',
        color: '#fbb040'
    },
    buttonWrapper: {
        marginLeft: 10,
    },
});