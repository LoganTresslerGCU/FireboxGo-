import * as React from 'react';
import { Text, View } from 'react-native';
import BannerNav from '../components/BannerNav';

export default function SearchScreen() {
    return (
        <View style={{ flex: 1 }}>
            <BannerNav />
            <Text>This is the Search Page. You will be able to search for anything here.</Text>
        </View>
    );
}