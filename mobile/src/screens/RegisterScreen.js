import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    Alert, ScrollView, KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerUser } from '../api';

export default function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!username || !email || !password) {
            Alert.alert('Error', 'Semua field wajib diisi.');
            return;
        }
        setLoading(true);
        try {
            const res = await registerUser({ username, email, password });
            await AsyncStorage.setItem('token', res.data.token);
            await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
            navigation.replace('Home');
        } catch (err) {
            Alert.alert('Register Gagal', err.response?.data?.message || 'Terjadi kesalahan.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <StatusBar barStyle="light-content" backgroundColor="#F05A28" />
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <Text style={styles.title}>Rahasia Dapur</Text>
                    <Text style={styles.subtitle}>Daftar akun baru</Text>
                </View>

                <View style={styles.formCard}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput style={styles.input} placeholder="Masukkan username" placeholderTextColor="#9CA3AF"
                            value={username} onChangeText={setUsername} autoCapitalize="none" />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput style={styles.input} placeholder="Masukkan email" placeholderTextColor="#9CA3AF"
                            value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput style={styles.input} placeholder="Masukkan password" placeholderTextColor="#9CA3AF"
                            value={password} onChangeText={setPassword} secureTextEntry />
                    </View>
                    <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleRegister} disabled={loading} activeOpacity={0.8}>
                        <Text style={styles.buttonText}>{loading ? 'Mendaftar...' : 'Daftar'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.footerText}>
                            Sudah punya akun? <Text style={styles.link}>Login di sini</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7F8FA' },
    scrollContent: { flexGrow: 1 },
    header: {
        backgroundColor: '#F05A28', alignItems: 'center',
        paddingTop: 70, paddingBottom: 48,
        borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
    },
    title: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 6 },
    subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
    formCard: {
        backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 20, marginTop: -20,
        padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06, shadowRadius: 16, elevation: 6, marginBottom: 32,
    },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 13, fontWeight: '600', color: '#1A1A2E', marginBottom: 6 },
    input: {
        backgroundColor: '#F7F8FA', borderWidth: 1.5, borderColor: '#E5E7EB',
        borderRadius: 12, padding: 13, fontSize: 14, color: '#1A1A2E',
    },
    button: {
        backgroundColor: '#F05A28', borderRadius: 12, padding: 15, alignItems: 'center', marginTop: 8,
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
    footerText: { textAlign: 'center', marginTop: 20, fontSize: 13, color: '#6B7280' },
    link: { color: '#F05A28', fontWeight: '700' },
});
