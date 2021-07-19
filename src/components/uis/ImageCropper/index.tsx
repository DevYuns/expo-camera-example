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
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import {clamp} from 'react-native-redash';
import {CropDimension} from '../../pages/CameraPage';

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
  flex: 1;
  align-self: stretch;
  border: 2px solid white;
  background-color: transparent;
`;

const DotA = styled.View`
  position: absolute;
  width: 30px;
  height: 30px;
  background-color: blue;
`;

const DotB = styled.View`
  position: absolute;
  width: 30px;
  height: 30px;
  background-color: blue;
`;

const DotC = styled.View`
  position: absolute;
  width: 30px;
  height: 30px;
  background-color: blue;
`;

const DotD = styled.View`
  position: absolute;
  width: 30px;
  height: 30px;
  background-color: blue;
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
  const translateXofA = useSharedValue(
    (containerWidth - DEFAULT_CROP_WIDTH) / 2,
  );

  const translateYofA = useSharedValue(
    (containerHeight - DEFAULT_CROP_HEIGHT) / 2,
  );

  const hasTranslateXofAChanged = useSharedValue(false);
  const hasTranslateYofAChanged = useSharedValue(false);

  const translateXofB = useSharedValue(
    translateXofA.value + DEFAULT_CROP_WIDTH,
  );

  const translateYofB = useSharedValue(translateYofA.value);
  const hasTranslateXofBChanged = useSharedValue(false);
  const hasTranslateYofBChanged = useSharedValue(false);

  const translateXofC = useSharedValue(translateXofA.value);

  const translateYofC = useSharedValue(
    translateYofA.value + DEFAULT_CROP_HEIGHT,
  );

  const hasTranslateXofCChanged = useSharedValue(false);
  const hasTranslateYofCChanged = useSharedValue(false);

  const translateXofD = useSharedValue(
    translateXofA.value + DEFAULT_CROP_WIDTH,
  );

  const translateYofD = useSharedValue(
    translateYofA.value + DEFAULT_CROP_HEIGHT,
  );

  const hasTranslateXofDChanged = useSharedValue(false);
  const hasTranslateYofDChanged = useSharedValue(false);

  const pointX0 = useDerivedValue(() => {
    if (hasTranslateXofAChanged.value) return translateXofA.value;
    else if (hasTranslateXofCChanged.value) return translateXofC.value;

    return translateXofA.value;
  });

  const pointY0 = useDerivedValue(() => {
    if (hasTranslateYofAChanged.value) return translateYofA.value;
    else if (hasTranslateYofBChanged.value) return translateYofB.value;

    return translateYofA.value;
  });

  const pointX1 = useDerivedValue(() => {
    if (hasTranslateXofBChanged.value) return translateXofB.value;
    else if (hasTranslateXofDChanged.value) return translateXofD.value;

    return translateXofB.value;
  });

  const pointY1 = useDerivedValue(() => {
    if (hasTranslateYofCChanged.value) return translateYofC.value;
    else if (hasTranslateYofDChanged.value) return translateYofD.value;

    return translateYofC.value;
  });

  const cropHeight = useDerivedValue(() => {
    return pointY1.value - pointY0.value;
  });

  const cropWidth = useDerivedValue(() => {
    return pointX1.value - pointX0.value;
  });

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

  const dotAGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {offsetX: number; offsetY: number}
  >({
    onStart: (_, ctx) => {
      ctx.offsetX = translateXofA.value;
      ctx.offsetY = translateYofA.value;
      hasTranslateXofAChanged.value = !hasTranslateXofAChanged.value;
      hasTranslateYofAChanged.value = !hasTranslateYofAChanged.value;
    },
    onActive: (event, ctx) => {
      translateXofA.value = clamp(
        ctx.offsetX + event.translationX,
        0,
        containerWidth - cropWidth.value,
      );

      translateYofA.value = clamp(
        ctx.offsetY + event.translationY,
        0,
        containerHeight - cropHeight.value,
      );
    },
    onEnd: (_) => {
      hasTranslateXofAChanged.value = !hasTranslateXofAChanged.value;
      hasTranslateYofAChanged.value = !hasTranslateYofAChanged.value;

      runOnJS(setDimentionOnUI_JS)(
        cropWidth.value,
        cropHeight.value,
        translateXofA.value,
        translateYofA.value,
      );
    },
  });

  const dotDGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {offsetX: number; offsetY: number}
  >({
    onStart: (_, ctx) => {
      ctx.offsetX = translateXofD.value;
      ctx.offsetY = translateYofD.value;
    },
    onActive: (event, ctx) => {
      translateXofD.value = clamp(
        ctx.offsetX + event.translationX,
        0,
        containerWidth - cropWidth.value,
      );

      translateYofD.value = clamp(
        ctx.offsetX + event.translationX,
        0,
        containerWidth - cropWidth.value,
      );
    },
  });

  const cropWindowAnim = useAnimatedStyle(() => {
    return {
      width: cropWidth.value,
      height: cropHeight.value,
      transform: [
        {translateX: translateXofA.value},
        {translateY: translateYofA.value},
      ],
    };
  });

  const dotAAnim = useAnimatedStyle(() => {
    return {
      transform: [{translateX: pointX0.value}, {translateY: pointY0.value}],
    };
  });

  const dotBAnim = useAnimatedStyle(() => {
    return {
      transform: [{translateX: pointX1.value}, {translateY: pointY0.value}],
    };
  });

  const dotCAnim = useAnimatedStyle(() => {
    return {
      transform: [{translateX: pointX0.value}, {translateY: pointY1.value}],
    };
  });

  const dotDAnim = useAnimatedStyle(() => {
    return {
      transform: [{translateX: pointX1.value}, {translateY: pointY1.value}],
    };
  });

  return (
    <Container width={containerWidth} height={containerHeight}>
      <Animated.View style={dotAAnim}>
        <DotA />
      </Animated.View>
      <Animated.View style={dotBAnim}>
        <DotB />
      </Animated.View>
      <Animated.View style={dotCAnim}>
        <DotC />
      </Animated.View>
      <PanGestureHandler onGestureEvent={dotDGestureEvent}>
        <Animated.View style={dotDAnim}>
          <DotD />
        </Animated.View>
      </PanGestureHandler>
      <PanGestureHandler onGestureEvent={dotAGestureEvent}>
        <Animated.View style={cropWindowAnim}>
          <CropWindow />
        </Animated.View>
      </PanGestureHandler>
    </Container>
  );
};

export default ImageCropper;
