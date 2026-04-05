import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { useSubscription } from '../../contexts/SubscriptionContext';

function TabIcon({ name, focused, locked }: { name: string; focused: boolean; locked?: boolean }) {
  const icons: { [key: string]: string } = {
    dashboard: '📊',
    goals: '🎯',
    chat: '💬',
    settings: '⚙️',
  };

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <Text style={{ fontSize: 24 }}>{icons[name]}</Text>
      {locked && (
        <View style={{
          position: 'absolute',
          top: -4,
          right: -4,
          backgroundColor: '#EF4444',
          borderRadius: 8,
          width: 16,
          height: 16,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Text style={{ fontSize: 10, color: '#FFFFFF' }}>🔒</Text>
        </View>
      )}
    </View>
  );
}

export default function TabLayout() {
  const { isPremium, upgradeToPremium } = useSubscription();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleUpgrade = async () => {
    try {
      await upgradeToPremium();
      setShowUpgradeModal(false);
      Alert.alert('Success', 'You now have access to all premium features!');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to upgrade. Please try again.');
    }
  };

  return (
    <>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 8,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused }) => <TabIcon name="dashboard" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Goals',
          tabBarIcon: ({ focused }) => <TabIcon name="goals" focused={focused} locked={!isPremium} />,
        }}
        listeners={{
          tabPress: (e) => {
            if (!isPremium) {
              e.preventDefault();
              setShowUpgradeModal(true);
            }
          },
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Coach',
          tabBarIcon: ({ focused }) => <TabIcon name="chat" focused={focused} locked={!isPremium} />,
        }}
        listeners={{
          tabPress: (e) => {
            if (!isPremium) {
              e.preventDefault();
              setShowUpgradeModal(true);
            }
          },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => <TabIcon name="settings" focused={focused} />,
        }}
      />
    </Tabs>

    <Modal
      visible={showUpgradeModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowUpgradeModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Upgrade to Premium</Text>
            <TouchableOpacity onPress={() => setShowUpgradeModal(false)}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Text style={styles.upgradeIcon}>🔒</Text>
            <Text style={styles.upgradePrice}>$9.99</Text>
            <Text style={styles.upgradePriceSubtitle}>One-time payment</Text>

            <Text style={styles.featureTitle}>Unlock Premium Features:</Text>

            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Text style={styles.featureCheckPremium}>✓</Text>
                <Text style={styles.featureTextPremium}>Goal Setting & Tracking</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureCheckPremium}>✓</Text>
                <Text style={styles.featureTextPremium}>AI Life Coach Chat</Text>
              </View>
            </View>

            <Text style={styles.upgradeNote}>
              Unlock all features with a single payment. No subscriptions, no recurring charges.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.modalButton}
            onPress={handleUpgrade}
          >
            <LinearGradient colors={['#8B5CF6', '#EC4899']} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Upgrade Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalClose: {
    fontSize: 24,
    color: '#9CA3AF',
    fontWeight: '300',
  },
  modalBody: {
    padding: 24,
    alignItems: 'center',
  },
  upgradeIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  upgradePrice: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  upgradePriceSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  featuresList: {
    width: '100%',
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureCheckPremium: {
    fontSize: 20,
    color: '#8B5CF6',
    marginRight: 12,
    width: 24,
  },
  featureTextPremium: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
    flex: 1,
  },
  upgradeNote: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalButton: {
    marginHorizontal: 24,
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
