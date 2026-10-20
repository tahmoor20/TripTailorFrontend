import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiErrorMessage, signIn } from '../services/api';
import { validateSignIn, type FormErrors } from '../utils/validation';

const SignInScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const router = useRouter();

    const validateForm = () => {
        const newErrors = validateSignIn({ email, password });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignIn = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const { token, fullName } = await signIn(email.trim(), password);
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('fullName', fullName); // Saved to greet the user on the home screen
            router.push('/');
        } catch (error) {
            setErrors({ accountError: getApiErrorMessage(error) });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome back</Text>

            {/* Email Field */}
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#ccc"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            {/* Password Field */}
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#ccc"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            {/* Sign In Button */}
            <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>

            {/* Account Error Message */}
            {errors.accountError && (
                <Text style={styles.accountErrorText}>{errors.accountError}</Text>
            )}

            {/* Sign Up Link */}
            <TouchableOpacity onPress={() => router.push('/SignUp')}>
                <Text style={styles.link}>Don't have an account? Sign up</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#636AE8FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    link: {
        color: '#636AE8FF',
        fontSize: 14,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    accountErrorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default SignInScreen;