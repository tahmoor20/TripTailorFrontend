import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

interface ItineraryData {
  destination: string;
  fromDate: string;
  toDate: string;
  companion: string;
  interests: string[];
  itinerary: string;
}

const ItineraryScreen = () => {
  const params = useLocalSearchParams();
  const itinerary: ItineraryData = JSON.parse(params.itinerary as string);

  // Format the itinerary text with proper line breaks
  const formattedItinerary = itinerary.itinerary.split('\n').map((line, index) => (
    <Text key={index} style={styles.itineraryText}>
      {line}
      {'\n'}
    </Text>
  ));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Travel Plan</Text>
      <Text style={styles.subtitle}>{itinerary.destination}</Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          <Text style={styles.infoLabel}>Dates: </Text>
          {itinerary.fromDate} to {itinerary.toDate}
        </Text>
        
        <Text style={styles.infoText}>
          <Text style={styles.infoLabel}>Traveling with: </Text>
          {itinerary.companion}
        </Text>
        
        <Text style={styles.infoText}>
          <Text style={styles.infoLabel}>Interests: </Text>
          {itinerary.interests.join(', ')}
        </Text>
      </View>

      <View style={styles.itineraryContainer}>
        <Text style={styles.sectionTitle}>Your Itinerary</Text>
        {formattedItinerary}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  subtitle: {
    fontSize: 20,
    color: '#636AE8',
    marginBottom: 20,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  itineraryContainer: {
    marginBottom: 30,
  },
  itineraryText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginBottom: 10,
  },
});

export default ItineraryScreen;