import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IdentityScreen from '../screens/Intern/IdentityScreen';
import WorkspaceScreen from '../screens/Intern/WorkspaceScreen';
import TaskDetailScreen from '../screens/Intern/TaskDetailScreen';
import NotificationsScreen from '../screens/Intern/NotificationsScreen';
import { RootStackParamList } from '../types/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      id="RootStack"
      initialRouteName="Identity"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Identity" component={IdentityScreen} />
      <Stack.Screen name="Workspace" component={WorkspaceScreen} />
      <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
}
