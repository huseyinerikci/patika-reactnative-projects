import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { createStore } from 'redux';
import reducers from './reducers';
import { Provider } from 'react-redux';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLogin, setIsAuthLogin] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('@USER').then(userSession => {
      useSession && setUser(JSON.parse(userSession));
      setIsAuthLogin(false);
    });
  }, []);

  const store = createStore(reducers, { user, isAuthLogin });
  return <Provider store={store}>{children}</Provider>;
};

export default AuthProvider;
