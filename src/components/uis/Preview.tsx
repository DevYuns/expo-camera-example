import styled from '@emotion/native';
import React, {FC, useState} from 'react';
import ImageCropper from '../../utils/ImageCropper';
import {PhotoType, CropDimension} from '../pages/CameraPage';
import {LayoutRectangle} from 'react-native';

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

  return (
    <Container
      onLayout={({nativeEvent: {layout}}) => setContainerLayout(layout)}>
      {photo && <ImagePreview source={{uri: photo.uri}} />}
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
