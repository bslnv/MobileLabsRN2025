import React from 'react';
import { View, Image, TouchableOpacity, Text, FlatList, ScrollView } from 'react-native'; 
import styled from 'styled-components/native';

const Container = styled(ScrollView)` 
  flex: 1;
  background-color: ${({ theme }) => theme.background};
`;

const ContentContainer = styled.View`
 padding: 20px;
`;

const Avatar = styled(Image)`
  width: 120px; 
  height: 120px;
  border-radius: 60px; 
  margin-bottom: 20px;
  align-self: center;
  border-width: 3px; 
  border-color: ${({ theme }) => theme.accent};
`;

const Username = styled.Text`
  color: ${({ theme }) => theme.text};
  font-size: 26px; 
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
`;

const SectionTitle = styled.Text`
  color: ${({ theme }) => theme.text};
  font-size: 18px;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 10px;
`;

const StatsContainer = styled.View`
  background-color: ${({ theme }) => theme.cardBackground};
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const StatText = styled.Text`
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  margin-bottom: 5px; 
`;

const AchievementsContainer = styled.View`
  background-color: ${({ theme }) => theme.cardBackground};
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const AchievementItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const AchievementImage = styled(Image)`
  width: 40px;
  height: 40px;
  border-radius: 4px; 
  margin-right: 15px; 
`;

const EditButton = styled(TouchableOpacity)`
  background-color: ${({ theme }) => theme.accent};
  padding: 12px 25px; 
  border-radius: 8px;
  align-self: center;
  margin-bottom: 20px;
`;

const EditButtonText = styled.Text`
  color: #ffffff; 
  font-size: 16px;
  font-weight: bold;
`;

const GameItem = styled(TouchableOpacity)` 
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.cardBackground};
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const GameImage = styled(Image)`
  width: 80px; 
  height: 45px; 
  border-radius: 4px; 
  margin-right: 10px;
`;

const GameTitle = styled.Text`
  color: ${({ theme }) => theme.text};
  font-size: 15px; 
  flex-shrink: 1; 
`;

export default function ProfileScreen() {
  const stats = { hoursPlayed: 1234, level: 42, gamesOwned: 156 };
  const achievements = [
    { id: '1', name: 'First Win in CS2', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg' }, 
    { id: '2', name: 'Reached Level 10 in Dota', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg' },
    { id: '3', name: 'Completed Portal 2', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/620/header.jpg' },
  ];
  const ownedGames = [
    { id: '1', title: 'Counter-Strike 2', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg' },
    { id: '2', title: 'Dota 2', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg' },
    { id: '3', title: 'Half-Life 2', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/220/header.jpg' },
    { id: '4', title: 'Portal 2', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/620/header.jpg' },
    { id: '5', title: 'The Witcher 3: Wild Hunt', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg' },
  ];
  
  const renderAchievementItem = ({ item }) => (
     <AchievementItem>
         <AchievementImage source={{ uri: item.image }} />
         <StatText>{item.name}</StatText>
     </AchievementItem>
  );

  const renderGameItem = ({ item }) => (
     <GameItem onPress={() => console.log('Game pressed:', item.title)}>
         <GameImage source={{ uri: item.image }} />
         <GameTitle>{item.title}</GameTitle>
     </GameItem>
  );

  return (
    <Container contentContainerStyle={{ paddingBottom: 20 }}>
     <ContentContainer>
      <Avatar source={{ uri: 'https://i.pinimg.com/736x/11/1f/b2/111fb2625c56e6506d4186e43d3032f9.jpg' }} /> 
      <Username>bodya1332</Username>
      
      <EditButton onPress={() => console.log('Edit Profile pressed')}>
        <EditButtonText>Edit Profile</EditButtonText>
      </EditButton>

      <SectionTitle>Statistics</SectionTitle>
      <StatsContainer>
        <StatText>Hours Played: {stats.hoursPlayed}</StatText>
        <StatText>Steam Level: {stats.level}</StatText>
        <StatText>Games Owned: {stats.gamesOwned}</StatText>
      </StatsContainer>

      <SectionTitle>Recent Achievements</SectionTitle>
      <AchievementsContainer>
        <FlatList
          data={achievements}
          renderItem={renderAchievementItem}
          keyExtractor={item => item.id}
          scrollEnabled={false} 
        />
      </AchievementsContainer>
      
      <SectionTitle>Owned Games</SectionTitle>
      <FlatList 
        data={ownedGames}
        renderItem={renderGameItem}
        keyExtractor={item => item.id}
        scrollEnabled={false} 
      />
     </ContentContainer>
    </Container>
  );
}