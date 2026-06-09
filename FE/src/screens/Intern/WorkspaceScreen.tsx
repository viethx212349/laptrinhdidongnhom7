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
        <Text style={styles.greeting}>
          {activeTab === 'WORKSPACE' ? 'My Workspace' : 'PROFILE'}
        </Text>
        <TouchableOpacity style={styles.bellContainer} onPress={handleBellPress}>
          <Ionicons name="notifications-outline" size={26} color="#000" />
          {unreadCount > 0 && <View style={styles.badge} />}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === 'WORKSPACE' ? <TaskListScreen /> : <ProfileScreen intern={intern} />}
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('WORKSPACE')}
        >
          <Ionicons name="grid-outline" size={24} color={activeTab === 'WORKSPACE' ? "#000" : "#999"} />
          <Text style={[styles.navText, activeTab === 'WORKSPACE' && styles.navTextActive]}>WORKSPACE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('PROFILE')}
        >
          <Ionicons name="person-outline" size={24} color={activeTab === 'PROFILE' ? "#000" : "#999"} />
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
    paddingTop: Platform.OS === 'android' ? 48 : 64,
    paddingBottom: 24,
    backgroundColor: '#FAFAFA',
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.5,
  },
  bellContainer: {
    padding: 4,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D32F2F',
    borderWidth: 2,
    borderColor: '#FAFAFA',
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    backgroundColor: '#FAFAFA',
    borderTopColor: '#EEEEEE',
    borderTopWidth: 1,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
  },
  navText: {
    color: '#999999',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 4,
  },
  navTextActive: {
    color: '#000000',
  },
});

export default WorkspaceScreen;
