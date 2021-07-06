import {useTheme} from 'dooboo-ui';
import {
  RootStackNavigationProps,
  RootStackParamList,
} from '../navigations/RootStack';

import React, {useState} from 'react';
import {RouteProp} from '@react-navigation/core';
import styled from '@emotion/native';
import {Camera} from 'expo-camera';
import {Text, TouchableOpacity} from 'react-native';

const Container = styled.View`
  flex: 1;
  align-self: stretch;
  background-color: ${({theme}) => theme.background};
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

interface Props {
  navigation: RootStackNavigationProps<'Temp'>;
  route: RouteProp<RootStackParamList, 'Temp'>;
}

function Page(props: Props): React.ReactElement {
  const {theme} = useTheme();
  const [type, setType] = useState(Camera.Constants.Type.back);

  const {
    route: {
      params: {param},
    },
    navigation,
  } = props;

  return (
    <Container>
      <Camera type={type} style={{flex: 1, alignSelf: 'stretch'}}>
        <TouchableOpacity
          style={{width: 100, height: 100, backgroundColor: 'transparent'}}
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back,
            );
          }}>
          <Text style={{fontSize: 20, color: 'white'}}>Flip</Text>
        </TouchableOpacity>
      </Camera>
    </Container>
  );
}

export default Page;
