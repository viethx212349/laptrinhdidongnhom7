import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, ScrollView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TaskCard, { Task } from '../../components/TaskCard';

const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Design System Documentation', mentor: 'John Doe', date: 'Mar 25, 2026' },
  { id: '2', title: 'Core API Infrastructure', mentor: 'Sarah Chen', date: 'Apr 02, 2026' },
  { id: '3', title: 'Mobile Wireframe Prototyping', mentor: 'Alex Rivera', date: 'Mar 28, 2026' },
];

const TABS = ['IN PROGRESS', 'IN REVIEW', 'DONE', 'REJECTED'];

const TaskListScreen = () => {
  const [activeTab, setActiveTab] = useState('IN PROGRESS');

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>My Workspace</Text>
      <TouchableOpacity style={styles.bellContainer}>
        <Ionicons name="notifications" size={24} color="#000" />
        <View style={styles.badge} />
      </TouchableOpacity>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
        {TABS.map(tab => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {renderHeader()}
        
        {/* Divider line below header */}
        <View style={styles.divider} />
        
        {renderTabs()}
        
        <View style={styles.listHeader}>
          <Text style={styles.listHeaderText}>ACTIVE ASSIGNMENTS (3)</Text>
          <TouchableOpacity>
            <Ionicons name="filter" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={MOCK_TASKS}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TaskCard task={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: '#FAFAFA',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
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
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginBottom: 24,
  },
  tabsContainer: {
    backgroundColor: '#F0F0F0',
    marginHorizontal: 24,
    borderRadius: 8,
    padding: 4,
    marginBottom: 32,
  },
  tabsScroll: {
    flexDirection: 'row',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#888888',
    letterSpacing: 0.5,
  },
  activeTabText: {
    color: '#000000',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  listHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#777777',
    letterSpacing: 1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
});

export default TaskListScreen;
