import {Button, useTheme} from 'dooboo-ui';

import React, {FC} from 'react';
import {RootStackNavigationProps} from '../navigations/RootStack';
import {getString} from '../../../STRINGS';
import styled from '@emotion/native';

const Container = styled.View`
  flex: 1;
  align-self: stretch;
  overflow: scroll;
  background-color: ${({theme}) => theme.background};

  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
`;

const ButtonWrapper = styled.View`
  position: absolute;
  flex-direction: column;
  bottom: 40px;
  width: 72%;
  align-self: center;
`;

interface Props {
  navigation: RootStackNavigationProps<'Intro'>;
}

const Intro: FC<Props> = ({navigation}) => {
  const {changeThemeType} = useTheme();

  return (
    <Container>
      <ButtonWrapper>
        <Button
          testID="btn-theme"
          onPress={(): void => changeThemeType()}
          text={getString('CHANGE_THEME')}
        />
      </ButtonWrapper>
    </Container>
  );
};

export default Intro;
