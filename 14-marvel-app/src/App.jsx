import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './navigation/AuthNavigator';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/index';

const App = () => {
  return (
    <Provider store={store}>
      {/* kayıtlı verileri yükler */}
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <AuthNavigator />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
