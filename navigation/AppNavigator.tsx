import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import DashboardScreen from '../screens/DashboardScreen';
import ReportAccidentScreen from '../screens/ReportAccidentScreen';
import AssistantChatScreen from '../screens/AssistantChatScreen';
import ClaimsTrackingScreen from '../screens/ClaimsTrackingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import UpgradeInsuranceScreen from '../screens/UpgradeInsuranceScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import WebLandingScreen from '../screens/WebLandingScreen';

const RootStack = createStackNavigator();
const HomeStack = createStackNavigator();
const ClaimsStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Dashboard" component={DashboardScreen} />
      <HomeStack.Screen name="AssistantChat" component={AssistantChatScreen} />
      <HomeStack.Screen name="ReportAccident" component={ReportAccidentScreen} />
      <HomeStack.Screen name="UpgradeInsurance" component={UpgradeInsuranceScreen} />
    </HomeStack.Navigator>
  );
}

function ClaimsStackScreen() {
  return (
    <ClaimsStack.Navigator screenOptions={{ headerShown: false }}>
      <ClaimsStack.Screen name="ClaimsTracking" component={ClaimsTrackingScreen} />
    </ClaimsStack.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="UpgradeInsurance" component={UpgradeInsuranceScreen} />
    </ProfileStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#0B1020',
          tabBarInactiveTintColor: '#8F9BB3',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopColor: '#E4E9F2',
            height: 70,
            paddingBottom: 10,
          },
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'home';

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Claims') {
              iconName = 'file-tray-full-outline';
            } else if (route.name === 'Profile') {
              iconName = 'person-circle-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Claims" component={ClaimsStackScreen} />
        <Tab.Screen name="Profile" component={ProfileStackScreen} />
      </Tab.Navigator>
  );
}

const linking = {
  prefixes: [],
  config: {
    screens: {
      Landing: 'acceuil',
      Main: 'app',
      Admin: 'admin',
    },
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer linking={linking}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Landing" component={WebLandingScreen} />
        <RootStack.Screen name="Main" component={MainTabs} />
        <RootStack.Screen name="Admin" component={AdminDashboardScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}