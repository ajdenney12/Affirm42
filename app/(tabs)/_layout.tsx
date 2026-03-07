import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: { [key: string]: string } = {
    affirmations: '⭐',
    goals: '🎯',
    chat: '💬',
  };

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24 }}>{icons[name]}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
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
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Affirmations',
          tabBarIcon: ({ focused }) => <TabIcon name="affirmations" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Goals',
          tabBarIcon: ({ focused }) => <TabIcon name="goals" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Coach',
          tabBarIcon: ({ focused }) => <TabIcon name="chat" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
