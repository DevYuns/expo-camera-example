import styled from '@emotion/native';
import {RouteProp} from '@react-navigation/core';
import {Camera} from 'expo-camera';
import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {LayoutRectangle, Text} from 'react-native';
import {MainTabNavigationProps, MainTabParamList} from '../navigations/MainTab';
import * as ImageManipulator from 'expo-image-manipulator';
import {getString} from '../../../STRINGS';
import {CameraType} from 'expo-camera/build/Camera.types';
import Preview from '../uis/Preview';

const Container = styled.View`
  flex: 1;
  align-self: stretch;
  background-color: ${({theme}) => theme.background};

  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ImageWrapper = styled.View`
  flex: 1;
  align-self: stretch;
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

export type PhotoType = {
  height: number;
  width: number;
  uri: string;
};

export type CropDimension = {
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
};

interface Props {
  navigation: MainTabNavigationProps<'CameraPage'>;
  route: RouteProp<MainTabParamList, 'CameraPage'>;
}

const CameraPage: FC<Props> = ({navigation}) => {
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);

  const [cameraType, setCameraType] = useState<CameraType>(
    Camera.Constants.Type.back,
  );

  const [isCameraReady, setIsCameraReday] = useState<boolean>(false);

  const [photo, setPhoto] = useState<PhotoType | null>(null);

  const [cropDimention, setCropDimention] = useState<CropDimension | null>(
    null,
  );

  const [imageWrapperLayout, setImageWrapperLayout] =
    useState<LayoutRectangle | null>(null);

  const cameraRef = useRef<Camera>(null);

  const takePicture = useCallback(async (): Promise<void> => {
    if (!isCameraReady) return;

    try {
      if (cameraRef.current !== null) {
        const result = await cameraRef.current.takePictureAsync();

        const resizedResult = await ImageManipulator.manipulateAsync(
          result.uri,
          [
            {
              resize: {
                width: imageWrapperLayout?.width,
                height: imageWrapperLayout?.height,
              },
            },
          ],
        );

        setPhoto(resizedResult);
      }
    } catch (error) {
      console.log(error);
    }
  }, [isCameraReady, imageWrapperLayout]);

  const resetPreviewImage = (): void => {
    setPhoto(null);
  };

  const sendToResultPage = (): void => {
    if (photo === null) return;

    navigation.navigate('ResultPage', {
      imageUri: photo.uri,
    });
  };

  const manipulateImageWithCrop = async (
    width: number,
    height: number,
    offsetX: number,
    offsetY: number,
  ): Promise<void> => {
    if (photo) {
      const result = await ImageManipulator.manipulateAsync(photo.uri, [
        {
          crop: {
            originX: offsetX,
            originY: offsetY,
            width: width,
            height: height,
          },
        },
      ]);

      setPhoto(result);
    }
  };

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

  console.log('결과', cropDimention);

  return (
    <Container>
      <ImageWrapper
        onLayout={({nativeEvent: {layout}}) => setImageWrapperLayout(layout)}>
        {photo ? (
          <Preview photo={photo} setCropDimention={setCropDimention} />
        ) : (
          <Camera
            ref={cameraRef}
            type={cameraType}
            autoFocus={true}
            style={{flex: 1, alignSelf: 'stretch'}}
            onCameraReady={() => setIsCameraReday(true)}>
            <ShootingButtonWrapper>
              <ShootingButton onPress={takePicture} />
            </ShootingButtonWrapper>
          </Camera>
        )}
      </ImageWrapper>
      <ButtonWrapper>
        <Styledbutton onPress={resetPreviewImage}>
          <Typography>{getString('RESET')}</Typography>
        </Styledbutton>
        <Styledbutton
          onPress={() => {
            setCameraType(
              cameraType === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back,
            );
          }}>
          <Typography>{getString('FLIP')}</Typography>
        </Styledbutton>
        <Styledbutton
          onPress={async () => {
            if (cropDimention)
              manipulateImageWithCrop(
                cropDimention.width,
                cropDimention.height,
                cropDimention.offsetX,
                cropDimention.offsetY,
              );
          }}>
          <Typography> {getString('CROP')}</Typography>
        </Styledbutton>
        <Styledbutton onPress={sendToResultPage}>
          <Typography> {getString('SEARCH')}</Typography>
        </Styledbutton>
      </ButtonWrapper>
    </Container>
  );
};

export default CameraPage;
