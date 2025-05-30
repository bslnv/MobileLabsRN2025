import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native'; 
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  padding: 10px;
`;

const NewsItem = styled(TouchableOpacity)` 
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 10px;
  flex-direction: row;
`;

const NewsImage = styled(Image)`
  width: 100px;
  height: 60px;
  border-radius: 4px;
  margin-right: 10px;
`;

const NewsContent = styled.View`
  flex: 1;
`;

const NewsTitle = styled.Text`
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
`;

const NewsDescription = styled.Text`
  color: ${({ theme }) => theme.secondaryText};
  font-size: 14px;
`;

const news = [
  { id: '1', title: 'Steam Summer Sale 2025', description: 'Massive discounts on thousands of games!', image: 'https://download.steaminventoryhelper.com/images/csgofast9.png' },
  { id: '2', title: 'New Updates for CS2', description: 'New maps and skins added.', image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/730/header.jpg?t=1745368595' },
  { id: '3', title: 'Dota 2 Patch 7.36', description: 'Balance changes and new hero!', image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/570/header.jpg?t=1745368590' },
  { id: '4', title: 'Steam Awards 2025', description: 'Vote for your favorite games!', image: 'https://download.steaminventoryhelper.com/images/csgofast8.png' },
  { id: '5', title: 'New Indie Game Showcase', description: 'Discover hidden gems.', image: 'https://via.placeholder.com/100x60/FFA07A/000000?text=Indie+Showcase' },
  { id: '6', title: 'VR Gaming Conference', description: 'Latest in VR technology.', image: 'https://via.placeholder.com/100x60/20B2AA/FFFFFF?text=VR+Conf' },
  { id: '7', title: 'E-Sports Tournament Finals', description: 'Watch the pros compete!', image: 'https://via.placeholder.com/100x60/8A2BE2/FFFFFF?text=E-Sports' },
  { id: '8', title: 'Developer Q&A Session', description: 'Ask your favorite devs anything.', image: 'https://via.placeholder.com/100x60/FFD700/000000?text=Dev+Q&A' },
  { id: '9', title: 'Community Art Contest Winners', description: 'Check out the amazing artwork.', image: 'https://via.placeholder.com/100x60/3CB371/FFFFFF?text=Art+Contest' },
  { id: '10', title: 'Steam Deck Updates', description: 'New features and improvements.', image: 'https://via.placeholder.com/100x60/D2691E/FFFFFF?text=Steam+Deck' },
];

const ITEMS_PER_PAGE = 5; 

export default function CommunityScreen() {
  const [displayedNews, setDisplayedNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setDisplayedNews(news.slice(0, ITEMS_PER_PAGE * currentPage));
  }, [currentPage]);

  const loadMoreNews = () => {
    if (loadingMore || displayedNews.length >= news.length) return; 

    setLoadingMore(true);
    setTimeout(() => { 
      setCurrentPage(prevPage => prevPage + 1);
      setLoadingMore(false);
    }, 1000);
  };

  const renderNewsItem = ({ item }) => (
    <NewsItem onPress={() => console.log('News item pressed:', item.title)}>
      <NewsImage source={{ uri: item.image }} />
      <NewsContent>
        <NewsTitle>{item.title}</NewsTitle>
        <NewsDescription numberOfLines={2}>{item.description}</NewsDescription>
      </NewsContent>
    </NewsItem>
  );

  return (
    <Container>
      <FlatList
        data={displayedNews}
        renderItem={renderNewsItem}
        keyExtractor={item => item.id}
        onEndReached={loadMoreNews}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <ActivityIndicator size="large" color={({ theme }) => theme.accent} /> : null}
        contentContainerStyle={{ paddingBottom: 10 }} 
      />
    </Container>
  );
}