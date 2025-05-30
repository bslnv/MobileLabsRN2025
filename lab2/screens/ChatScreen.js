import React from 'react';
import styled from 'styled-components/native';

const ScreenContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
`;

const ScreenText = styled.Text`
  color: ${({ theme }) => theme.text};
  font-size: 20px;
`;

export default function ChatScreen() {
  return (
    <ScreenContainer>
      <ScreenText>Chat Screen</ScreenText>
    </ScreenContainer>
  );
}