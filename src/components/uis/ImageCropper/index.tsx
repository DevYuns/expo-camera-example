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
import DotA from './DotA';
import DotB from './DotB';
import DotC from './DotC';
import DotD from './DotD';
import Resizable from './Resizable';

export const DEFAULT_CROP_WIDTH = 200;
export const DEFAULT_CROP_HEIGHT = 200;

const Container = styled.View<{width: number; height: number}>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${({width}) => width}px;
  height: ${({height}) => height}px;
  background-color: #000;
  opacity: 0.5;
`;

const CropWindow = styled.View`
  border: 2px solid white;
  background-color: transparent;
`;

interface Props {
  width: number;
  height: number;
  setCropDimention: (value: CropDimension) => void;
}

const ImageCropper: FC<Props> = ({
  width: containerWidth,
  height: containerHeight,
  setCropDimention,
}) => {
  const translateX = useSharedValue((containerWidth - DEFAULT_CROP_WIDTH) / 2);

  const translateY = useSharedValue(
    (containerHeight - DEFAULT_CROP_HEIGHT) / 2,
  );

  const cropHeight = useSharedValue(DEFAULT_CROP_HEIGHT);
  const cropWidth = useSharedValue(DEFAULT_CROP_WIDTH);

  const setDimentionOnUI_JS = (
    width: number,
    height: number,
    offsetX: number,
    offsetY: number,
  ): void => {
    setCropDimention({
      width,
      height,
      offsetX,
      offsetY,
    });
  };

  const onGestureEvent = useAnimatedGestureHandler<
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
        containerWidth - cropWidth.value,
      );

      translateY.value = clamp(
        ctx.offsetY + event.translationY,
        0,
        containerHeight - cropHeight.value,
      );
    },
    onEnd: (_) => {
      runOnJS(setDimentionOnUI_JS)(
        cropWidth.value,
        cropHeight.value,
        translateX.value,
        translateY.value,
      );
    },
  });

  const dragAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
      ],
    };
  });

  return (
    <Container width={containerWidth} height={containerHeight}>
      <DotA
        pointX={translateX}
        pointY={translateY}
        cropHeight={cropHeight}
        cropWidth={cropWidth}
      />
      <DotB
        pointX={translateX}
        pointY={translateY}
        cropHeight={cropHeight}
        cropWidth={cropWidth}
      />
      <DotC
        pointX={translateX}
        pointY={translateY}
        cropHeight={cropHeight}
        cropWidth={cropWidth}
      />
      <DotD
        pointX={translateX}
        pointY={translateY}
        cropHeight={cropHeight}
        cropWidth={cropWidth}
      />
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={dragAnimStyle}>
          <CropWindow
            style={{width: cropWidth.value, height: cropHeight.value}}
          />
        </Animated.View>
      </PanGestureHandler>
    </Container>
  );
};

export default ImageCropper;
