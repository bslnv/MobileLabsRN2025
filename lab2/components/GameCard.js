import React from 'react'; 
import styled from 'styled-components/native';
import { Image, TouchableOpacity } from 'react-native';

const Card = styled.View`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  margin: 10px; 
  overflow: hidden;
  width: 45%; 
`;

const ImageWrapper = styled(Image)`
  width: 100%;
  height: 100px;
`;

const Title = styled.Text`
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  padding: 10px 10px 5px 10px; 
  font-weight: bold;
`;

const Price = styled.Text`
  color: ${({ theme }) => theme.accent};
  font-size: 14px;
  padding: 0 10px 10px;
`;

export default function GameCard({ title, price, image, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card>
        <ImageWrapper source={{ uri: image }} />
        <Title numberOfLines={1}>{title}</Title> 
        <Price>{price}</Price>
      </Card>
    </TouchableOpacity>
  );
}