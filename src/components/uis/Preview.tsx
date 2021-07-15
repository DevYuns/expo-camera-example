import styled from '@emotion/native';
import React, {FC, useEffect, useState} from 'react';
import ImageCropper from '../../utils/ImageCropper';
import {PhotoType, CropDimension} from '../pages/CameraPage';
import {LayoutRectangle} from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

const Container = styled.View`
  flex: 1;
  align-self: stretch;

  justify-content: center;
  align-items: center;
`;

const ImagePreview = styled.Image`
  flex: 1;
  align-self: stretch;
`;

interface Props {
  photo: PhotoType;
  setCropDimention: (value: CropDimension) => void;
}

const Preview: FC<Props> = ({photo, setCropDimention}) => {
  const [containerLayout, setContainerLayout] =
    useState<LayoutRectangle | null>(null);

  const [resizedPhoto, setResizedPhoto] = useState<PhotoType | null>(null);

  // useEffect(() => {
  //   (async () => {
  //     const result = await ImageManipulator.manipulateAsync(photo.uri, [
  //       {
  //         resize: {
  //           width: containerLayout?.width,
  //           height: containerLayout?.height,
  //         },
  //       },
  //     ]);

  //     setResizedPhoto(result);
  //   })();
  // }, [photo, containerLayout]);

  return (
    <Container
      onLayout={({nativeEvent: {layout}}) => setContainerLayout(layout)}>
      {resizedPhoto && <ImagePreview source={{uri: resizedPhoto.uri}} />}
      {containerLayout && (
        <ImageCropper
          {...containerLayout}
          setCropDimention={setCropDimention}
        />
      )}
    </Container>
  );
};

export default Preview;
