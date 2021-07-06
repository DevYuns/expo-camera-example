import React, {FC} from 'react';
import {RouteProp} from '@react-navigation/core';
import styled from '@emotion/native';
import {Image} from 'react-native';
import {MainTabNavigationProps, MainTabParamList} from '../navigations/MainTab';

const Container = styled.View`
  flex: 1;
  align-self: stretch;
  background-color: ${({theme}) => theme.background};
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Typography = styled.Text`
  font-size: 20px;
  color: ${({theme}) => theme.text};
`;

interface Props {
  navigation: MainTabNavigationProps<'result'>;
  route: RouteProp<MainTabParamList, 'result'>;
}

const Result: FC<Props> = ({route}) => {
  return (
    <Container>
      {route.params?.imageUri !== undefined ? (
        <Image
          source={{uri: route.params.imageUri}}
          style={{height: 200, width: 200}}
        />
      ) : (
        <Typography>Give me a image source</Typography>
      )}
    </Container>
  );
};

export default Result;
