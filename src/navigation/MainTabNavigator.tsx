import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { colors } from '../styles';
import HomeScreen from '../screens/main/HomeScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import { ScanScreen, CollecteScreen, ConseilsScreen } from '../screens/recycling';

const Tab = createBottomTabNavigator();

// Composants d'icônes avec des emojis appropriés
const ScanIcon = ({ color, size }: { color: string; size: number }) => (
  <Text style={{ fontSize: size, color }}>📱</Text>
);

const CollecteIcon = ({ color, size }: { color: string; size: number }) => (
  <Text style={{ fontSize: size, color }}>♻️</Text>
);

const ProfileIcon = ({ color, size }: { color: string; size: number }) => (
  <Text style={{ fontSize: size, color }}>👤</Text>
);

const ConseilsIcon = ({ color, size }: { color: string; size: number }) => (
  <Text style={{ fontSize: size, color }}>💡</Text>
);

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          tabBarLabel: 'Scan',
          tabBarIcon: ScanIcon,
        }}
      />
      <Tab.Screen
        name="Collecte"
        component={CollecteScreen}
        options={{
          tabBarLabel: 'Collecte',
          tabBarIcon: CollecteIcon,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ProfileIcon,
        }}
      />
      <Tab.Screen
        name="Conseils"
        component={ConseilsScreen}
        options={{
          tabBarLabel: 'Conseils',
          tabBarIcon: ConseilsIcon,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
