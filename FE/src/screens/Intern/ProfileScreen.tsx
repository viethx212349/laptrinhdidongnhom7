import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { InternUser } from '../../store/useAuthStore';
import { fetchInternDashboard, InternDashboardTask } from '../../services/apiClient';

interface ProfileScreenProps {
  intern: InternUser;
}

const ProfileScreen = ({ intern }: ProfileScreenProps) => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<InternDashboardTask[]>([]);
  const [summary, setSummary] = useState({ total_tasks: 0, completed_count: 0, overdue_count: 0 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchInternDashboard(intern.intern_id);

        if (!response.success) {
          throw new Error('Không thể tải dữ liệu hồ sơ.');
        }

        setTasks(response.data.tasks);
        setSummary(response.data.summary);
      } catch {
        setError('Không thể tải dữ liệu hồ sơ. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [intern.intern_id]);


  const totalTasks = summary.total_tasks;
  const completedCount = summary.completed_count;
  const overdueCount = summary.overdue_count;

  const statusColor = (status: InternDashboardTask['status']) => {
    switch (status) {
      case 'HOÀN THÀNH':
        return '#0E8D45';
      case 'TRỄ HẠN':
        return '#D32F2F';
      case 'CẦN SỬA':
        return '#F2994A';
      case 'CHỜ DUYỆT':
        return '#2651A8';
      case 'ĐANG LÀM':
        return '#2F80ED';
      default:
        return '#999999';
    }
  };

  const renderItem = ({ item }: { item: InternDashboardTask }) => (
    <View style={styles.recordCard}>
      <View style={styles.recordLeft}>
        <Text style={styles.recordTitle}>{item.title}</Text>
        <Text style={styles.recordDate}>{item.date || 'N/A'}</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: statusColor(item.status) }]}> 
        <Text style={styles.badgeText}>{item.status}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0A74FF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
       <ScrollView showsVerticalScrollIndicator={true}> {/*Tạo một ScrollView dùng để lướt lên lướt xuống toàn bộ màn hình */}
      <View style={styles.profileHeader}>
        <Text style={styles.profileTitle}>PROFILE</Text>
      </View>

      <View style={styles.profileCard}>
        <Text style={styles.nameText}>{intern.full_name}</Text>
        <Text style={styles.positionText}>{intern.position ?? 'Thực tập sinh'}</Text>
        <Text style={styles.emailText}>{intern.email ?? 'Chưa có email'}</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoLabel}>
            <Text style={styles.infoTitle}>TRẠNG THÁI</Text>
            <Text style={styles.infoValue}>{intern.status ?? 'ĐANG THỰC TẬP'}</Text>
          </View>
          <View style={styles.infoLabel}>
            <Text style={styles.infoTitle}>BỘ PHẬN</Text>
            <Text style={styles.infoValue}>{intern.position ?? 'Chưa cập nhật'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statsCard}>
          <Text style={styles.statsNumber}>{totalTasks}</Text>
          <Text style={styles.statsLabel}>TỔNG TASK</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsNumber}>{completedCount}</Text>
          <Text style={styles.statsLabel}>HOÀN THÀNH</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsNumber}>{overdueCount}</Text>
          <Text style={styles.statsLabel}>TRỄ HẠN</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>LỊCH SỬ CÔNG VIỆC</Text>

      {tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Chưa có task nào.</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
      </ScrollView>
    </SafeAreaView>
  );
};






// dùng để vẽ màn hình profile của thực tập sinh, hiển thị thông tin cá nhân và lịch sử công việc
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  profileHeader: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 18,
    backgroundColor: '#F7F8FA',
  },
  profileTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#111111',
  },
  profileCard: {
    marginHorizontal: 24,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 24,
    elevation: 5,
  },
  nameText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 8,
  },
  positionText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#6B7280',
    marginBottom: 12,
  },
  emailText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  infoRow: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 20,
  },
  infoLabel: {
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999999',
    letterSpacing: 1,
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginTop: 20,
  },
  statsCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 3,
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 8,
  },
  statsLabel: {
    fontSize: 12,
    color: '#777777',
    letterSpacing: 0.7,
    textAlign: 'center',
  },
  sectionTitle: {
    marginTop: 26,
    marginHorizontal: 24,
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  recordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  recordLeft: {
    flex: 1,
    paddingRight: 12,
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 6,
  },
  recordDate: {
    fontSize: 13,
    color: '#777777',
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#777777',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F8FA',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F7F8FA',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 15,
    textAlign: 'center',
  },
});

export default ProfileScreen;
