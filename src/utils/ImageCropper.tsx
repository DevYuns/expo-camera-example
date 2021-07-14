import styled from '@emotion/native';
import React, {FC} from 'react';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';
import {clamp, withBouncing} from 'react-native-redash';

const Container = styled.View`
  flex: 1;
  align-self: stretch;
  background-color: red;
  z-index: 10;
`;

const Crop = styled.View`
  width: 100px;
  height: 100px;

  border: 2px solid white;
  background-color: transparent;
`;

interface Props {
  width: number;
  height: number;
}

const ImageCropper: FC<Props> = ({width, height}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {offsetX: number; offsetY: number}
  >({
    onStart: (_, ctx) => {
      ctx.offsetX = translateX.value;
      ctx.offsetY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.offsetX + event.translationX;
      translateY.value = ctx.offsetY + event.translationY;
    },
    // onEnd: ({velocityX, velocityY}) => {
    //   translateX.value = withBouncing(
    //     withDecay({
    //       velocity: velocityX,
    //     }),
    //     0,
    //     boundX,
    //   );

    //   translateY.value = withBouncing(
    //     withDecay({
    //       velocity: velocityY,
    //     }),
    //     0,
    //     boundY,
    //   );
    // },
  });

  const animStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
      ],
    };
  });

  return (
    <Container>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={animStyle}>
          <Crop />
        </Animated.View>
      </PanGestureHandler>
    </Container>
  );
};

export default ImageCropper;
