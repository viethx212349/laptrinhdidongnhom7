import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TaskListScreen from './src/screens/Intern/TaskListScreen';

export default function App() {
  return (
    <View style={styles.container}>
      {/* Main Content Area */}
      <View style={styles.content}>
        <TaskListScreen />
      </View>
      
      {/* Mock Bottom Navigation */}
      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <Ionicons name="grid" size={24} color="#000" />
          <Text style={styles.activeNavText}>WORKSPACE</Text>
        </View>
        <View style={styles.navItem}>
          <Ionicons name="person" size={24} color="#A0A0A0" />
          <Text style={styles.navText}>PROFILE</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16, // Extra padding for iPhone home indicator
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  navItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  activeNavText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000',
    marginTop: 6,
    letterSpacing: 1,
  },
  navText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#A0A0A0',
    marginTop: 6,
    letterSpacing: 1,
  },
});
