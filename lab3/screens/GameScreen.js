import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import {
  TapGestureHandler,
  LongPressGestureHandler,
  PanGestureHandler,
  FlingGestureHandler,
  PinchGestureHandler, // Додано
  State,
  Directions,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const SINGLE_TAP_POINTS = 1;
const DOUBLE_TAP_POINTS = 2;
const LONG_PRESS_POINTS = 5;
const LONG_PRESS_DURATION_MS = 500;
const FLING_MAX_POINTS = 10;
const PINCH_BONUS_POINTS = 10; // Бонус за масштабування

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const OBJECT_SIZE = 150;

export default function GameScreen() {
  const [score, setScore] = useState(0);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1); // Shared value для масштабу

  const addScore = (points) => {
    setScore((prevScore) => prevScore + points);
  };

  const onSingleTapEvent = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      addScore(SINGLE_TAP_POINTS);
    }
  };

  const onDoubleTapEvent = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      addScore(DOUBLE_TAP_POINTS);
    }
  };

  const onLongPressEvent = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      addScore(LONG_PRESS_POINTS);
    }
  };

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: (_) => {
      // Можна додати логіку повернення або анімації
    },
  });

  const pinchGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startScale = scale.value;
    },
    onActive: (event, ctx) => {
      scale.value = ctx.startScale * event.scale;
    },
    onEnd: (_, ctx) => {
      // Якщо відбулося масштабування, додаємо очки
      if (scale.value !== ctx.startScale && scale.value !== 1) { // Перевіряємо, чи масштаб змінився
         runOnJS(addScore)(PINCH_BONUS_POINTS);
      }
      // Можна додати анімацію повернення до початкового масштабу:
      // scale.value = withSpring(1);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value }, // Додано масштабування
      ],
    };
  });

  const onFlingEvent = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      const randomPoints = Math.floor(Math.random() * FLING_MAX_POINTS) + 1;
      runOnJS(addScore)(randomPoints);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Гра-клікер</Text>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Очки: {score}</Text>
      </View>
      <View style={styles.gameArea}>
        <PinchGestureHandler onGestureEvent={pinchGestureHandler}>
          <Animated.View>
            <PanGestureHandler onGestureEvent={panGestureHandler}>
              <Animated.View style={animatedStyle}>
                <FlingGestureHandler
                  direction={Directions.RIGHT | Directions.LEFT | Directions.UP | Directions.DOWN}
                  onHandlerStateChange={onFlingEvent}
                >
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
                        <Animated.View style={styles.clickableObject}>
                          <Text style={styles.objectText}>Клікай!</Text>
                        </Animated.View>
                      </TapGestureHandler>
                    </TapGestureHandler>
                  </LongPressGestureHandler>
                </FlingGestureHandler>
              </Animated.View>
            </PanGestureHandler>
          </Animated.View>
        </PinchGestureHandler>
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
    overflow: 'hidden',
  },
  clickableObject: {
    width: OBJECT_SIZE,
    height: OBJECT_SIZE,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: OBJECT_SIZE / 2,
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