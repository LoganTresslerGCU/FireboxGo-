import * as React from 'react';
import { Text, View } from 'react-native';
import BannerNav from '../components/BannerNav';

export default function AccountScreen() {
    return (
        <View style={{ flex: 1 }}>
            <BannerNav />
            <Text>This is the Account Page. You will be able to all your account details here.</Text>
        </View>
    );
}