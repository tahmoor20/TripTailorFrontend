import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the "X" icon

const CityDetailsScreen = () => {
    const { city } = useLocalSearchParams();
    const parsedCity = JSON.parse(city);
    const [selectedDay, setSelectedDay] = useState(1);
    const router = useRouter();

    const handleDayPress = (day) => {
        setSelectedDay(day);
        // Scroll to the selected day
        const element = document.getElementById(`day-${day}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleClose = () => {
        router.replace('/'); // Redirect to home screen
    };

    return (
        <ScrollView style={styles.container}>
            {/* Close Button (Top-Right) */}
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#636AE8FF" />
            </TouchableOpacity>

            {/* Banner Image */}
            <Image
                source={{ uri: parsedCity.imageUrl }}
                style={styles.bannerImage}
            />

            {/* Title */}
            <Text style={styles.title}>Your Trip to {parsedCity.name} for 3 Days</Text>

            {/* Description */}
            <Text style={styles.description}>
                {parsedCity.description}
            </Text>

            {/* Day Tabs */}
            <View style={styles.tabContainer}>
                {[1, 2, 3].map((day) => (
                    <TouchableOpacity
                        key={day}
                        style={[styles.tab, selectedDay === day && styles.selectedTab]}
                        onPress={() => handleDayPress(day)}
                    >
                        <Text style={styles.tabText}>Day {day}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Day-wise Activities */}
            <FlatList
                data={parsedCity.plan}
                keyExtractor={(item) => item.day.toString()}
                renderItem={({ item }) => (
                    <View id={`day-${item.day}`} style={styles.dayContainer}>
                        <Text style={styles.dayTitle}>Day {item.day}</Text>
                        <Text style={styles.description}>{item['day-description']}</Text>
                        {item.activities.map((activity, index) => (
                            <View key={index} style={styles.activityContainer}>
                                {/* Activity Image */}
                                <Image
                                    source={{ uri: activity.imageUrl }}
                                    style={styles.activityImage}
                                />
                                <Text style={styles.activityName}>{activity.activity}</Text>
                                <Text style={styles.activityDescription}>{activity.description}</Text>
                                <Text style={styles.activityCost}>Ticket Cost: ${activity.ticketPrice}</Text>
                                <Text style={styles.activityDistance}>
                                    Distance to Next Activity: {activity.distanceToNextActivity} km
                                </Text>
                                <Text style={styles.activityTravelOption}>
                                    Best Travel Option: {activity.bestTravelOption || 'N/A'}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 10, // Ensures it stays above other elements
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 50,
        padding: 2,
    },
    bannerImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
        textAlign: 'justify',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    tab: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#f1f1f1',
    },
    selectedTab: {
        backgroundColor: '#636AE8FF',
    },
    tabText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    dayContainer: {
        marginBottom: 20,
    },
    dayTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    activityContainer: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
    },
    activityImage: {
        width: '100%',
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    activityName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    activityDescription: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
    activityCost: {
        fontSize: 14,
        color: '#777',
        marginBottom: 5,
    },
    activityDistance: {
        fontSize: 14,
        color: '#777',
        marginBottom: 5,
    },
    activityTravelOption: {
        fontSize: 14,
        color: '#777',
    },
});

export default CityDetailsScreen;