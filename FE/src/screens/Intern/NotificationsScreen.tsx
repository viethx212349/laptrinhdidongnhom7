import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  SectionList,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Notification } from '../../types/types';
import {
  getNotifications,
  markAllAsRead,
  getNotificationIcon,
} from '../../services/notificationService';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Notifications'>;

// =============================================================================
// Types
// =============================================================================
interface NotificationSection {
  title: string;
  data: Notification[];
}

// =============================================================================
// Component
// =============================================================================
const NotificationsScreen = () => {
  const navigation = useNavigation<NavProp>();
  const [sections, setSections] = useState<NotificationSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();

      // Check if there are unread notifications
      const unreadExists = data.some((n) => !n.isRead);
      setHasUnread(unreadExists);

      // Group by time period
      const grouped = groupByTimePeriod(data);
      setSections(grouped);

      // Mark all as read when screen opens (AC3)
      if (unreadExists) {
        await markAllAsRead();
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleNotificationPress = useCallback(
    (notification: Notification) => {
      // Navigate to task detail if notification has a taskId
      if (notification.taskId) {
        navigation.navigate('TaskDetail', { taskId: notification.taskId });
      }
    },
    [navigation]
  );

  // =========================================================================
  // RENDER
  // =========================================================================

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <RenderHeader onClose={handleClose} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </SafeAreaView>
    );
  }

  // Empty state (AC7)
  if (sections.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <RenderHeader onClose={handleClose} />
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={56} color="#CCC" />
          <Text style={styles.emptyTitle}>Hiện chưa có thông báo nào.</Text>
          <Text style={styles.emptySubtitle}>
            Các cập nhật về task sẽ hiển thị tại đây.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <RenderHeader onClose={handleClose} />
      <View style={styles.headerDivider} />

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{section.title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onPress={() => handleNotificationPress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
      />
    </SafeAreaView>
  );
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Header component with bell icon and close button
 */
const RenderHeader = ({ onClose }: { onClose: () => void }) => (
  <View style={styles.header}>
    <View style={styles.headerLeft}>
      <Ionicons name="notifications" size={20} color="#000" />
      <Text style={styles.headerTitle}>NOTIFICATIONS</Text>
    </View>
    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
      <Ionicons name="close" size={24} color="#000" />
    </TouchableOpacity>
  </View>
);

/**
 * Single notification item
 */
const NotificationItem = ({
  notification,
  onPress,
}: {
  notification: Notification;
  onPress: () => void;
}) => {
  const iconName = getNotificationIcon(notification.type);
  const isUnread = !notification.isRead;
  const timeAgo = formatTimeAgo(notification.createdAt);

  return (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        isUnread && styles.notificationCardUnread,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Left accent bar for unread */}
      {isUnread && <View style={styles.unreadAccent} />}

      <View style={styles.notificationContent}>
        {/* Icon */}
        <View style={[styles.iconContainer, isUnread && styles.iconContainerUnread]}>
          <Ionicons
            name={iconName as any}
            size={18}
            color={isUnread ? '#000' : '#999'}
          />
        </View>

        {/* Text content */}
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.notificationTitle,
                isUnread && styles.notificationTitleUnread,
              ]}
              numberOfLines={1}
            >
              {notification.title}
              {isUnread ? ' *' : ''}
            </Text>
            <Text style={styles.timeText}>{timeAgo}</Text>
          </View>
          <Text style={styles.messageText} numberOfLines={2}>
            {notification.message}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Group notifications by time period (TODAY, YESTERDAY, EARLIER)
 */
function groupByTimePeriod(notifications: Notification[]): NotificationSection[] {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  const today: Notification[] = [];
  const yesterday: Notification[] = [];
  const earlier: Notification[] = [];

  // Sort by most recent first
  const sorted = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  for (const n of sorted) {
    const date = new Date(n.createdAt);
    if (date >= todayStart) {
      today.push(n);
    } else if (date >= yesterdayStart) {
      yesterday.push(n);
    } else {
      earlier.push(n);
    }
  }

  const sections: NotificationSection[] = [];
  if (today.length > 0) sections.push({ title: 'TODAY', data: today });
  if (yesterday.length > 0) sections.push({ title: 'YESTERDAY', data: yesterday });
  if (earlier.length > 0) sections.push({ title: 'EARLIER', data: earlier });

  return sections;
}

/**
 * Format a date string to "Xh ago", "Xd ago" etc.
 */
function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: '#FAFAFA',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 1.5,
    marginLeft: 10,
  },
  closeButton: {
    padding: 4,
  },
  headerDivider: {
    height: 1,
    backgroundColor: '#EEEEEE',
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Empty state (AC7)
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#BBB',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Section headers
  sectionHeader: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 12,
  },
  sectionHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#999',
    letterSpacing: 1.5,
  },

  // List
  listContent: {
    paddingBottom: 24,
  },

  // Notification card
  notificationCard: {
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    overflow: 'hidden',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  notificationCardUnread: {
    backgroundColor: '#FFFFFF',
    shadowOpacity: 0.08,
    elevation: 2,
    borderLeftWidth: 0, // accent handled by inner view
  },
  unreadAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: '#000',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  notificationContent: {
    flexDirection: 'row',
    padding: 16,
    paddingLeft: 18,
  },

  // Icon
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconContainerUnread: {
    backgroundColor: '#F0F0F0',
  },

  // Text
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    flex: 1,
    marginRight: 8,
  },
  notificationTitleUnread: {
    fontWeight: '700',
    color: '#000',
  },
  timeText: {
    fontSize: 11,
    color: '#BBB',
    fontWeight: '500',
  },
  messageText: {
    fontSize: 13,
    color: '#888',
    lineHeight: 19,
  },
});

export default NotificationsScreen;
