import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import FilesScreen from './src/screens/FilesScreen';
import FileManagerScreen from './src/screens/FileManagerScreen';
import FileViewerScreen from './src/screens/FileViewerScreen';

import { theme } from './src/styles/theme';

const Tab = createBottomTabNavigator();
const FilesStack = createNativeStackNavigator();

function FilesStackNavigator() {
  return (
    <FilesStack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: theme.typography.h3,
        },
      }}
    >
      <FilesStack.Screen
        name="FilesMain"
        component={FilesScreen}
        options={{ title: 'Файли' }}
      />
      <FilesStack.Screen
        name="FileManager"
        component={FileManagerScreen}
      />
      <FilesStack.Screen
        name="FileViewer"
        component={FileViewerScreen}
      />
    </FilesStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Головна') {
              return <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />;
            } else if (route.name === 'Файли') {
              return <MaterialIcons name='folder' size={size} color={color} />;
            }
            return null;
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.borderColor,
          },
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: theme.typography.h3,
          },
        })}
      >
        <Tab.Screen
          name="Головна"
          component={HomeScreen}
        />
        <Tab.Screen
          name="Файли"
          component={FilesStackNavigator}
          options={{
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}