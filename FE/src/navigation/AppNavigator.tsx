import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TaskListScreen from '../screens/Intern/TaskListScreen';
import TaskDetailScreen from '../screens/Intern/TaskDetailScreen';
import NotificationsScreen from '../screens/Intern/NotificationsScreen';
import { RootStackParamList } from '../types/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="TaskList"
      screenOptions={{
        headerShown: false,  // Dùng custom header trong mỗi screen
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="TaskList" component={TaskListScreen} />
      <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          animation: 'slide_from_bottom',  // Modal-style slide up
        }}
      />
    </Stack.Navigator>
  );
}