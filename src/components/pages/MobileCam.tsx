import styled from '@emotion/native';
import {RouteProp} from '@react-navigation/core';
import {Camera} from 'expo-camera';
import React, {FC, useEffect, useRef, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {MainTabNavigationProps, MainTabParamList} from '../navigations/MainTab';
import {useIsFocused} from '@react-navigation/native';
import {getString} from '../../../STRINGS';

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

  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isCameraReady, setIsCameraReday] = useState(false);
  const [previewVisible, setPreviewVisbile] = useState<boolean>(false);

  const [capturedImage, setCapturedImage] = useState<CapturedImage | null>(
    null,
  );

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

    navigation.navigate('result', {
      imageUri: capturedImage.uri,
    });
  };

  return (
    <Container>
      {previewVisible && capturedImage ? (
        <ImagePreviewWrapper>
          <CancelButton onPress={resetPreviewImage}>
            <Text style={{fontSize: 30}}>X</Text>
          </CancelButton>
          <ImagePreview source={{uri: capturedImage.uri}} />
        </ImagePreviewWrapper>
      ) : (
        <Camera
          ref={cameraRef}
          type={type}
          autoFocus={true}
          style={{flex: 1, alignSelf: 'stretch'}}
          onCameraReady={() => setIsCameraReday(true)}>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              flexDirection: 'row',
              flex: 1,
              width: '100%',
              padding: 20,
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                alignSelf: 'center',
                flex: 1,
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={takePickture}
                style={{
                  width: 70,
                  height: 70,
                  bottom: 0,
                  borderRadius: 50,
                  backgroundColor: '#fff',
                }}
              />
            </View>
          </View>
        </Camera>
      )}
      <View
        style={{
          flex: 0.1,
          alignSelf: 'stretch',
          borderTopWidth: 1,
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderRightWidth: 1,
          }}
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back,
            );
          }}>
          <Typography>{getString('FLIP')}</Typography>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderLeftWidth: 1,
          }}
          onPress={imageProccessing}>
          <Typography> {getString('SEARCH')}</Typography>
        </TouchableOpacity>
      </View>
    </Container>
  );
};

export default MobileCam;