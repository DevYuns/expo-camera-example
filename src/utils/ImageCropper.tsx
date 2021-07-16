import styled from '@emotion/native';
import React, {FC, useEffect, useState} from 'react';
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
import {CropDimension} from '../components/pages/CameraPage';

const DEFAULT_CROP_WIDTH = 200;
const DEFAULT_CROP_HEIGHT = 200;

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
  const [captureLayout, setCaptureLayout] = useState<boolean>(false);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const cropHeight = useSharedValue(0);
  const cropWidth = useSharedValue(0);
  const cropX = useSharedValue(0);
  const cropY = useSharedValue(0);

  const setDimentionOnUIJS = (
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

  useEffect(() => {
    if (captureLayout)
      setCropDimention({
        width: cropWidth.value,
        height: cropHeight.value,
        offsetX: cropX.value,
        offsetY: cropY.value,
      });
  }, [captureLayout, setCropDimention, cropWidth, cropHeight, cropX, cropY]);

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    // prettier-ignore
    {offsetX: number; offsetY: number;}
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
      cropX.value = translateX.value;
      cropY.value = translateY.value;

      runOnJS(setDimentionOnUIJS)(
        cropWidth.value,
        cropHeight.value,
        cropX.value,
        cropY.value,
      );
    },
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
    <Container width={containerWidth} height={containerHeight}>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={animStyle}>
          <CropWindow
            style={{width: DEFAULT_CROP_WIDTH, height: DEFAULT_CROP_HEIGHT}}
            onLayout={({nativeEvent: {layout}}) => {
              cropWidth.value = layout.width;
              cropHeight.value = layout.height;
              cropX.value = layout.x;
              cropY.value = layout.y;
              setCaptureLayout(true);
            }}
          />
        </Animated.View>
      </PanGestureHandler>
    </Container>
  );
};

export default ImageCropper;
