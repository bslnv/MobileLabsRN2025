import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native'; 
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from 'styled-components/native';
import styled from 'styled-components/native'; 

import { lightTheme } from './theme/light';
import { darkTheme } from './theme/dark';

const ThemedContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  align-items: center;
  justify-content: center;
`;

const ThemedText = styled.Text`
  color: ${({ theme }) => theme.text};
  font-size: 18px;
`;

export default function App() {
  const [currentTheme, setCurrentTheme] = useState('light'); 

  const theme = currentTheme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <ThemedContainer>
        <ThemedText>Steam App Clone with Theming!</ThemedText>
        <ThemedText>(Current theme: {currentTheme})</ThemedText>
        <StatusBar style={currentTheme === 'light' ? 'dark' : 'light'} />
      </ThemedContainer>
    </ThemeProvider>
  );
}