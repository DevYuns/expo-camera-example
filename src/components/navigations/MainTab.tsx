import React, {FC} from 'react';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {
  BottomTabBarProps,
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {RootStackNavigationProps, RootStackParamList} from './RootStack';
import Result from '../pages/Result';
import Gallery from '../pages/Gallery';
import MobileCam from '../pages/MobileCam';
import CustomTabBar from '../uis/CustomTabBar';
import {getString} from '../../../STRINGS';

export type MainTabParamList = {
  mobileCam: undefined;
  Gallery: undefined;
  Result: {
    imageUri?: string;
  };
};

type NavigationProps<T extends keyof MainTabParamList> =
  BottomTabNavigationProp<MainTabParamList, T>;

export type MainTabNavigationProps<T extends keyof MainTabParamList> =
  CompositeNavigationProp<
    NavigationProps<T>,
    RootStackNavigationProps<'MainTab'>
  >;

const Tab = createBottomTabNavigator<MainTabParamList>();

interface Props {
  navigation: RootStackNavigationProps<'MainTab'>;
  route: RouteProp<RootStackParamList, 'MainTab'>;
}

const MainTab: FC<Props> = () => {
  return (
    <Tab.Navigator
      initialRouteName="mobileCam"
      tabBar={(tabBarProps: BottomTabBarProps) => (
        <CustomTabBar {...tabBarProps} />
      )}>
      <Tab.Screen
        name="mobileCam"
        component={MobileCam}
        options={{title: getString('CAMERA')}}
      />
      <Tab.Screen
        name="Gallery"
        component={Gallery}
        options={{title: getString('IMAGE')}}
      />
      <Tab.Screen
        name="Result"
        component={Result}
        options={{title: getString('RESULT')}}
      />
    </Tab.Navigator>
  );
};

export default MainTab;
