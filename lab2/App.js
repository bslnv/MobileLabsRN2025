import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from 'styled-components/native';

import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { lightTheme } from './theme/light';
import { darkTheme } from './theme/dark';

import StoreScreen from './screens/StoreScreen';
import CommunityScreen from './screens/CommunityScreen';
import ChatScreen from './screens/ChatScreen';
import SafetyScreen from './screens/SafetyScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [currentThemeMode, setCurrentThemeMode] = useState('light'); 

  const appTheme = currentThemeMode === 'light' ? lightTheme : darkTheme;

  const navigationTheme = currentThemeMode === 'light' ?
    {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: lightTheme.background,
        card: lightTheme.cardBackground,
        text: lightTheme.text,
      },
    } :
    {
      ...DarkTheme,
      colors: {
        ...DarkTheme.colors,
        background: darkTheme.background,
        card: darkTheme.cardBackground,
        text: darkTheme.text,
      },
    };

  return (
    <ThemeProvider theme={appTheme}>
      <NavigationContainer theme={navigationTheme}>
        <StatusBar style={currentThemeMode === 'light' ? 'dark' : 'light'} />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Store') {
                iconName = focused ? 'storefront' : 'storefront-outline';
              } else if (route.name === 'Community') {
                iconName = focused ? 'people' : 'people-outline';
              } else if (route.name === 'Chat') {
                iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              } else if (route.name === 'Safety') {
                iconName = focused ? 'shield-checkmark' : 'shield-outline';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'person' : 'person-outline';
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: appTheme.accent,
            tabBarInactiveTintColor: currentThemeMode === 'light' ? 'gray' : appTheme.secondaryText,
            tabBarStyle: {
              backgroundColor: appTheme.cardBackground,
              borderTopColor: currentThemeMode === 'light' ? '#E0E0E0' : '#3a576e' 
            },
            headerStyle: {
              backgroundColor: appTheme.cardBackground,
            },
            headerTintColor: appTheme.text,
          })}
        >
          <Tab.Screen name="Store" component={StoreScreen} />
          <Tab.Screen name="Community" component={CommunityScreen} />
          <Tab.Screen name="Chat" component={ChatScreen} />
          <Tab.Screen name="Safety" component={SafetyScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}