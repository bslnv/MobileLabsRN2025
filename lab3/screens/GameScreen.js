import React, { useContext } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import {
  TapGestureHandler,
  LongPressGestureHandler,
  PanGestureHandler,
  FlingGestureHandler,
  PinchGestureHandler,
  State,
  Directions,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated';
import { GameContext } from '../contexts/GameContext';

const SINGLE_TAP_POINTS = 1;
const DOUBLE_TAP_POINTS = 2;
const LONG_PRESS_POINTS = 5;
const LONG_PRESS_DURATION_MS = 500;
const FLING_MAX_POINTS = 10;
const PINCH_BONUS_POINTS = 10;

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const OBJECT_SIZE = 150;

export default function GameScreen() {
  const { score, recordSingleTap, recordDoubleTap, recordLongPress } = useContext(GameContext);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
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
      if (scale.value !== ctx.startScale && scale.value !== 1) {
        runOnJS(recordLongPress)(PINCH_BONUS_POINTS, 0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  const onSingleTapActive = () => {
    recordSingleTap();
  };

  const onDoubleTapActive = () => {
    recordDoubleTap();
  };
  
  const onLongPressStateChange = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      runOnJS(recordLongPress)(LONG_PRESS_POINTS, LONG_PRESS_DURATION_MS); 
    }
    if (event.nativeEvent.state === State.END || event.nativeEvent.state === State.CANCELLED) {
      runOnJS(recordLongPress)(0, event.nativeEvent.duration);
    }
  };
  
  const onFlingActive = () => {
    const randomPoints = Math.floor(Math.random() * FLING_MAX_POINTS) + 1;
    recordLongPress(randomPoints, 0); 
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
                  onHandlerStateChange={(event) => event.nativeEvent.state === State.ACTIVE && runOnJS(onFlingActive)()}
                >
                  <LongPressGestureHandler
                    onHandlerStateChange={onLongPressStateChange}
                    minDurationMs={LONG_PRESS_DURATION_MS}
                  >
                    <TapGestureHandler
                      onHandlerStateChange={(event) => event.nativeEvent.state === State.ACTIVE && runOnJS(onDoubleTapActive)()}
                      numberOfTaps={2}
                    >
                      <TapGestureHandler
                        onHandlerStateChange={(event) => event.nativeEvent.state === State.ACTIVE && runOnJS(onSingleTapActive)()}
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