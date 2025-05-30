import React, { useState, useEffect } from 'react';
import { View, Switch, Text } from 'react-native'; 
import styled from 'styled-components/native';

const Container = styled.ScrollView` 
  flex: 1;
  background-color: ${({ theme }) => theme.background};
`;

const ContentContainer = styled.View`
 padding: 20px;
`;

const ScreenTitle = styled.Text` 
  color: ${({ theme }) => theme.text};
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const SettingItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  margin-bottom: 10px;
`;

const SettingText = styled.Text`
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  flex-shrink: 1; 
  margin-right: 10px; 
`;

const AuthenticatorContainer = styled.View`
  background-color: ${({ theme }) => theme.cardBackground};
  padding: 20px; /* Збільшив padding */
  border-radius: 8px;
  margin-top: 20px;
  align-items: center;
`;

const AuthCode = styled.Text`
  color: ${({ theme }) => theme.accent};
  font-size: 36px; 
  font-weight: bold;
  letter-spacing: 5px; 
  margin-bottom: 10px; 
`;

const Timer = styled.Text`
  color: ${({ theme }) => theme.secondaryText};
  font-size: 14px;
  margin-top: 5px;
`;

export default function SafetyScreen() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [authCode, setAuthCode] = useState(''); 
  const [secondsLeft, setSecondsLeft] = useState(0); 

  function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  useEffect(() => {
    let interval;
    if (twoFactorEnabled) {
      setAuthCode(generateCode()); 
      setSecondsLeft(30);
      interval = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev === 1) {
            setAuthCode(generateCode());
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setAuthCode(''); 
      setSecondsLeft(0);
    }

    return () => clearInterval(interval); 
  }, [twoFactorEnabled]); 

  return (
    <Container contentContainerStyle={{ paddingBottom: 20 }}>
     <ContentContainer>
      <ScreenTitle>Safety Settings</ScreenTitle>
      <SettingItem>
        <SettingText>Two-Factor Authentication</SettingText>
        <Switch
          value={twoFactorEnabled}
          onValueChange={setTwoFactorEnabled}
          trackColor={{ false: '#767577', true: ({ theme }) => theme.accent }} 
          thumbColor={twoFactorEnabled ? '#ffffff' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e" 
        />
      </SettingItem>
      <SettingItem>
        <SettingText>Suspicious Activity Alerts</SettingText>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: '#767577', true: ({ theme }) => theme.accent }} 
          thumbColor={notificationsEnabled ? '#ffffff' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
        />
      </SettingItem>
      {twoFactorEnabled && (
        <AuthenticatorContainer>
          <AuthCode>{authCode}</AuthCode>
          <Timer>Code expires in {secondsLeft} seconds</Timer>
        </AuthenticatorContainer>
      )}
     </ContentContainer>
    </Container>
  );
}