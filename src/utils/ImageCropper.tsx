import styled from '@emotion/native';
import React, {FC, useEffect, useRef, useState} from 'react';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {clamp} from 'react-native-redash';
import {CropDimension} from '../components/pages/CameraPage';

const Container = styled.View<{width: number; height: number}>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${({width}) => width}px;
  height: ${({height}) => height}px;
  background-color: #000;
  opacity: 0.5;
`;

const Crop = styled.View`
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

  const cropHeight = useRef(200);
  const cropWidth = useRef(200);
  const cropX = useRef(0);
  const cropY = useRef(0);

  useEffect(() => {
    if (captureLayout)
      setCropDimention({
        width: cropWidth.current,
        height: cropHeight.current,
        offsetX: cropX.current,
        offsetY: cropY.current,
      });
  }, [captureLayout, setCropDimention]);

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
        containerWidth - cropWidth.current,
      );

      translateY.value = clamp(
        ctx.offsetY + event.translationY,
        0,
        containerHeight - cropHeight.current,
      );
    },
    // onEnd: (_, ctx) => {
    //   cropX.current = ctx.offsetX;
    //   cropX.current = ctx.offsetY;
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
    <Container width={containerWidth} height={containerHeight}>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={animStyle}>
          <Crop
            style={{width: cropWidth.current, height: cropHeight.current}}
            onLayout={({nativeEvent: {layout}}) => {
              cropWidth.current = layout.width;
              cropHeight.current = layout.height;
              cropX.current = layout.x;
              cropY.current = layout.y;
              setCaptureLayout(true);
            }}
          />
        </Animated.View>
      </PanGestureHandler>
    </Container>
  );
};

export default ImageCropper;
