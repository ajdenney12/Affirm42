import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

interface ThemeGroup {
  theme: string;
  icon: string;
  gradient: string[];
  affirmations: any[];
  goals: any[];
}

export default function DashboardScreen() {
  const [affirmations, setAffirmations] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [dailyAffirmation, setDailyAffirmation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<'affirmation' | 'goal' | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [affirmationsResult, goalsResult] = await Promise.all([
        supabase
          .from('affirmations')
          .select('*')
          .eq('user_id', user.id)
          .order('timestamp', { ascending: false }),
        supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
      ]);

      if (affirmationsResult.error) throw affirmationsResult.error;
      if (goalsResult.error) throw goalsResult.error;

      setAffirmations(affirmationsResult.data || []);
      setGoals(goalsResult.data || []);

      if (affirmationsResult.data && affirmationsResult.data.length > 0) {
        const randomIndex = Math.floor(Math.random() * affirmationsResult.data.length);
        setDailyAffirmation(affirmationsResult.data[randomIndex]);
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAffirmation = async (id: string) => {
    Alert.alert('Delete Affirmation', 'Are you sure you want to delete this affirmation?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const { error } = await supabase.from('affirmations').delete().eq('id', id);
            if (error) throw error;
            await loadData();
          } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to delete affirmation');
          }
        },
      },
    ]);
  };

  const handleDeleteGoal = async (id: string) => {
    Alert.alert('Delete Goal', 'Are you sure you want to delete this goal?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const { error } = await supabase.from('goals').delete().eq('id', id);
            if (error) throw error;
            await loadData();
          } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to delete goal');
          }
        },
      },
    ]);
  };

  const handleEditAffirmation = (affirmation: any) => {
    setEditingItem(affirmation);
    setEditingType('affirmation');
    setEditText(affirmation.text);
    setEditModalVisible(true);
  };

  const handleEditGoal = (goal: any) => {
    setEditingItem(goal);
    setEditingType('goal');
    setEditText(goal.title);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editText.trim()) {
      Alert.alert('Error', 'Please enter some text');
      return;
    }

    try {
      if (editingType === 'affirmation') {
        const { error } = await supabase
          .from('affirmations')
          .update({ text: editText.trim() })
          .eq('id', editingItem.id);
        if (error) throw error;
      } else if (editingType === 'goal') {
        const { error } = await supabase
          .from('goals')
          .update({ title: editText.trim() })
          .eq('id', editingItem.id);
        if (error) throw error;
      }

      setEditModalVisible(false);
      setEditingItem(null);
      setEditingType(null);
      setEditText('');
      await loadData();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save changes');
    }
  };

  const categorizeByTheme = (): ThemeGroup[] => {
    const themeKeywords = {
      confidence: {
        keywords: ['confidence', 'confident', 'believe', 'capable', 'strong', 'power', 'overcome', 'fear', 'courage', 'brave', 'speaking', 'presentation'],
        icon: '💪',
        gradient: ['#FF6B6B', '#FF8E53'],
      },
      growth: {
        keywords: ['learn', 'grow', 'develop', 'improve', 'progress', 'skill', 'knowledge', 'study', 'education', 'practice'],
        icon: '🌱',
        gradient: ['#4ECDC4', '#44A08D'],
      },
      wellness: {
        keywords: ['health', 'fitness', 'exercise', 'workout', 'run', 'body', 'nutrition', 'wellbeing', 'energy', 'strength'],
        icon: '🧘',
        gradient: ['#A8E6CF', '#56AB91'],
      },
      career: {
        keywords: ['career', 'work', 'job', 'business', 'professional', 'success', 'achieve', 'goal', 'startup', 'entrepreneur'],
        icon: '💼',
        gradient: ['#667EEA', '#764BA2'],
      },
      creativity: {
        keywords: ['creative', 'art', 'music', 'write', 'writing', 'paint', 'design', 'express', 'imagination', 'inspire'],
        icon: '🎨',
        gradient: ['#F093FB', '#F5576C'],
      },
      relationships: {
        keywords: ['relationship', 'friend', 'family', 'love', 'connection', 'communicate', 'social', 'people', 'community'],
        icon: '❤️',
        gradient: ['#FA709A', '#FEE140'],
      },
      mindfulness: {
        keywords: ['peace', 'calm', 'meditate', 'mindful', 'present', 'grateful', 'gratitude', 'awareness', 'focus', 'clarity'],
        icon: '🧠',
        gradient: ['#89F7FE', '#66A6FF'],
      },
    };

    const groups: { [key: string]: ThemeGroup } = {};

    [...affirmations, ...goals].forEach((item) => {
      const text = (item.text || item.title || '' + ' ' + (item.description || '')).toLowerCase();

      for (const [themeName, themeData] of Object.entries(themeKeywords)) {
        if (themeData.keywords.some(keyword => text.includes(keyword))) {
          if (!groups[themeName]) {
            groups[themeName] = {
              theme: themeName.charAt(0).toUpperCase() + themeName.slice(1),
              icon: themeData.icon,
              gradient: themeData.gradient,
              affirmations: [],
              goals: [],
            };
          }

          if (item.text) {
            groups[themeName].affirmations.push(item);
          } else {
            groups[themeName].goals.push(item);
          }
          break;
        }
      }
    });

    return Object.values(groups).filter(group => group.affirmations.length > 0 || group.goals.length > 0);
  };

  const themeGroups = categorizeByTheme();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient colors={['#E0E7FF', '#FECDD3']} style={styles.gradient}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>NextSelf</Text>
            <Text style={styles.subtitle}>Your Personal Dashboard</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {dailyAffirmation && (
            <View style={styles.dailyAffirmationContainer}>
              <Text style={styles.dailyAffirmationLabel}>Daily Affirmation</Text>
              <LinearGradient
                colors={['#8B5CF6', '#EC4899']}
                style={styles.dailyAffirmationCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.dailyAffirmationText}>{dailyAffirmation.text}</Text>
              </LinearGradient>
            </View>
          )}

          {themeGroups.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>✨</Text>
              <Text style={styles.emptyText}>Start Your Journey</Text>
              <Text style={styles.emptySubtext}>
                Chat with the AI coach to create affirmations and goals
              </Text>
            </View>
          ) : (
            themeGroups.map((group, index) => (
              <View key={index} style={styles.themeSection}>
                <View style={styles.themeTitleRow}>
                  <Text style={styles.themeIcon}>{group.icon}</Text>
                  <Text style={styles.themeTitle}>{group.theme}</Text>
                </View>

                {group.affirmations.length > 0 && (
                  <View style={styles.itemsContainer}>
                    {group.affirmations.map((affirmation) => (
                      <LinearGradient
                        key={affirmation.id}
                        colors={group.gradient}
                        style={styles.itemCard}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <View style={styles.itemHeader}>
                          <Text style={styles.itemLabel}>AFFIRMATION</Text>
                          <View style={styles.itemActions}>
                            <TouchableOpacity
                              onPress={() => handleEditAffirmation(affirmation)}
                              style={styles.actionIcon}
                            >
                              <Text style={styles.actionIconText}>✏️</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => handleDeleteAffirmation(affirmation.id)}
                              style={styles.actionIcon}
                            >
                              <Text style={styles.actionIconText}>🗑️</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        <Text style={styles.itemText}>{affirmation.text}</Text>
                      </LinearGradient>
                    ))}
                  </View>
                )}

                {group.goals.length > 0 && (
                  <View style={styles.itemsContainer}>
                    {group.goals.map((goal) => {
                      const progress = (goal.current / goal.target) * 100;
                      return (
                        <LinearGradient
                          key={goal.id}
                          colors={group.gradient}
                          style={styles.itemCard}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          <View style={styles.itemHeader}>
                            <View style={styles.goalHeaderLeft}>
                              <Text style={styles.itemLabel}>GOAL</Text>
                              <Text style={styles.goalProgress}>
                                {Math.round(progress)}%
                              </Text>
                            </View>
                            <View style={styles.itemActions}>
                              <TouchableOpacity
                                onPress={() => handleEditGoal(goal)}
                                style={styles.actionIcon}
                              >
                                <Text style={styles.actionIconText}>✏️</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => handleDeleteGoal(goal.id)}
                                style={styles.actionIcon}
                              >
                                <Text style={styles.actionIconText}>🗑️</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                          <Text style={styles.itemTitle}>{goal.title}</Text>
                          {goal.description && (
                            <Text style={styles.itemDescription}>{goal.description}</Text>
                          )}
                          <View style={styles.progressBarContainer}>
                            <View style={styles.progressBarBackground}>
                              <View
                                style={[
                                  styles.progressBarFill,
                                  { width: `${progress}%` },
                                ]}
                              />
                            </View>
                          </View>
                        </LinearGradient>
                      );
                    })}
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>

        <Modal
          visible={editModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setEditModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalOverlay}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={styles.modalOverlay}
              onPress={() => setEditModalVisible(false)}
            >
              <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>
                    Edit {editingType === 'affirmation' ? 'Affirmation' : 'Goal'}
                  </Text>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                      {editingType === 'affirmation' ? 'Affirmation Text' : 'Goal Title'}
                    </Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      value={editText}
                      onChangeText={setEditText}
                      placeholder={`Enter ${editingType === 'affirmation' ? 'affirmation' : 'goal title'}`}
                      multiline
                      maxLength={500}
                    />
                  </View>

                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={styles.modalButtonCancel}
                      onPress={() => {
                        setEditModalVisible(false);
                        setEditingItem(null);
                        setEditingType(null);
                        setEditText('');
                      }}
                    >
                      <Text style={styles.modalButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.modalButtonConfirm}
                      onPress={handleSaveEdit}
                    >
                      <LinearGradient colors={['#8B5CF6', '#EC4899']} style={styles.buttonGradient}>
                        <Text style={styles.buttonText}>Save</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  dailyAffirmationContainer: {
    marginBottom: 24,
  },
  dailyAffirmationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  dailyAffirmationCard: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  dailyAffirmationText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#8B5CF6',
    lineHeight: 34,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 72,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  themeSection: {
    marginBottom: 32,
  },
  themeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  themeIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  themeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  itemsContainer: {
    gap: 12,
  },
  itemCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1.5,
  },
  goalProgress: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  itemText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#8B5CF6',
    lineHeight: 28,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    marginBottom: 12,
  },
  progressBarContainer: {
    marginTop: 12,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionIcon: {
    padding: 4,
  },
  actionIconText: {
    fontSize: 16,
  },
  goalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButtonCancel: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  modalButtonConfirm: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
