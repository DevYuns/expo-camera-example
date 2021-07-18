import styled from '@emotion/native';
import React, {FC} from 'react';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';

const Dot = styled.View`
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: blue;
`;

interface Props {
  pointX: Animated.SharedValue<number>;
  pointY: Animated.SharedValue<number>;
  cropHeight: Animated.SharedValue<number>;
  cropWidth: Animated.SharedValue<number>;
}

const DotA: FC<Props> = ({pointX, pointY, cropHeight, cropWidth}) => {
  const positionX = useDerivedValue(() => {
    return pointX.value;
  });

  const positionY = useDerivedValue(() => {
    return pointY.value;
  });

  const animStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: positionX.value}, {translateY: positionY.value}],
    };
  });

  return (
    <Animated.View style={animStyle}>
      <Dot />
    </Animated.View>
  );
};

export default DotA;
