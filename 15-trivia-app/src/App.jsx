import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { colors } from './config/colors';
import HomeScreen from './screens/HomeScreen';
import SettingScreen from './screens/SettingScreen';
import GameScreen from './screens/GameScreen';
import ResultScreen from './screens/ResultScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: colors.background },
          animationEnabled: true,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ animationTypeForReplace: 'pop' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{ animation: 'fade' }}
        />
        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={{ animation: 'fade' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
