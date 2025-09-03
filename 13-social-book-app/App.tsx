// App.tsx
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider as PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { store, persistor } from './src/store';
import RootNavigator from './src/navigation';
import { theme } from './src/theme';
import AuthListener from './src/components/AuthListener';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const App: React.FC = () => {
  useEffect(() => {
    // Ensure icon font is loaded on both platforms
    // Helps when fonts aren't picked up automatically by the bundle
    MaterialCommunityIcons.loadFont();
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <PaperProvider theme={theme}>
              <StatusBar
                barStyle="dark-content"
                backgroundColor={theme.colors.surface}
                translucent={false}
              />
              <AuthListener />
              <RootNavigator />
            </PaperProvider>
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
