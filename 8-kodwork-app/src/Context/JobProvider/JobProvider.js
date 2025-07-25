import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider, useDispatch } from 'react-redux';
import store from './store';

const InitLoader = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const stored = await AsyncStorage.getItem('@JOBS');
        const parsed = stored ? JSON.parse(stored) : [];
        dispatch({ type: 'LIST_SUCCESS', payload: parsed });
      } catch (e) {
        dispatch({ type: 'LIST_ERROR', payload: e });
      }
    };
    loadJobs();
  }, []);

  return children;
};

const JobProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <InitLoader>{children}</InitLoader>
    </Provider>
  );
};

export default JobProvider;
