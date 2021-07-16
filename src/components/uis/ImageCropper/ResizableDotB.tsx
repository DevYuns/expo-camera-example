import styled from '@emotion/native';
import React, {FC} from 'react';
import {View} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const Container = styled.View`
  width: 10px;
  height: 10px;
  border: 3px solid red;
`;

interface Props {
  offsetX: Animated.SharedValue<number>;
  offsetY: Animated.SharedValue<number>;
  containerWidth: number;
  containerHeight: number;
}

const ResizableDotB: FC<Props> = ({offsetX, offsetY}) => {
  return (
    <Container>
      <PanGestureHandler>
        <Animated.View>
          <View />
        </Animated.View>
      </PanGestureHandler>
    </Container>
  );
};

export default ResizableDotB;
