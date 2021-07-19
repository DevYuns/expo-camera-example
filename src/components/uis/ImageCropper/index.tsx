import styled from '@emotion/native';
import React, {FC} from 'react';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {clamp} from 'react-native-redash';
import {CropDimension} from '../../pages/CameraPage';

const Container = styled.View<{width: number; height: number}>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${({width}) => width}px;
  height: ${({height}) => height}px;
  background-color: #000;
  opacity: 0.5;
`;

const Dot = styled.View`
  width: 30px;
  height: 30px;
  background-color: red;
`;

interface Props {
  width: number;
  height: number;
  setCropDimention: (value: CropDimension) => void;
}

const Refleca: FC<Props> = ({
  width: limitationWidth,
  height: limitationHeight,
  setCropDimention,
}) => {
  const DEFAULT_HEIGHT = 200;
  const DEFAULT_WIDTH = 200;

  const minWidth = DEFAULT_WIDTH / 3;
  const minHeight = DEFAULT_HEIGHT / 3;

  const translateX = useSharedValue((limitationWidth - DEFAULT_WIDTH) / 2);
  const translateY = useSharedValue((limitationHeight - DEFAULT_HEIGHT) / 2);
  const windowHeight = useSharedValue(DEFAULT_HEIGHT);
  const windowWidth = useSharedValue(DEFAULT_WIDTH);

  const setDimentionOnUI_JS = (
    width: number,
    height: number,
    offsetX: number,
    offsetY: number,
  ): void => {
    setCropDimention({
      offsetX,
      offsetY,
      width,
      height,
    });
  };

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {offsetX: number; offsetY: number}
  >({
    onStart: (_, ctx) => {
      ctx.offsetX = translateX.value;
      ctx.offsetY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = clamp(
        ctx.offsetX + event.translationX,
        0,
        limitationWidth - windowWidth.value,
      );

      translateY.value = clamp(
        ctx.offsetY + event.translationY,
        0,
        limitationHeight - windowHeight.value,
      );
    },
    onEnd: () => {
      runOnJS(setDimentionOnUI_JS)(
        windowWidth.value,
        windowHeight.value,
        translateX.value,
        translateY.value,
      );
    },
  });

  const resizeHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {
      windowHeight: number;
      windowWidth: number;
      offsetX: number;
      offsetY: number;
    }
  >({
    onStart: (_, ctx) => {
      ctx.windowWidth = windowWidth.value;
      ctx.windowHeight = windowHeight.value;
      ctx.offsetX = translateX.value;
      ctx.offsetY = translateY.value;
    },
    onActive: (event, ctx) => {
      windowWidth.value = clamp(
        ctx.windowWidth + event.translationX,
        minWidth,
        limitationWidth - translateX.value,
      );

      windowHeight.value = clamp(
        ctx.windowHeight + event.translationY,
        minHeight,
        limitationHeight - translateY.value,
      );
    },
    onEnd: () => {
      runOnJS(setDimentionOnUI_JS)(
        windowWidth.value,
        windowHeight.value,
        translateX.value,
        translateY.value,
      );
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
      {
        translateY: translateY.value,
      },
    ],
    height: windowHeight.value,
    width: windowWidth.value,
  }));

  return (
    <Container width={limitationWidth} height={limitationHeight}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View
          style={[
            animatedStyle,
            {
              borderWidth: 2,
              borderColor: 'white',
              backgroundColor: 'transparent',
            },
          ]}>
          <PanGestureHandler onGestureEvent={resizeHandler}>
            <Animated.View
              style={{
                position: 'absolute',
                zIndex: 1,
                right: -15,
                bottom: -15,
              }}>
              <Dot />
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    </Container>
  );
};

export default Refleca;
