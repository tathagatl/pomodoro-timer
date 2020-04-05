import React, { useState } from 'react';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';

import Navigator from './Navigator';

const fetchFonts = () => {
  return Font.loadAsync({
    'digital-mono': require('./assets/fonts/digital-mono.ttf'),
    'ubuntu-mono': require('./assets/fonts/UbuntuMono-Regular.ttf')
  });
};

export default function App() {
  const [dataLoaded, setDataLoaded] = useState(false);
  if (!dataLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setDataLoaded(true)}
        onError={(err) => console.log(err)}
      />
    );
  }

  return <Navigator />;
}

