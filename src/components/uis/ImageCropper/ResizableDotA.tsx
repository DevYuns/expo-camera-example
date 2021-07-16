import styled from '@emotion/native';
import React, {FC} from 'react';
import {View} from 'react-native';
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
import {DEFAULT_CROP_HEIGHT, DEFAULT_CROP_WIDTH} from '.';

const Container = styled.View`
  flex: 1;
  align-self: stretch;
`;

const Dot = styled.View`
  width: 10px;
  height: 10px;
  border: 3px solid red;
`;

interface Props {
  offsetX: Animated.SharedValue<number>;
  offsetY: Animated.SharedValue<number>;
}

const ResizableDotA: FC<Props> = ({offsetX, offsetY}) => {
  const dotOffsetX = useSharedValue(offsetX?.value);
  const dotOffsetY = useSharedValue(offsetY?.value);

  const animStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: dotOffsetX.value},
        {translateY: dotOffsetY.value},
      ],
    };
  });

  return (
    <Animated.View style={animStyle}>
      <Dot />
    </Animated.View>
  );
};

export default ResizableDotA;
