import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task, TaskStatus } from '../types/types';
import { getStatusLabel, getStatusColor } from '../services/taskService';

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onPress }) => {
  const statusColor = getStatusColor(task.status);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Status Badge */}
      <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
        <Text style={[styles.statusText, { color: statusColor.text }]}>
          {getStatusLabel(task.status)}
        </Text>
      </View>

      <Text style={styles.title}>{task.title}</Text>

      <View style={styles.infoRow}>
        <Ionicons name="person" size={12} color="#666" style={styles.icon} />
        <Text style={styles.infoText}>Mentor: {"HusTrung"}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="time" size={12} color="#666" style={styles.icon} />
        <Text style={styles.infoText}>{task.date}</Text>
      </View>
    </TouchableOpacity>
  );
};



// Đây là phần vẽ màu cho TaskCard, bạn có thể tùy chỉnh theo ý muốn để phù hợp với thiết kế của bạn.
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 8,
    marginBottom: 16,
    // Soft shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 2,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#555555',
  },
});

export default TaskCard;

// Re-export Task type for backward compatibility
export type { Task };
