import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

export default function GoalsScreen() {
  const [goals, setGoals] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error: any) {
      console.error('Error loading goals:', error);
    }
  };

  const handleAddGoal = async () => {
    if (!newGoalTitle.trim()) {
      Alert.alert('Error', 'Please enter a goal title');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('goals')
        .insert([
          {
            user_id: user.id,
            title: newGoalTitle.trim(),
            description: newGoalDescription.trim(),
            type: 'progress',
            current: 0,
            target: 100,
            status: 'active',
          },
        ]);

      if (error) throw error;

      setNewGoalTitle('');
      setNewGoalDescription('');
      setShowAddModal(false);
      await loadGoals();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add goal');
    } finally {
      setLoading(false);
    }
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
            await loadGoals();
          } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to delete goal');
          }
        },
      },
    ]);
  };

  const handleUpdateProgress = async (goal: any, increment: number) => {
    try {
      const newCurrent = Math.max(0, Math.min(goal.target, goal.current + increment));
      const { error } = await supabase
        .from('goals')
        .update({ current: newCurrent })
        .eq('id', goal.id);

      if (error) throw error;
      await loadGoals();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update progress');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient colors={['#E0E7FF', '#FECDD3']} style={styles.gradient}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Goals</Text>
            <Text style={styles.subtitle}>Track your progress</Text>
          </View>
          <TouchableOpacity onPress={() => setShowAddModal(true)} style={styles.addButton}>
            <Text style={styles.addIcon}>+</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {goals.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🎯</Text>
              <Text style={styles.emptyText}>No goals yet</Text>
              <Text style={styles.emptySubtext}>Create your first goal above</Text>
            </View>
          ) : (
            goals.map((goal) => {
              const progress = (goal.current / goal.target) * 100;
              return (
                <View key={goal.id} style={styles.card}>
                  <Text style={styles.cardTitle}>{goal.title}</Text>
                  {goal.description ? (
                    <Text style={styles.cardDescription}>{goal.description}</Text>
                  ) : null}

                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${progress}%` }]} />
                    </View>
                    <Text style={styles.progressText}>
                      {goal.current}/{goal.target} ({Math.round(progress)}%)
                    </Text>
                  </View>

                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleUpdateProgress(goal, -1)}
                    >
                      <Text style={styles.actionButtonText}>-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleUpdateProgress(goal, 1)}
                    >
                      <Text style={styles.actionButtonText}>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteGoal(goal.id)}>
                      <Text style={styles.deleteIcon}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        <Modal
          visible={showAddModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowAddModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>New Goal</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                  style={styles.input}
                  value={newGoalTitle}
                  onChangeText={setNewGoalTitle}
                  placeholder="Enter goal title"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description (optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newGoalDescription}
                  onChangeText={setNewGoalDescription}
                  placeholder="Enter description"
                  multiline
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButtonCancel}
                  onPress={() => {
                    setShowAddModal(false);
                    setNewGoalTitle('');
                    setNewGoalDescription('');
                  }}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButtonConfirm}
                  onPress={handleAddGoal}
                  disabled={loading}
                >
                  <LinearGradient colors={['#8B5CF6', '#EC4899']} style={styles.buttonGradient}>
                    <Text style={styles.buttonText}>
                      {loading ? 'Adding...' : 'Add Goal'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    fontSize: 28,
    color: '#8B5CF6',
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#6B7280',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  deleteIcon: {
    fontSize: 20,
    marginLeft: 'auto',
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
    height: 80,
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
