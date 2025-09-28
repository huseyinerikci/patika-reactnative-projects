import React from 'react';
import { useSelector } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import MainNavigator from './MainNavigator';
import AuthNavigator from './AuthNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
