import styled from '@emotion/native';
import {RouteProp} from '@react-navigation/core';
import React, {FC, useEffect, useState} from 'react';
import {MainTabNavigationProps, MainTabParamList} from '../navigations/MainTab';
import * as ImagePicker from 'expo-image-picker';
import {Alert, Platform, View} from 'react-native';
import {getString} from '../../../STRINGS';

const Container = styled.View`
  flex: 1;
  align-self: stretch;
  background-color: ${({theme}) => theme.background};

  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Styledbutton = styled.TouchableOpacity`
  flex: 1;
  align-self: stretch;
  background-color: ${({theme}) => theme.paper};

  justify-content: center;
  align-items: center;
`;

const Typography = styled.Text`
  font-size: 20px;
  color: ${({theme}) => theme.text};
`;

const GalleryImage = styled.Image`
  flex: 1;
  align-self: stretch;
`;

type ImageType = {
  uri: string;
  width: number;
  height: number;
  cancelled: boolean;
};

interface Props {
  navigation: MainTabNavigationProps<'Gallery'>;
  route: RouteProp<MainTabParamList, 'Gallery'>;
}

const Gallery: FC<Props> = ({navigation}) => {
  const [image, setImage] = useState<ImageType | null>(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const {status} =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted')
          Alert.alert(
            "Can't access to gallery",
            'Sorry, we need camera roll permissions to make this work!',
          );
      }
    })();
  }, []);

  const pickImage = async (): Promise<void> => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) setImage(result);
  };

  return (
    <Container>
      <View style={{flex: 1, alignSelf: 'stretch'}}>
        {image ? (
          <GalleryImage source={{uri: image.uri}} resizeMode={'contain'} />
        ) : (
          <View
            style={{
              flex: 1,
              alignSelf: 'stretch',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Typography>{getString('SELECT_IMAGE_DESCRIPTION')}</Typography>
          </View>
        )}
      </View>
      <View style={{flex: 0.1, alignSelf: 'stretch', flexDirection: 'row'}}>
        <Styledbutton onPress={pickImage}>
          <Typography>{getString('PICK_AN_IMAGE')}</Typography>
        </Styledbutton>
        <Styledbutton
          onPress={() => {
            navigation.navigate('Result', {
              imageUri: image?.uri,
            });
          }}>
          <Typography>{getString('SEARCH')}</Typography>
        </Styledbutton>
      </View>
    </Container>
  );
};

export default Gallery;
