import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NewsScreen from './screens/NewsScreen';
import GalleryScreen from './screens/GalleryScreen';
import RegisterScreen from './screens/RegisterScreen';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Image } from 'react-native';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Image
          source={{ uri: 'https://ztu.edu.ua/img/logo/university-colored.png' }}
          style={styles.logo}
        />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === 'Новини') {
                iconName = 'home';
              } else if (route.name === 'Галерея') {
                iconName = 'images';
              }else if (route.name === 'Реєстрація') {
                iconName = 'person';
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="Новини" component={NewsScreen} />
          <Tab.Screen name="Галерея" component={GalleryScreen} />
          <Tab.Screen name="Реєстрація" component={RegisterScreen} />
        </Tab.Navigator>
        <Text style={styles.footerText}>
          Слинюк Богдан Вадимович ІПЗ-21-5
        </Text>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    padding: 10,
  },
});