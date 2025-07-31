import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import colors from './styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FlashMessage from 'react-native-flash-message';

import Login from './pages/auth/Login';
import Sign from './pages/auth/Sign';
import Room from './pages/messages/Room';
import Message from './pages/messages/Message';

const Stack = createNativeStackNavigator();
function App() {
  const [userSession, setUserSession] = useState();

  const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginPage" component={Login} />
      <Stack.Screen name="SignPage" component={Sign} />
    </Stack.Navigator>
  );
  return (
    <NavigationContainer>
      {userSession ? (
        <AuthStack />
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="RoomScreen"
            component={Room}
            options={{
              title: 'Odalar',
              headerTintColor: colors.primary,
            }}
          />
          <Stack.Screen
            name="MessageScreen"
            component={Message}
            options={{
              title: 'Chat',
              headerTintColor: colors.primary,
              headerRight: () => (
                <Icon
                  name="logout"
                  color={colors.primary}
                  size={25}
                  onPress={null}
                />
              ),
            }}
          />
        </Stack.Navigator>
      )}
      <FlashMessage position="top" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
