import React, {FC} from 'react';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {
  BottomTabBarProps,
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {RootStackNavigationProps, RootStackParamList} from './RootStack';
import ResultPage from '../pages/ResultPage';
import GalleryPage from '../pages/GalleryPage';
import CameraPage from '../pages/CameraPage';
import CustomTabBar from '../uis/CustomTabBar';
import {getString} from '../../../STRINGS';

export type MainTabParamList = {
  CameraPage: undefined;
  GalleryPage: undefined;
  ResultPage: {
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
      initialRouteName="CameraPage"
      tabBar={(tabBarProps: BottomTabBarProps) => (
        <CustomTabBar {...tabBarProps} />
      )}>
      <Tab.Screen
        name="CameraPage"
        component={CameraPage}
        options={{title: getString('CAMERA')}}
      />
      <Tab.Screen
        name="GalleryPage"
        component={GalleryPage}
        options={{title: getString('IMAGE')}}
      />
      <Tab.Screen
        name="ResultPage"
        component={ResultPage}
        options={{title: getString('RESULT')}}
      />
    </Tab.Navigator>
  );
};

export default MainTab;
