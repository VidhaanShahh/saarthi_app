import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { RootStackParamList, MainTabParamList } from '../types';

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { MyQuestionsScreen } from '../screens/MyQuestionsScreen';
import { SavedScreen } from '../screens/SavedScreen';
import { OfflineHelpScreen } from '../screens/OfflineHelpScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { VoiceInteractionScreen } from '../screens/VoiceInteractionScreen';
import { ConversationDetailScreen } from '../screens/ConversationDetailScreen';
import { ListenAnswerScreen } from '../screens/ListenAnswerScreen';
import { ExplainThisScreen } from '../screens/ExplainThisScreen';
import { HumanHelpScreen } from '../screens/HumanHelpScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.secondary,
        tabBarInactiveTintColor: Colors.outline,
        tabBarStyle: {
          backgroundColor: Colors.surfaceContainerLowest,
          borderTopColor: Colors.outlineVariant,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.3,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MyQuestions"
        component={MyQuestionsScreen}
        options={{
          tabBarLabel: 'Questions',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="message-text" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bookmark" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Offline"
        component={OfflineHelpScreen}
        options={{
          tabBarLabel: 'Offline',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cloud-off-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: Colors.background },
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen
        name="Voice"
        component={VoiceInteractionScreen}
        options={{ presentation: 'modal', gestureDirection: 'vertical' }}
      />
      <Stack.Screen name="ConversationDetail" component={ConversationDetailScreen} />
      <Stack.Screen
        name="ListenAnswer"
        component={ListenAnswerScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="ExplainThis" component={ExplainThisScreen} />
      <Stack.Screen name="HumanHelp" component={HumanHelpScreen} />
    </Stack.Navigator>
  );
}
