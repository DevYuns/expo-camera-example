import React, {FC} from 'react';
import {RouteProp} from '@react-navigation/core';
import styled from '@emotion/native';
import {MainTabNavigationProps, MainTabParamList} from '../navigations/MainTab';
import {getString} from '../../../STRINGS';

const Container = styled.View`
  flex: 1;
  align-self: stretch;
  background-color: ${({theme}) => theme.background};

  flex-direction: row;
  align-items: center;
  justify-content: center;
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

const Typography = styled.Text`
  font-size: 20px;
  color: ${({theme}) => theme.text};
`;

interface Props {
  navigation: MainTabNavigationProps<'ResultPage'>;
  route: RouteProp<MainTabParamList, 'ResultPage'>;
}

const Result: FC<Props> = ({route}) => {
  return (
    <Container>
      {route.params?.imageUri !== undefined ? (
        <ImagePreviewWrapper>
          <ImagePreview source={{uri: route.params.imageUri}} />
        </ImagePreviewWrapper>
      ) : (
        <Typography>{getString('RESULT_DESCRIPTION')}</Typography>
      )}
    </Container>
  );
};

export default Result;
