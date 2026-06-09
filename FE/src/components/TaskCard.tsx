import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../types/types';

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onPress }) => {
  // Determine if we need to show a warning color based on BE status (Vietnamese string)
  const isOverdue = task.status === 'TRỄ HẠN';
  const needsRevision = task.status === 'CẦN SỬA';

  const dateColor = isOverdue ? '#D32F2F' : '#555555';
  
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Optional Badge for needs revision or overdue */}
      {(needsRevision || isOverdue) && (
        <View style={[
          styles.statusBadge, 
          { backgroundColor: isOverdue ? '#FFEBEE' : '#FFF3E0' }
        ]}>
          <Text style={[
            styles.statusText, 
            { color: isOverdue ? '#D32F2F' : '#E65100' }
          ]}>
            {task.status}
          </Text>
        </View>
      )}

      <Text style={styles.title}>{task.title}</Text>

      <View style={styles.infoRow}>
        <Ionicons name="person-outline" size={14} color="#666" style={styles.icon} />
        <Text style={styles.infoText}>Mentor: {task.mentor}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="time-outline" size={14} color={dateColor} style={styles.icon} />
        <Text style={[styles.infoText, { color: dateColor, fontWeight: isOverdue ? '600' : '400' }]}>
          {task.date}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 24,
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
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
    letterSpacing: -0.3,
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

export type { Task };
