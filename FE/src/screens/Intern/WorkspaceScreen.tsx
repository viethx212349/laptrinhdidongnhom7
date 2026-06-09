import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import TaskListScreen from './TaskListScreen';
import ProfileScreen from './ProfileScreen';
import { InternUser } from '../../store/useAuthStore';

interface WorkspaceScreenProps {
  intern: InternUser;
}

const WorkspaceScreen = ({ intern }: WorkspaceScreenProps) => {
  const [activeTab, setActiveTab] = useState<'WORKSPACE' | 'PROFILE'>('WORKSPACE');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{activeTab === 'WORKSPACE' ? 'MY WORKSPACE' : 'PROFILE'}</Text>
        <Text style={styles.code}>Mã thực tập sinh: {intern.intern_code}</Text>
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
    paddingHorizontal: 24,
    paddingTop: 48,
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
