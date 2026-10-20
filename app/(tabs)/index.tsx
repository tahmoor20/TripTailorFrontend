import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCities } from '../../services/api';
import type { City } from '../../types';

export default function HomeScreen() {
    const [cities, setCities] = useState<City[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [fullName, setFullName] = useState('');
    const router = useRouter();

    useEffect(() => {
        checkLoginStatus();
        fetchCities();
    }, []);

    const checkLoginStatus = async () => {
        const token = await AsyncStorage.getItem('token');
        const name = await AsyncStorage.getItem('fullName');
        if (token) {
            setIsLoggedIn(true);
            setFullName(name || '');
        } else {
            router.push('/SignIn');
        }
    };

    const fetchCities = async () => {
        try {
            setCities(await getCities());
        } catch (error) {
            console.error(error);
        }
    };

    const handleCityPress = (city: City) => {
        router.push({
            pathname: '/homecitydetails',
            params: { city: JSON.stringify(city) },
        });
    };

    const handleExplorePress = () => {
        router.push('/explore'); // Navigate to Explore screen
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('fullName');
        setIsLoggedIn(false);
        router.push('/SignIn');
    };

    return (
        <>
            <View style={styles.topBar}></View>
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.userInfo}>
                        <Text style={styles.welcomeText}>Welcome 👋</Text>
                        {isLoggedIn && <Text style={styles.nameText}>{fullName}</Text>}
                    </View>
                    <TouchableOpacity onPress={handleLogout}>
                        <MaterialIcons name="logout" size={24} color="#636AE8FF" />
                    </TouchableOpacity>
                </View>

                {/* Destination City Input - Clickable */}
                <TouchableOpacity onPress={handleExplorePress}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Destination City"
                        placeholderTextColor="#ccc"
                        editable={false} // Makes it non-editable but clickable
                    />
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>The best cities for you</Text>
                <FlatList
                    data={cities}
                    horizontal
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleCityPress(item)} style={styles.cityCard}>
                            <Image source={{ uri: item.imageUrl }} style={styles.cityImage} />
                            <Text style={styles.cityText}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                    showsHorizontalScrollIndicator={false}
                />

                {/* Explore Destinations Section - Clickable */}
                <Text style={styles.sectionTitle}>Explore Destinations</Text>
                <TouchableOpacity 
                    style={[styles.exploreCard, { marginBottom: 100 }]} 
                    onPress={handleExplorePress}
                >
                    <Image 
                        source={require('../../assets/images/explore.png')} 
                        style={styles.exploreImage} 
                    />
                </TouchableOpacity>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    topBar: {
        height: 50,
        backgroundColor: '#636AE8FF',
        width: '100%',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    userInfo: {
        flexDirection: 'column',
    },
    welcomeText: {
        fontSize: 16,
        color: '#555',
    },
    nameText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    searchInput: {
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        fontSize: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        marginBottom: 15,
    },
    cityCard: {
        marginRight: 15,
        marginBottom: 20,
    },
    cityImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
    },
    cityText: {
        marginTop: 5,
        marginLeft: 5,
        fontSize: 16,
        color: '#555',
    },
    exploreCard: {
        alignItems: 'center',
    },
    exploreImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
});