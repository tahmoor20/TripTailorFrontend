import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Modal, Pressable } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUser } from '../../services/api';
import type { User } from '../../types';

export default function AccountSettings() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState('');
  const [user, setUser] = useState<Pick<User, 'fullName' | 'profileImage'>>({ fullName: '', profileImage: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        try {
          setUser(await getUser());
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const showPopup = (text: string) => {
    setModalText(text);
    setModalVisible(true);
  };

  const handleLogout = async () => {
    try {
      // Token aur user data ko AsyncStorage se remove karo
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('fullName');

      // User ko login page par redirect karo
      router.replace('/SignIn'); // Replace use karo taki user back par na ja sake
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBackground}></View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image source={{ uri: user.profileImage || require('../../assets/images/paris.jpg') }} style={styles.profileImage} />
        <Text style={styles.profileName}>{user.fullName}</Text>
      </View>

      {/* Menu Options */}
      <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/profile')}>
        <Ionicons name="person-outline" size={24} color="#636AE8FF" />
        <Text style={styles.menuText}>Personal Information</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="#636AE8FF" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => showPopup('Welcome to Trip Tailor! Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our app.')}>
        <Ionicons name="shield-checkmark-outline" size={24} color="#636AE8FF" />
        <Text style={styles.menuText}>Privacy & Security</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => showPopup('If you need help with our app, we’re here for you! Email us at support@email.com')}>
        <Ionicons name="headset-outline" size={24} color="#636AE8FF" />
        <Text style={styles.menuText}>Support</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>

      {/* Popup Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalText}</Text>
            <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBackground: {
    backgroundColor: '#636AE8FF', 
    height: 150, 
    width: '100%',
    position: 'absolute', 
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 100, 
    marginBottom: 50, 
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileName: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: '#636AE8FF',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#636AE8FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
  },
});