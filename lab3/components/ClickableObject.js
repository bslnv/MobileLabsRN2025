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
const FLING_RANDOM_POINTS_MAX = 10;
const PINCH_BONUS_POINTS = 10;

const OBJECT_SIZE = 150;

export default function ClickableObject() {
  const { 
    recordSingleTap, 
    recordDoubleTap, 
    recordLongPress,
    recordPan,
    recordFlingRight,
    recordFlingLeft,
    recordPinch
  } = useContext(GameContext);

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
    onEnd: (event, _) => {
      if (Math.abs(event.translationX) > 10 || Math.abs(event.translationY) > 10) {
        runOnJS(recordPan)();
      }
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
      if (scale.value !== ctx.startScale && Math.abs(scale.value - 1) > 0.1) {
        runOnJS(recordPinch)(PINCH_BONUS_POINTS);
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
  
  const onFlingRightActive = () => {
    const randomPoints = Math.floor(Math.random() * FLING_RANDOM_POINTS_MAX) + 1;
    recordFlingRight(randomPoints); 
  };
  
  const onFlingLeftActive = () => {
    const randomPoints = Math.floor(Math.random() * FLING_RANDOM_POINTS_MAX) + 1;
    recordFlingLeft(randomPoints);
  };

  return (
    <PinchGestureHandler onGestureEvent={pinchGestureHandler}>
      <Animated.View>
        <PanGestureHandler onGestureEvent={panGestureHandler}>
          <Animated.View style={animatedStyle}>
            <FlingGestureHandler
              direction={Directions.LEFT}
              onHandlerStateChange={(event) => event.nativeEvent.state === State.ACTIVE && runOnJS(onFlingLeftActive)()}
            >
              <FlingGestureHandler
                direction={Directions.RIGHT}
                onHandlerStateChange={(event) => event.nativeEvent.state === State.ACTIVE && runOnJS(onFlingRightActive)()}
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
            </FlingGestureHandler>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </PinchGestureHandler>
  );
}

const styles = StyleSheet.create({
  clickableObject: {
    width: OBJECT_SIZE,
    height: OBJECT_SIZE,
    backgroundColor: 'deepskyblue', 
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: OBJECT_SIZE / 2,
    borderWidth: 3,
    borderColor: 'dodgerblue',
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