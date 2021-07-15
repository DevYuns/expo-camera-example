import styled from '@emotion/native';
import React, {FC} from 'react';
import ImageCropper from '../../utils/ImageCropper';
import {PhotoType, CropDimension} from '../pages/CameraPage';
import {LayoutChangeEvent, LayoutRectangle} from 'react-native';

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
  cropperContainer: LayoutRectangle | null;
  setCropDimention: (value: CropDimension) => void;
  onLayout: (e: LayoutChangeEvent) => void;
}

const Preview: FC<Props> = ({
  photo,
  onLayout,
  cropperContainer,
  setCropDimention,
}) => {
  return (
    <Container onLayout={onLayout}>
      <ImagePreview source={{uri: photo.uri}} />
      {cropperContainer && (
        <ImageCropper
          {...cropperContainer}
          setCropDimention={setCropDimention}
        />
      )}
    </Container>
  );
};

export default Preview;
