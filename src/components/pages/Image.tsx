import styled from '@emotion/native';
import {RouteProp} from '@react-navigation/core';
import React, {FC} from 'react';
import {MainTabNavigationProps, MainTabParamList} from '../navigations/MainTab';

const Container = styled.View`
  flex: 1;
  align-self: stretch;
  background-color: ${({theme}) => theme.background};

  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Typography = styled.Text`
  font-size: 20px;
  color: ${({theme}) => theme.text};
`;

interface Props {
  navigation: MainTabNavigationProps<'image'>;
  route: RouteProp<MainTabParamList, 'image'>;
}

const Image: FC<Props> = () => {
  return (
    <Container>
      <Typography>Image</Typography>
    </Container>
  );
};

export default Image;
