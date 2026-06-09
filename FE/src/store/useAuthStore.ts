export interface InternUser {
  intern_id: string;
  intern_code: string;
  full_name: string;
  email?: string;
  position?: string;
  status?: string;
}


import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';



const STORAGE_KEY = '@internflow:currentIntern';

export default function useAuthStore() {
  const [intern, setIntern] = useState<InternUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    restoreCurrentIntern();
  }, []);

  const restoreCurrentIntern = async () => {
    try {
      const rawValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (!rawValue) {
        setIntern(null);
        return;
      }

      const storedIntern = JSON.parse(rawValue) as InternUser;
      if (storedIntern?.intern_id && storedIntern?.intern_code && storedIntern?.full_name) {
        setIntern(storedIntern);
      } else {
        setIntern(null);
      }
    } catch {
      setIntern(null);
    } finally {
      setLoading(false);
    }
  };

  const saveCurrentIntern = async (currentIntern: InternUser) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(currentIntern));
      setIntern(currentIntern);
    } catch {
      setError('Không thể lưu thông tin thực tập sinh.');
    }
  };

  const clearCurrentIntern = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setIntern(null);
    } catch {
      setError('Không thể đăng xuất.');
    }
  };

  return {
    intern,
    loading,
    error,
    setError,
    restoreCurrentIntern,
    saveCurrentIntern,
    clearCurrentIntern,
  };
}
