import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  ActivityIndicator, 
  Platform,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { format, parse } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { generateItinerary, getApiErrorMessage, getRandomCities } from '../../services/api';
import type { City, ItineraryData } from '../../types';

const MultiStepForm = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [companion, setCompanion] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [randomCities, setRandomCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [tempFromDate, setTempFromDate] = useState(new Date());
  const [tempToDate, setTempToDate] = useState(new Date());
  const [submitting, setSubmitting] = useState(false);

  // Fetch random cities from backend
  const fetchRandomCities = async () => {
    try {
      setLoading(true);
      setRandomCities(await getRandomCities());
    } catch (error) {
      console.error('Error fetching cities:', error);
      Alert.alert('Error', 'Failed to load cities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset form when page comes into focus
  useFocusEffect(
    useCallback(() => {
      setStep(1);
      setDestination('');
      setFromDate('');
      setToDate('');
      setCompanion('');
      setInterests([]);
      setTempFromDate(new Date());
      setTempToDate(new Date());
      fetchRandomCities();
      return () => {};
    }, [])
  );

  const handleBack = () => step > 1 ? setStep(step - 1) : router.back();
  const handleClose = () => router.push('/');
  const handleNext = () => step < 4 && setStep(step + 1);

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(item => item !== interest) 
        : [...prev, interest]
    );
  };

  const handleCityPress = (cityName: string) => {
    setDestination(cityName);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Format dates for backend (yyyy-MM-dd)
      const formattedFromDate = format(tempFromDate, 'yyyy-MM-dd');
      const formattedToDate = format(tempToDate, 'yyyy-MM-dd');

      const formData = { 
        destination, 
        fromDate: formattedFromDate, 
        toDate: formattedToDate, 
        companion, 
        interests,
        budget: "medium" 
      };

      const itinerary = await generateItinerary(formData);

      const itineraryData: ItineraryData = { 
        ...formData, 
        itinerary,
        fromDate: format(tempFromDate, 'dd/MM/yyyy'), // For display
        toDate: format(tempToDate, 'dd/MM/yyyy')     // For display
      };

      router.push({
        pathname: '/itinerary',
        params: { itinerary: JSON.stringify(itineraryData) },
      });
    } catch (error) {
      console.error('Error generating itinerary:', error);
      Alert.alert('Error', getApiErrorMessage(error, 'Failed to generate itinerary. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return destination.trim() !== '';
      case 2: return fromDate.trim() !== '' && toDate.trim() !== '';
      case 3: return companion.trim() !== '';
      case 4: return interests.length > 0;
      default: return false;
    }
  };

  // Date handling functions
  const handleFromDateChange = (date: Date) => {
    setTempFromDate(date);
    setFromDate(format(date, 'dd/MM/yyyy'));
    if (date > tempToDate) {
      setTempToDate(date);
      setToDate(format(date, 'dd/MM/yyyy'));
    }
  };

  const handleToDateChange = (date: Date) => {
    setTempToDate(date);
    setToDate(format(date, 'dd/MM/yyyy'));
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar} />
      
      <View style={styles.iconContainer}>
        {step > 1 && (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#636AE8" />
          </TouchableOpacity>
        )}
        <View style={styles.closeIconWrapper}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#636AE8" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Step 1: Destination */}
        {step === 1 && (
          <View style={styles.cardContainer}>
            <Text style={styles.stepTitle}>Where do you want to go?</Text>
            <TextInput
              style={styles.input}
              placeholder="Search for a city..."
              placeholderTextColor="#999"
              value={destination}
              onChangeText={setDestination}
            />

            <Text style={styles.sectionTitle}>Popular Destinations</Text>
            
            {loading ? (
              <ActivityIndicator size="large" color="#636AE8" />
            ) : (
              <FlatList
                data={randomCities}
                horizontal
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    onPress={() => handleCityPress(item.name)} 
                    style={styles.cityCard}
                  >
                    <Image 
                      source={{ uri: item.imageUrl }} 
                      style={styles.cityImage} 
                    />
                    <Text style={styles.cityText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
              />
            )}

            <TouchableOpacity
              style={[styles.nextButton, !isStepValid() && styles.disabledButton]}
              onPress={handleNext}
              disabled={!isStepValid()}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 2: Dates */}
        {step === 2 && (
          <View style={styles.cardContainer}>
            <Text style={styles.stepTitle}>When do you want to go?</Text>
            
            <View style={styles.dateInputContainer}>
              <Text style={styles.dateLabel}>From Date:</Text>
              <DatePicker
                selected={tempFromDate}
                onChange={handleFromDateChange}
                minDate={new Date()}
                selectsStart
                startDate={tempFromDate}
                endDate={tempToDate}
                dateFormat="dd/MM/yyyy"
                customInput={
                  <TextInput 
                    style={[styles.input, Platform.OS === 'web' && styles.webDateInput]}
                    value={fromDate}
                    editable={false}
                  />
                }
              />
            </View>

            <View style={styles.dateInputContainer}>
              <Text style={styles.dateLabel}>To Date:</Text>
              <DatePicker
                selected={tempToDate}
                onChange={handleToDateChange}
                minDate={tempFromDate}
                selectsEnd
                startDate={tempFromDate}
                endDate={tempToDate}
                dateFormat="dd/MM/yyyy"
                customInput={
                  <TextInput 
                    style={[styles.input, Platform.OS === 'web' && styles.webDateInput]}
                    value={toDate}
                    editable={false}
                  />
                }
              />
            </View>

            <TouchableOpacity
              style={[styles.nextButton, !isStepValid() && styles.disabledButton]}
              onPress={handleNext}
              disabled={!isStepValid()}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 3: Companion */}
        {step === 3 && (
          <View style={styles.cardContainer}>
            <Text style={styles.stepTitle}>Who's coming with you?</Text>
            {['Solo', 'Couple', 'Family', 'Friends'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  companion === option && styles.selectedOptionButton,
                ]}
                onPress={() => setCompanion(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    companion === option && styles.selectedOptionText,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.nextButton, !isStepValid() && styles.disabledButton]}
              onPress={handleNext}
              disabled={!isStepValid()}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 4: Interests */}
        {step === 4 && (
          <View style={styles.cardContainer}>
            <Text style={styles.stepTitle}>What are your interests?</Text>
            {['History', 'Culture', 'Adventure', 'Nature', 'Nightlife', 'Food', 'Shopping'].map((interest) => (
              <TouchableOpacity
                key={interest}
                style={[
                  styles.optionButton,
                  interests.includes(interest) && styles.selectedOptionButton,
                ]}
                onPress={() => toggleInterest(interest)}
              >
                <Text
                  style={[
                    styles.optionText,
                    interests.includes(interest) && styles.selectedOptionText,
                  ]}
                >
                  {interest}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.nextButton, !isStepValid() && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={!isStepValid() || submitting}
            >
              <Text style={styles.nextButtonText}>
                {submitting ? 'Generating...' : 'Generate Itinerary'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  topBar: {
    height: 50,
    backgroundColor: '#636AE8',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  backButton: {
    padding: 10,
  },
  closeIconWrapper: {
    flex: 1,
    alignItems: 'flex-end',
  },
  closeButton: {
    padding: 10,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  dateInputContainer: {
    marginBottom: 15,
  },
  dateLabel: {
    marginBottom: 5,
    color: '#555',
    fontSize: 14,
  },
  webDateInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
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
    fontSize: 16,
    color: '#555',
  },
  optionButton: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedOptionButton: {
    backgroundColor: '#636AE8',
    borderColor: '#636AE8',
  },
  optionText: {
    fontSize: 16,
    color: '#555',
  },
  selectedOptionText: {
    color: '#fff',
  },
  nextButton: {
    backgroundColor: '#636AE8',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MultiStepForm;