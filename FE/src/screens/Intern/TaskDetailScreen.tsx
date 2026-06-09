import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Platform,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as DocumentPicker from 'expo-document-picker';
import * as Linking from 'expo-linking';
import { RootStackParamList, TaskDetail, TechnicalBrief } from '../../types/types';
import {
  getTaskDetail,
  submitReport,
  canSubmitReport,
  getStatusLabel,
  getStatusColor,
} from '../../services/taskService';

type DetailRouteProp = RouteProp<RootStackParamList, 'TaskDetail'>;
type DetailNavProp = NativeStackNavigationProp<RootStackParamList, 'TaskDetail'>;

const TaskDetailScreen = () => {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation<DetailNavProp>();
  const { taskId } = route.params;

  // State
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [attachedFile, setAttachedFile] = useState<{ name: string; uri: string; type?: string } | null>(null);

  // Load task detail
  useEffect(() => {
    loadTaskDetail();
  }, [taskId]);

  const loadTaskDetail = async () => {
    setLoading(true);
    try {
      const data = await getTaskDetail(taskId);
      setTask(data);
      // Pre-fill report content and file if there's a previous submission
      if (data?.submittedReport) {
        setReportContent(data.submittedReport);
      }
      if (data?.submittedLink) {
        // If there's a submitted link from BE, display it as attached file
        setAttachedFile({
          name: 'Tệp đã đính kèm (Nhấn để xem)',
          uri: data.submittedLink,
        });
      }
    } catch (error) {
      console.error('Failed to load task detail:', error);
    } finally {
      setLoading(false);
    }
  };

  // Computed
  const isFormEnabled = task ? canSubmitReport(task.status) : false;
  const showFeedback = task?.status === 'NEEDS_REVISION' && task?.feedback;
  const statusColor = task ? getStatusColor(task.status) : { bg: '#F5F5F5', text: '#616161' };

  // Handlers
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleOpenBrief = useCallback(async (brief: TechnicalBrief) => {
    try {
      const supported = await Linking.canOpenURL(brief.url);
      if (supported) {
        await Linking.openURL(brief.url);
      } else {
        Alert.alert('Không thể mở', `Không thể mở tài liệu: ${brief.name}`);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi mở tài liệu.');
    }
  }, []);

  const handlePickFile = useCallback(async () => {
    if (!isFormEnabled) return;
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setAttachedFile({
          name: file.name,
          uri: file.uri,
          type: file.mimeType || 'application/octet-stream',
        });
      }
    } catch (error) {
      console.error('File pick error:', error);
    }
  }, [isFormEnabled]);

  const handleSubmit = useCallback(async () => {
    if (!task || !isFormEnabled) return;

    if (!reportContent.trim()) {
      Alert.alert('Thiếu nội dung', 'Vui lòng nhập nội dung báo cáo trước khi nộp.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitReport({
        taskId: task.id,
        content: reportContent.trim(),
        attachmentUri: attachedFile?.uri,
        attachmentName: attachedFile?.name,
        attachmentType: attachedFile?.type,
      });

      if (result.success) {
        Alert.alert('Thành công', result.message || 'Báo cáo đã được nộp thành công!');
        navigation.goBack();
      } else {
        Alert.alert('Lỗi', result.message || 'Không thể nộp báo cáo. Vui lòng thử lại.');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi nộp báo cáo.');
    } finally {
      setSubmitting(false);
    }
  }, [task, isFormEnabled, reportContent, attachedFile, navigation]);

  // =========================================================================
  // RENDER
  // =========================================================================

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </SafeAreaView>
    );
  }

  if (!task) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Không tìm thấy task</Text>
          <TouchableOpacity style={styles.backLink} onPress={handleBack}>
            <Text style={styles.backLinkText}>← Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ============================================================= */}
        {/* HEADER */}
        {/* ============================================================= */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>TASK DETAILS</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.headerDivider} />

        {/* ============================================================= */}
        {/* SCROLLABLE CONTENT */}
        {/* ============================================================= */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Task Title */}
          <Text style={styles.taskTitle}>{task.title}</Text>

          {/* Status Badge — chỉ hiện khi không phải IN_PROGRESS */}
          {task.status !== 'IN_PROGRESS' && (
            <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
              <Text style={[styles.statusBadgeText, { color: statusColor.text }]}>
                {getStatusLabel(task.status)}
              </Text>
            </View>
          )}

          {/* Due Date & Assignee */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>DUE DATE</Text>
              <Text style={styles.metaValue}>{task.dueDate}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>ASSIGNEE</Text>
              <Text style={styles.metaValue}>{task.assignee}</Text>
            </View>
          </View>

          {/* Separator */}
          <View style={styles.separator} />

          {/* Description */}
          <Text style={styles.sectionLabel}>DESCRIPTION</Text>
          <Text style={styles.descriptionText}>{task.description}</Text>

          {/* Separator */}
          <View style={styles.separator} />

          {/* Technical Briefs */}
          <Text style={styles.sectionLabel}>TECHNICAL BRIEFS</Text>
          <View style={styles.briefsContainer}>
            {task.technicalBriefs.map((brief) => (
              <TouchableOpacity
                key={brief.id}
                style={styles.briefItem}
                onPress={() => handleOpenBrief(brief)}
                activeOpacity={0.6}
              >
                <View style={styles.briefLeft}>
                  <Ionicons
                    name={getBriefIcon(brief.type)}
                    size={18}
                    color="#555"
                    style={styles.briefIcon}
                  />
                  <Text style={styles.briefName}>{brief.name}</Text>
                </View>
                <Ionicons name="download-outline" size={18} color="#999" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Separator */}
          <View style={styles.separator} />

          {/* =========================================================== */}
          {/* MENTOR FEEDBACK — chỉ hiện khi NEEDS_REVISION */}
          {/* =========================================================== */}
          {showFeedback && (
            <>
              <Text style={styles.sectionLabel}>MENTOR FEEDBACK</Text>
              <View style={styles.feedbackCard}>
                <View style={styles.feedbackHeader}>
                  <Ionicons name="chatbubble-ellipses" size={16} color="#F57F17" />
                  <Text style={styles.feedbackDate}>{task.feedback!.date}</Text>
                </View>
                <Text style={styles.feedbackText}>{task.feedback!.content}</Text>
              </View>
              <View style={styles.separator} />
            </>
          )}

          {/* =========================================================== */}
          {/* SUBMIT REVISION FORM */}
          {/* =========================================================== */}
          <Text style={styles.sectionLabel}>SUBMIT REVISION</Text>

          {/* Text Input */}
          <View style={[styles.inputContainer, !isFormEnabled && styles.inputDisabled]}>
            <TextInput
              style={[styles.textInput, !isFormEnabled && { color: '#000' }]}
              placeholder="Summary of changes..."
              placeholderTextColor="#BBBBBB"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              value={reportContent}
              onChangeText={setReportContent}
              editable={isFormEnabled}
            />

            {/* Add File Row */}
            <View style={styles.addFileRow}>
              <TouchableOpacity
                style={styles.addFileButton}
                onPress={handlePickFile}
                disabled={!isFormEnabled}
                activeOpacity={isFormEnabled ? 0.6 : 1}
              >
                <Ionicons
                  name="attach"
                  size={16}
                  color={isFormEnabled ? '#555' : '#CCC'}
                />
                <Text style={[styles.addFileText, !isFormEnabled && styles.textDisabled]}>
                  ADD FILE
                </Text>
              </TouchableOpacity>
              {attachedFile ? (
                <TouchableOpacity onPress={() => {
                  let urlToOpen = attachedFile.uri;
                  if (urlToOpen.startsWith('/uploads')) {
                    // Import BASE_URL at top or just use similar logic
                    const host = Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001';
                    urlToOpen = `${host}${urlToOpen}`;
                  }
                  Linking.openURL(urlToOpen);
                }}>
                  <Text style={[styles.fileStatus, { color: '#1565C0', textDecorationLine: 'underline' }]}>
                    {attachedFile.name}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={[styles.fileStatus, !isFormEnabled && styles.textDisabled]}>
                  NO FILE SELECTED
                </Text>
              )}
            </View>
          </View>

          {/* Locked Form Notice */}
          {!isFormEnabled && (
            <View style={styles.lockedNotice}>
              <Ionicons name="lock-closed" size={14} color="#999" />
              <Text style={styles.lockedNoticeText}>
                Không thể nộp báo cáo khi task ở trạng thái {getStatusLabel(task.status)}
              </Text>
            </View>
          )}

          {/* Bottom spacing for button */}
          <View style={{ height: 24 }} />
        </ScrollView>

        {/* ============================================================= */}
        {/* SUBMIT BUTTON — fixed at bottom */}
        {/* ============================================================= */}
        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!isFormEnabled || submitting) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!isFormEnabled || submitting}
            activeOpacity={0.8}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <>
                <Text style={[
                  styles.submitButtonText,
                  !isFormEnabled && styles.submitButtonTextDisabled,
                ]}>
                  SUBMIT REPORT
                </Text>
                <Ionicons
                  name="send"
                  size={16}
                  color={isFormEnabled ? '#FFF' : '#999'}
                  style={{ marginLeft: 8 }}
                />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// =============================================================================
// HELPERS
// =============================================================================

function getBriefIcon(type: string): keyof typeof Ionicons.glyphMap {
  switch (type) {
    case 'pdf':
      return 'document-text';
    case 'png':
    case 'jpg':
      return 'image';
    case 'link':
      return 'link';
    default:
      return 'document';
  }
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
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },

  // Loading / Error
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  errorText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 16,
  },
  backLink: {
    padding: 8,
  },
  backLinkText: {
    fontSize: 14,
    color: '#1565C0',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: '#FAFAFA',
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 1.5,
  },
  headerSpacer: {
    flex: 1,
  },
  headerDivider: {
    height: 1,
    backgroundColor: '#EEEEEE',
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 16,
  },

  // Task Title
  taskTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#000',
    lineHeight: 34,
    marginBottom: 20,
  },

  // Status Badge
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 4,
    marginBottom: 20,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Meta (Due Date / Assignee)
  metaRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#999',
    letterSpacing: 1,
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },

  // Section
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#999',
    letterSpacing: 1.2,
    marginBottom: 12,
  },

  // Separator
  separator: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 20,
  },

  // Description
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#444',
  },

  // Technical Briefs
  briefsContainer: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    overflow: 'hidden',
  },
  briefItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  briefLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  briefIcon: {
    marginRight: 12,
  },
  briefName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    letterSpacing: 0.3,
  },

  // Mentor Feedback
  feedbackCard: {
    backgroundColor: '#FFFDE7',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#F57F17',
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  feedbackDate: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
    fontWeight: '500',
  },
  feedbackText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#555',
  },

  // Submit Form
  inputContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFF',
    overflow: 'hidden',
  },
  inputDisabled: {
    backgroundColor: '#F5F5F5',
    opacity: 0.7,
  },
  textInput: {
    padding: 16,
    fontSize: 14,
    color: '#333',
    minHeight: 120,
    lineHeight: 20,
  },
  addFileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  addFileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addFileText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  fileStatus: {
    fontSize: 11,
    color: '#BBB',
    letterSpacing: 0.3,
  },
  textDisabled: {
    color: '#CCC',
  },

  // Locked Notice
  lockedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 4,
  },
  lockedNoticeText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 6,
    flex: 1,
  },

  // Submit Button
  submitContainer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 8 : 16,
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  submitButton: {
    backgroundColor: '#111',
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 1.5,
  },
  submitButtonTextDisabled: {
    color: '#999',
  },
});

export default TaskDetailScreen;
