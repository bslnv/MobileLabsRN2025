import React, { useState, useEffect } from 'react'; 
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from 'styled-components/native';
import styled from 'styled-components/native'; 
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

import { lightTheme } from './theme/light';
import { darkTheme } from './theme/dark';

import StoreScreen from './screens/StoreScreen';
import CommunityScreen from './screens/CommunityScreen';
import ChatScreen from './screens/ChatScreen';
import SafetyScreen from './screens/SafetyScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const FooterContainer = styled.View`
  background-color: ${({ theme }) => theme.cardBackground};
  padding: 10px;
  align-items: center;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.mode === 'light' ? '#E0E0E0' : '#3a576e'};
`;

const FooterText = styled.Text`
  color: ${({ theme }) => theme.text};
  font-size: 12px;
`;


export default function App() {
  const [currentThemeMode, setCurrentThemeMode] = useState('light'); 

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('@theme');
      if (savedTheme !== null) {
        setCurrentThemeMode(savedTheme);
      }
    } catch (error) {
      console.error('Failed to load theme from storage', error);
    }
  };

  const toggleTheme = async () => {
    const newThemeMode = currentThemeMode === 'light' ? 'dark' : 'light';
    setCurrentThemeMode(newThemeMode);
    try {
      await AsyncStorage.setItem('@theme', newThemeMode);
    } catch (error) {
      console.error('Failed to save theme to storage', error);
    }
  };

  const appTheme = currentThemeMode === 'light' ? { ...lightTheme, mode: 'light' } : { ...darkTheme, mode: 'dark' };

  const navigationThemeConfig = currentThemeMode === 'light' ?
    {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: appTheme.background,
        card: appTheme.cardBackground,
        text: appTheme.text,
        primary: appTheme.accent,
      },
    } :
    {
      ...DarkTheme,
      colors: {
        ...DarkTheme.colors,
        background: appTheme.background,
        card: appTheme.cardBackground,
        text: appTheme.text,
        primary: appTheme.accent,
      },
    };

  return (
    <ThemeProvider theme={appTheme}>
      <NavigationContainer theme={navigationThemeConfig}>
        <StatusBar style={currentThemeMode === 'light' ? 'dark' : 'light'} />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Store') iconName = focused ? 'storefront' : 'storefront-outline';
              else if (route.name === 'Community') iconName = focused ? 'people' : 'people-outline';
              else if (route.name === 'Chat') iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              else if (route.name === 'Safety') iconName = focused ? 'shield-checkmark' : 'shield-outline';
              else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
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
            headerRight: () => ( 
              <Ionicons
                name={currentThemeMode === 'light' ? "moon" : "sunny"}
                size={24}
                color={appTheme.text}
                style={{ marginRight: 15 }}
                onPress={toggleTheme}
              />
            ),
          })}
        >
          <Tab.Screen name="Store" component={StoreScreen} />
          <Tab.Screen name="Community" component={CommunityScreen} />
          <Tab.Screen name="Chat" component={ChatScreen} />
          <Tab.Screen name="Safety" component={SafetyScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
        <FooterContainer>
          <FooterText>Steam App © 2025</FooterText>
        </FooterContainer>
      </NavigationContainer>
    </ThemeProvider>
  );
}