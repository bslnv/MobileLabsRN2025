import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

import GameScreen from './screens/GameScreen';
import TasksScreen from './screens/TasksScreen';
import { GameProvider } from './contexts/GameContext';

const Tab = createBottomTabNavigator(); 

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <GameProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'Game') {
                  iconName = focused ? 'game-controller' : 'game-controller-outline';
                } else if (route.name === 'Tasks') {
                  iconName = focused ? 'list-circle' : 'list-circle-outline';
                }
                // @ts-ignore
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: 'tomato',
              tabBarInactiveTintColor: 'gray',
              headerStyle: {
                backgroundColor: '#f0f0f0',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
              }
            })}
          >
            <Tab.Screen name="Game" component={GameScreen} options={{ title: 'Гра' }} />
            <Tab.Screen name="Tasks" component={TasksScreen} options={{ title: 'Завдання' }} />
          </Tab.Navigator>
        </NavigationContainer>
      </GameProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});