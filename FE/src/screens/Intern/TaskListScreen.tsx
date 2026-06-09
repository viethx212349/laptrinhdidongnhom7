import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TaskCard from '../../components/TaskCard';
import { RootStackParamList } from '../../types/types';
import { fetchInternDashboard, InternDashboardTask } from '../../services/apiClient';
import useAuthStore from '../../store/useAuthStore';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Workspace'>;

const TABS = ['ĐANG LÀM', 'CẦN SỬA', 'CHỜ DUYỆT', 'HOÀN THÀNH', 'TRỄ HẠN'];

const TaskListScreen = () => {
  const [activeTab, setActiveTab] = useState('ĐANG LÀM');
  const [tasks, setTasks] = useState<InternDashboardTask[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp>();
  const { intern } = useAuthStore();

  const loadTasks = async () => {
    if (!intern) return;
    try {
      setLoading(true);
      const res = await fetchInternDashboard(intern.intern_id);
      if (res.success && res.data) {
        setTasks(res.data.tasks);
      }
    } catch (error: any) {
      console.error('Failed to fetch tasks:', error);
      Alert.alert('Lỗi kết nối', error.message || 'Không thể lấy dữ liệu công việc. Vui lòng kiểm tra lại kết nối Backend.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [intern])
  );

  const handleTaskPress = (taskId: string) => {
    navigation.navigate('TaskDetail', { taskId });
  };

  const getFilteredAndSortedTasks = () => {
    let filtered = tasks.filter(t => t.status === activeTab);

    return filtered.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;

      if (activeTab === 'HOÀN THÀNH' || activeTab === 'CHỜ DUYỆT') {
        return dateB - dateA;
      } else {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return dateA - dateB;
      }
    });
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

  const displayTasks = getFilteredAndSortedTasks();

  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      {renderTabs()}

      <View style={styles.listHeader}>
        <Text style={styles.listHeaderText}>CÔNG VIỆC ({displayTasks.length})</Text>
        <TouchableOpacity>
          <Ionicons name="filter" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={displayTasks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            let formattedDate = 'Không có';
            if (item.date) {
              const d = new Date(item.date);
              if (!isNaN(d.getTime())) {
                formattedDate = d.toLocaleDateString('vi-VN');
              } else {
                formattedDate = item.date;
              }
            }
            return (
            <TaskCard
              task={{
                id: item.id,
                title: item.title,
                mentor: 'Chưa có', // Sẽ được hiển thị trong TaskCard nếu có
                date: formattedDate,
                status: item.status as any,
              }}
              onPress={() => handleTaskPress(item.id)}
            />
          )}}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Hiện không có công việc nào.</Text>
          }
        />
      )}
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
    paddingHorizontal: 16,
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
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontSize: 14,
  },
});

export default TaskListScreen;
