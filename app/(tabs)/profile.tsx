import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUser, updateUser } from '../../services/api';

const ProfileScreen = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageChanged, setImageChanged] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        try {
          const user = await getUser();
          setName(user.fullName);
          setPhone(user.phoneNumber);
          setImage(user.profileImage ?? null);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageChanged(true);
    }
  };

  const handleSave = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      const formData = new FormData();
      formData.append('fullName', name);
      formData.append('phoneNumber', phone);
      // Only upload when the user picked a new picture, not the one the server already has.
      if (image && imageChanged) {
        const localUri = image;
        const filename = localUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
        formData.append('profileImage', { uri: localUri, name: filename, type } as unknown as Blob);
      }
  
      try {
        const updated = await updateUser(formData);
        alert('Changes Saved!');
        setImage(updated.profileImage ?? null);
        setImageChanged(false);
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header} />
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={image ? { uri: image } : require("../../assets/images/paris.jpg")}
          style={styles.avatar}
        />
      </TouchableOpacity>
      <Text style={styles.username}>{name}</Text>

      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" />
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Phone" keyboardType="phone-pad" />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.btnText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveBtn} onPress={() => router.push('/accountSettings')}>
        <Text style={styles.btnText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", backgroundColor: "#fff", paddingTop: 50,  },
  header: { backgroundColor: "#636AE8FF", width: "100%", height: 150, position: "absolute", top: 0,  },
  avatar: { width: 100, height: 100, borderRadius: 50, marginTop: 50, borderWidth: 3, borderColor: "white" },
  username: { fontSize: 18, fontWeight: "bold", marginTop: 10, marginBottom: 50,  },
  input: { width: "90%", padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 10, backgroundColor: "white", marginVertical: 5 },
  saveBtn: { width: "90%", backgroundColor: '#636AE8FF', padding: 15, borderRadius: 10, alignItems: "center", marginTop: 20 },
  btnText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default ProfileScreen;