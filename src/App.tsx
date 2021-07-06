import * as SplashScreen from 'expo-splash-screen';

import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import AppLoading from 'expo-app-loading';
import Icons from './utils/Icons';
import RootNavigator from './components/navigations/RootStack';
import RootProvider from './providers';
import {useAssets} from 'expo-asset';
import {useFonts} from 'expo-font';
import {Camera} from 'expo-camera';

SplashScreen.preventAutoHideAsync();

function App(): React.ReactElement {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const {status} = await Camera.requestPermissionsAsync();

      setHasPermission(status === 'granted');
    })();
  }, []);

  const [fontsLoaded] = useFonts({
    IcoMoon: require('dooboo-ui/Icon/doobooui.ttf'),
  });

  const [assets] = useAssets(Icons);

  useEffect(() => {
    if (assets && fontsLoaded) SplashScreen.hideAsync();
  }, [assets, fontsLoaded]);

  if (!assets) return <AppLoading />;

  if (hasPermission === null) return <View />;

  if (hasPermission === false) return <Text>No access to camera</Text>;

  return <RootNavigator />;
}

function ProviderWrapper(): React.ReactElement {
  return (
    <RootProvider>
      <App />
    </RootProvider>
  );
}

export default ProviderWrapper;
