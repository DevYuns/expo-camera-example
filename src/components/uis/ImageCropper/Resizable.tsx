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
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import {clamp} from 'react-native-redash';
import DotA from './DotA';
import DotB from './DotB';
import DotC from './DotC';
import DotD from './DotD';

const Container = styled.View`
  position: absolute;
  top: 0;
  left: 0;
`;

const Indicator = styled.View`
  width: 200px;
  height: 200px;
  background-color: green;
`;

interface Props {
  offsetX: Animated.SharedValue<number>;
  offsetY: Animated.SharedValue<number>;
  cropWidth: Animated.SharedValue<number>;
  cropHeight: Animated.SharedValue<number>;
}

const Resizable: FC<Props> = ({offsetX, offsetY, cropHeight, cropWidth}) => {
  const animStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: offsetX.value}, {translateY: offsetY.value}],
    };
  });

  return (
    <Container>
      <Animated.View style={animStyle}>
        <Indicator />
      </Animated.View>
    </Container>
  );
};

export default Resizable;
