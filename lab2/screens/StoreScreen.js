import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import styled from 'styled-components/native';
import GameCard from '../components/GameCard'; 

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  padding: 10px;
`;

const FilterBar = styled.View`
  flex-direction: row;
  justify-content: space-around; 
  margin-bottom: 10px;
  flex-wrap: wrap; 
`;

const FilterButton = styled(TouchableOpacity)`
  background-color: ${({ theme, isActive }) => isActive ? theme.accent : theme.cardBackground};
  padding: 8px 12px; 
  border-radius: 8px;
  margin: 5px; 
`;

const FilterText = styled.Text`
  color: ${({ theme, isActive }) => isActive ? (theme.mode === 'light' ? '#ffffff' : theme.text) : theme.text};
  font-size: 14px;
  font-weight: ${({ isActive }) => isActive ? 'bold' : 'normal'};
`;

const CategoryText = styled.Text`
  color: ${({ theme }) => theme.text}; 
  font-size: 18px; 
  margin: 10px 0 5px 10px; 
  font-weight: bold;
`;

const games = [
  { id: '1', title: 'Counter-Strike 2', price: '$19.99', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg', category: 'Action' },
  { id: '2', title: 'Dota 2', price: 'Free', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg', category: 'MOBA' },
  { id: '3', title: 'Half-Life 2', price: '$9.99', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/220/header.jpg', category: 'FPS' },
  { id: '4', title: 'Team Fortress 2', price: 'Free', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/440/header.jpg', category: 'Action' },
  { id: '5', title: 'Portal 2', price: '$14.99', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/620/header.jpg', category: 'Puzzle' },
  { id: '6', title: 'Left 4 Dead 2', price: '$9.99', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/550/header.jpg', category: 'Action' },
  { id: '7', title: 'The Witcher 3', price: '$39.99', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg', category: 'RPG' },
  { id: '8', title: 'Cyberpunk 2077', price: '$59.99', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg', category: 'RPG' },
  { id: '9', title: 'Stardew Valley', price: '$14.99', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg', category: 'Simulation' },
  { id: '10', title: 'Terraria', price: '$9.99', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/105600/header.jpg', category: 'Adventure' },
];

const ITEMS_PER_PAGE = 6; 
export default function StoreScreen() {
  const [displayedGames, setDisplayedGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  const allCategories = ['All', ...new Set(games.map(game => game.category))];

  useEffect(() => {
    const filtered = activeFilter === 'All' ? games : games.filter(game => game.category === activeFilter);
    setDisplayedGames(filtered.slice(0, ITEMS_PER_PAGE * currentPage));
  }, [activeFilter, currentPage]);


  const loadMoreGames = () => {
    if (loadingMore) return;

    const currentlyFiltered = activeFilter === 'All' ? games : games.filter(game => game.category === activeFilter);
    if (displayedGames.length >= currentlyFiltered.length) return; 

    setLoadingMore(true);
    setTimeout(() => { 
      setCurrentPage(prevPage => prevPage + 1);
      setLoadingMore(false);
    }, 1000);
  };

  const handleFilterChange = (category) => {
    setActiveFilter(category);
    setCurrentPage(1);
  };
  
  const renderGameCard = ({ item }) => (
     <GameCard
         title={item.title}
         price={item.price}
         image={item.image}
         onPress={() => console.log('Game pressed:', item.title)} 
     />
  );

  return (
    <Container>
      <FilterBar>
        {allCategories.map(category => (
          <FilterButton
            key={category}
            onPress={() => handleFilterChange(category)}
            isActive={activeFilter === category}
          >
            <FilterText isActive={activeFilter === category}>{category}</FilterText>
          </FilterButton>
        ))}
      </FilterBar>
      <CategoryText>{activeFilter === 'All' ? 'Featured Games' : `${activeFilter} Games`}</CategoryText>
      <FlatList
        data={displayedGames}
        renderItem={renderGameCard}
        keyExtractor={item => item.id}
        numColumns={2}
        onEndReached={loadMoreGames}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <ActivityIndicator size="large" color="#5c7cfa" /> : null}
        columnWrapperStyle={{ justifyContent: 'space-between' }} 
        contentContainerStyle={{ paddingBottom: 20 }} 
      />
    </Container>
  );
}