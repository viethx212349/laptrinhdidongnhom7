import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/types';
import { verifyInternCode } from '../../services/apiClient';
import useAuthStore from '../../store/useAuthStore';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Workspace'>;

const IdentityScreen = () => {
  const [internCode, setInternCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const { saveCurrentIntern } = useAuthStore();

  const handleLogin = async () => {
    if (!internCode.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập Mã Intern ID');
      return;
    }

    try {
      setLoading(true);
      // Gọi API BE thật
      const res = await verifyInternCode(internCode.trim());
      if (res.success && res.data) {
        saveCurrentIntern(res.data);
        navigation.replace('Workspace');
      } else {
        Alert.alert('Lỗi', res.message || 'Mã không hợp lệ');
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể kết nối đến máy chủ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>TRUY CẬP</Text>

        <TextInput
          style={styles.input}
          placeholder="Mã Intern ID"
          placeholderTextColor="#999"
          value={internCode}
          onChangeText={setInternCode}
          autoCapitalize="characters"
          autoCorrect={false}
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>BẮT ĐẦU →</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 40,
    borderRadius: 24,
    alignItems: 'center',
    // Shadow cho iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    // Elevation cho Android
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#000000',
    marginBottom: 40,
    letterSpacing: 1,
  },
  input: {
    width: '100%',
    height: 56,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#000000',
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '500',
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: '#000000',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
  },
});

export default IdentityScreen;
