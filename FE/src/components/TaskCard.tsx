import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface Task {
  id: string;
  title: string;
  mentor: string;
  date: string;
}

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{task.title}</Text>
      
      <View style={styles.infoRow}>
        <Ionicons name="person" size={12} color="#666" style={styles.icon} />
        <Text style={styles.infoText}>Mentor: {task.mentor}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Ionicons name="time" size={12} color="#666" style={styles.icon} />
        <Text style={styles.infoText}>{task.date}</Text>
      </View>
    </View>
  );
};

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
