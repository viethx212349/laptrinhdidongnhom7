import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TaskCard from '../../components/TaskCard';
import { MOCK_TASKS } from '../../utils/mockData';
import { RootStackParamList } from '../../types/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Workspace'>;

const TABS = ['IN PROGRESS', 'IN REVIEW', 'DONE', 'REJECTED'];

const TaskListScreen = () => {
  const [activeTab, setActiveTab] = useState('IN PROGRESS');
  const navigation = useNavigation<NavigationProp>();

  const handleTaskPress = (taskId: string) => {
    navigation.navigate('TaskDetail', { taskId });
  };

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
    <View style={styles.container}>
      <View style={styles.divider} />
      {renderTabs()}

      <View style={styles.listHeader}>
        <Text style={styles.listHeaderText}>ACTIVE ASSIGNMENTS ({MOCK_TASKS.length})</Text>
        <TouchableOpacity>
          <Ionicons name="filter" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_TASKS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={() => handleTaskPress(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
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
