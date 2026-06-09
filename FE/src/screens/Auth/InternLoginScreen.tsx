import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { verifyInternCode } from '../../services/apiClient';
import { InternUser } from '../../store/useAuthStore';

interface InternLoginScreenProps {
  onLoginSuccess: (intern: InternUser) => void;
}

const InternLoginScreen = ({ onLoginSuccess }: InternLoginScreenProps) => {
  const [internCode, setInternCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    const trimmedCode = internCode.trim();
    if (!trimmedCode) {
      setErrorMessage('Vui lòng nhập mã thực tập sinh.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await verifyInternCode(trimmedCode);

      if (!response.success) {
        setErrorMessage('Mã thực tập sinh không hợp lệ.');
        return;
      }

      const { intern_id, intern_code, full_name, email, position, status } = response.data;
      onLoginSuccess({ intern_id, intern_code, full_name, email, position, status });
    } catch (error) {
      setErrorMessage('Mã thực tập sinh không hợp lệ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
          editable={!isSubmitting}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>BẮT ĐẦU  →</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F5F8',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 30,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F7F8FA',
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#111111',
    marginBottom: 20,
  },
  button: {
    height: 56,
    backgroundColor: '#121212',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  errorText: {
    marginBottom: 20,
    color: '#D32F2F',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default InternLoginScreen;
