import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TaskDetailScreen = () => {
  return (
    <View style={styles.container}>
      <Text>TaskDetailScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TaskDetailScreen;
