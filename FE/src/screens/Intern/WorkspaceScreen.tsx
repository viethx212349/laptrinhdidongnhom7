import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TaskListScreen from './TaskListScreen';
import ProfileScreen from './ProfileScreen';
import useAuthStore from '../../store/useAuthStore';
import { RootStackParamList } from '../../types/types';
import { getUnreadCount } from '../../services/notificationService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Workspace'>;

const WorkspaceScreen = () => {
  const [activeTab, setActiveTab] = useState<'WORKSPACE' | 'PROFILE'>('WORKSPACE');
  const [unreadCount, setUnreadCount] = useState(0);
  const { intern } = useAuthStore();
  const navigation = useNavigation<NavigationProp>();

  useFocusEffect(
    useCallback(() => {
      const checkUnread = async () => {
        const count = await getUnreadCount();
        setUnreadCount(count);
      };
      checkUnread();
    }, [])
  );

  const handleBellPress = () => {
    navigation.navigate('Notifications');
  };

  if (!intern) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{activeTab === 'WORKSPACE' ? 'MY WORKSPACE' : 'PROFILE'}</Text>
          <Text style={styles.code}>Mã thực tập sinh: {intern.intern_code}</Text>
        </View>
        <TouchableOpacity style={styles.bellContainer} onPress={handleBellPress}>
          <Ionicons name="notifications" size={24} color="#000" />
          {unreadCount > 0 && <View style={styles.badge} />}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === 'WORKSPACE' ? <TaskListScreen /> : <ProfileScreen intern={intern} />}
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'WORKSPACE' && styles.navItemActive]}
          onPress={() => setActiveTab('WORKSPACE')}
        >
          <Text style={[styles.navText, activeTab === 'WORKSPACE' && styles.navTextActive]}>WORKSPACE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'PROFILE' && styles.navItemActive]}
          onPress={() => setActiveTab('PROFILE')}
        >
          <Text style={[styles.navText, activeTab === 'PROFILE' && styles.navTextActive]}>PROFILE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 48 : 56,
    paddingBottom: 16,
    backgroundColor: '#FAFAFA',
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    marginBottom: 6,
  },
  code: {
    fontSize: 14,
    color: '#666',
  },
  bellContainer: {
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E53935', // Red dot
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 14,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E8E8E8',
    borderTopWidth: 1,
  },
  navItem: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
  },
  navItemActive: {
    backgroundColor: '#000000',
  },
  navText: {
    color: '#7A7A7A',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.7,
  },
  navTextActive: {
    color: '#FFFFFF',
  },
});

export default WorkspaceScreen;
