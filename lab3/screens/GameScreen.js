import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  TapGestureHandler,
  LongPressGestureHandler,
  State,
} from 'react-native-gesture-handler';

const SINGLE_TAP_POINTS = 1;
const DOUBLE_TAP_POINTS = 2; // "Подвійна кількість очок" порівняно з базовим одиночним
const LONG_PRESS_POINTS = 5;
const LONG_PRESS_DURATION_MS = 500; // Тривалість довгого натискання для бонусних очок

export default function GameScreen() {
  const [score, setScore] = useState(0);

  const onSingleTapEvent = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      setScore((prevScore) => prevScore + SINGLE_TAP_POINTS);
    }
  };

  const onDoubleTapEvent = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      setScore((prevScore) => prevScore + DOUBLE_TAP_POINTS);
    }
  };

  const onLongPressEvent = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      setScore((prevScore) => prevScore + LONG_PRESS_POINTS);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Гра-клікер</Text>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Очки: {score}</Text>
      </View>
      <View style={styles.gameArea}>
        <LongPressGestureHandler
          onHandlerStateChange={onLongPressEvent}
          minDurationMs={LONG_PRESS_DURATION_MS}
        >
          <TapGestureHandler
            onHandlerStateChange={onDoubleTapEvent}
            numberOfTaps={2}
          >
            <TapGestureHandler
              onHandlerStateChange={onSingleTapEvent}
              numberOfTaps={1}
            >
              <View style={styles.clickableObject}>
                <Text style={styles.objectText}>Натисни!</Text>
              </View>
            </TapGestureHandler>
          </TapGestureHandler>
        </LongPressGestureHandler>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  scoreContainer: {
    marginBottom: 30,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  scoreText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#424242',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  clickableObject: {
    width: 150,
    height: 150,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 75,
    borderWidth: 3,
    borderColor: 'blue',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  objectText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});