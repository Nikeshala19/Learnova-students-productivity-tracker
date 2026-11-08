import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../screens/DashboardScreen';
import TasksScreen from '../screens/TasksScreen';
import GoalsScreen from '../screens/GoalsScreen';
import FocusScreen from '../screens/FocusScreen';
import ProgressScreen from '../screens/ProgressScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

const icons = {
  Home: ['home-outline', 'home'],
  Tasks: ['checkbox-outline', 'checkbox'],
  Goals: ['flag-outline', 'flag'],
  Focus: ['timer-outline', 'timer'],
  Progress: ['bar-chart-outline', 'bar-chart'],
};

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingTop: 8,
          paddingBottom: 5,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={icons[route.name][focused ? 1 : 0]}
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen name="Goals" component={GoalsScreen} />
      <Tab.Screen name="Focus" component={FocusScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
    </Tab.Navigator>
  );
}
