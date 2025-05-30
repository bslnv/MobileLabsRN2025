import React from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';

export default function GalleryScreen() {
  const data = [
    'https://www.k1.ua/uploads/assets/images/ajnjghb1.jpg',
    'https://www.k1.ua/uploads/assets/images/ajnjghb1.jpg',
    'https://www.k1.ua/uploads/assets/images/ajnjghb1.jpg',
    'https://www.k1.ua/uploads/assets/images/ajnjghb1.jpg',
    'https://www.k1.ua/uploads/assets/images/ajnjghb1.jpg',
    'https://www.k1.ua/uploads/assets/images/ajnjghb1.jpg',
    'https://www.k1.ua/uploads/assets/images/ajnjghb1.jpg',
    'https://www.k1.ua/uploads/assets/images/ajnjghb1.jpg',
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  image: {
    flex: 1,
    margin: 5,
    height: 150,
    borderRadius: 10,
  },
});