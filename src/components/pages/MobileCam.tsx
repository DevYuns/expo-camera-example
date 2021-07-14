import styled from '@emotion/native';
import {RouteProp} from '@react-navigation/core';
import {Camera} from 'expo-camera';
import React, {FC, useEffect, useRef, useState} from 'react';
import {View, Text, LayoutRectangle} from 'react-native';
import {MainTabNavigationProps, MainTabParamList} from '../navigations/MainTab';
import {useIsFocused} from '@react-navigation/native';
import * as ImageManipulator from 'expo-image-manipulator';
import {getString} from '../../../STRINGS';
import {CameraType} from 'expo-camera/build/Camera.types';
import ImageCropper from '../../utils/ImageCropper';

const Container = styled.View`
  flex: 1;
  align-self: stretch;
  background-color: ${({theme}) => theme.background};

  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ImagePreviewWrapper = styled.View`
  flex: 1;
  align-self: stretch;

  justify-content: center;
  align-items: center;
`;

const ImagePreview = styled.Image`
  flex: 1;
  align-self: stretch;
  margin: 60px 30px;
`;

const ShootingButtonWrapper = styled.View`
  position: absolute;
  bottom: 0;
  padding: 20px;
  width: 100%;

  flex-direction: row;
  justify-content: center;
`;

const ButtonWrapper = styled.View`
  flex: 0.1;
  align-self: stretch;
  border-top-width: 1px;

  flex-direction: row;
`;

const ShootingButton = styled.TouchableOpacity`
  width: 70px;
  height: 70px;
  bottom: 0;
  border-radius: 50px;
  background-color: #fff;
`;

const CancelButton = styled.TouchableOpacity`
  position: absolute;
  top: 45px;
  right: 18px;
  z-index: 99;
  width: 30px;
  height: 30px;
  border-radius: 50px;
  border-width: 1px;
  background-color: #fff;

  justify-content: center;
  align-items: center;
`;

const Typography = styled.Text`
  font-size: 20px;
  color: ${({theme}) => theme.text};
`;

const Styledbutton = styled.TouchableOpacity`
  flex: 1;
  align-self: stretch;
  background-color: ${({theme}) => theme.paper};

  justify-content: center;
  align-items: center;
`;

type CapturedImage = {
  height: number;
  width: number;
  uri: string;
};

interface Props {
  navigation: MainTabNavigationProps<'mobileCam'>;
  route: RouteProp<MainTabParamList, 'mobileCam'>;
}

const MobileCam: FC<Props> = ({navigation}) => {
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);

  const [type, setType] = useState<CameraType>(Camera.Constants.Type.back);
  const [isCameraReady, setIsCameraReday] = useState<boolean>(false);
  const [previewVisible, setPreviewVisbile] = useState<boolean>(false);

  const [capturedImage, setCapturedImage] = useState<CapturedImage | null>(
    null,
  );

  const [cropperContainer, setCropperContainer] =
    useState<LayoutRectangle | null>(null);

  const isFocused = useIsFocused();

  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      try {
        const {status} = await Camera.requestPermissionsAsync();

        setHasCameraPermission(status === 'granted');
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  if (hasCameraPermission === false || hasCameraPermission === null)
    return <Text>Can not access to camera</Text>;

  if (!isFocused) return <View />;

  const takePickture = async (): Promise<void> => {
    if (!isCameraReady) return;

    if (cameraRef.current !== null) {
      const photo = await cameraRef.current.takePictureAsync();

      setPreviewVisbile(true);
      setCapturedImage(photo);
    }
  };

  const resetPreviewImage = (): void => {
    setPreviewVisbile(false);
    setCapturedImage(null);
  };

  const imageProccessing = (): void => {
    if (capturedImage === null) return;

    navigation.navigate('Result', {
      imageUri: capturedImage.uri,
    });
  };

  const manipulateImage = async (
    width: number,
    height: number,
    offsetX: number,
    offsetY: number,
  ): Promise<void> => {
    if (capturedImage)
      ImageManipulator.manipulateAsync(
        capturedImage.uri,
        [
          {
            crop: {
              originX: offsetX, // position left
              originY: offsetY, // position top
              width: width,
              height: height,
            },
          },
        ],
        {compress: 1, format: ImageManipulator.SaveFormat.PNG},
      );
  };

  return (
    <Container>
      {previewVisible && capturedImage ? (
        <ImagePreviewWrapper
          onLayout={({nativeEvent: {layout}}) => setCropperContainer(layout)}>
          <CancelButton onPress={resetPreviewImage}>
            <Text style={{fontSize: 30}}>X</Text>
          </CancelButton>
          <ImagePreview source={{uri: capturedImage.uri}} />
          {cropperContainer && <ImageCropper {...cropperContainer} />}
        </ImagePreviewWrapper>
      ) : (
        <Camera
          ref={cameraRef}
          type={type}
          autoFocus={true}
          style={{flex: 1, alignSelf: 'stretch'}}
          onCameraReady={() => setIsCameraReday(true)}>
          <ShootingButtonWrapper>
            <ShootingButton onPress={takePickture} />
          </ShootingButtonWrapper>
        </Camera>
      )}
      <ButtonWrapper>
        <Styledbutton
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back,
            );
          }}>
          <Typography>{getString('FLIP')}</Typography>
        </Styledbutton>
        <Styledbutton onPress={() => manipulateImage}>
          <Typography> {getString('CROP')}</Typography>
        </Styledbutton>
        <Styledbutton onPress={imageProccessing}>
          <Typography> {getString('SEARCH')}</Typography>
        </Styledbutton>
      </ButtonWrapper>
    </Container>
  );
};

export default MobileCam;
