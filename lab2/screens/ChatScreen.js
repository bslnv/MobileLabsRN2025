import React from 'react';
import { View, FlatList, Image } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  padding: 10px;
`;

const ChatItem = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.cardBackground};
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const Avatar = styled(Image)`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 10px;
`;

const ChatContent = styled.View`
  flex: 1;
`;

const ChatName = styled.Text`
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  font-weight: bold;
`;

const LastMessage = styled.Text`
  color: ${({ theme }) => theme.secondaryText};
  font-size: 14px;
`;

const chats = [
  { id: '1', name: 'CS2 Community', lastMessage: 'Hey, anyone up for a match?', avatar: 'https://cdn.fastly.steamstatic.com/steamcommunity/public/images/apps/730/8dbc71957312bbd3baea65848b545be9eae2a355.jpg' },
  { id: '2', name: 'Dota 2 Fans', lastMessage: 'New patch is out!', avatar: 'https://cdn.fastly.steamstatic.com/steamcommunity/public/images/apps/570/0bbb630d63262dd66d2fdd0f7d37e8661a410075.jpg' },
  { id: '3', name: 'Steam Group', lastMessage: 'Join our event!', avatar: 'https://community.fastly.steamstatic.com/public/shared/images/header/logo_steam.svg?t=962016' },
];

export default function ChatScreen() {
  return (
    <Container>
      <FlatList
        data={chats}
        renderItem={({ item }) => (
          <ChatItem>
            <Avatar source={{ uri: item.avatar }} />
            <ChatContent>
              <ChatName>{item.name}</ChatName>
              <LastMessage>{item.lastMessage}</LastMessage>
            </ChatContent>
          </ChatItem>
        )}
        keyExtractor={item => item.id}
      />
    </Container>
  );
}