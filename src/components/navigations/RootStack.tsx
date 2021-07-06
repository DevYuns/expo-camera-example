import {
  StackNavigationProp,
  createStackNavigator,
} from '@react-navigation/stack';

import {NavigationContainer} from '@react-navigation/native';
import React, {FC} from 'react';
import {useTheme} from 'dooboo-ui';
import MainTab from './MainTab';
import {getString} from '../../../STRINGS';

export type RootStackParamList = {
  MainTab: undefined;
};

export type RootStackNavigationProps<T extends keyof RootStackParamList> =
  StackNavigationProp<RootStackParamList, T>;

const Stack = createStackNavigator<RootStackParamList>();

const RootStack: FC = () => {
  const {theme, themeType} = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainTab"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTitleStyle: {color: theme.text, alignSelf: 'center'},
          headerTintColor: theme.primary,
        }}
        headerMode={themeType === 'dark' ? 'screen' : 'float'}>
        <Stack.Screen
          name="MainTab"
          component={MainTab}
          options={{title: getString('MAIN_TAB_TITLE')}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
