import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import Login from './pages/auth/Login';
import Sign from './pages/auth/Sign';
import FlashMessage from 'react-native-flash-message';
import Messages from './pages/Messages';
import colors from './styles/color';
import { useEffect, useState } from 'react';
import { getAuth } from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createNativeStackNavigator();
function App() {
  const [userSession, setUserSession] = useState();
  useEffect(() => {
    getAuth().onAuthStateChanged(user => {
      setUserSession(!!user);
    });
  }, []);
  const AuthStack = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginPage" component={Login} />
        <Stack.Screen name="SignPage" component={Sign} />
      </Stack.Navigator>
    );
  };

  return (
    <NavigationContainer>
      {!userSession ? (
        <AuthStack />
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="MessagesScreen"
            component={Messages}
            options={{
              title: 'Chat',
              headerTintColor: colors.drakgreen,
              headerRight: () => (
                <Icon
                  name="logout"
                  color={colors.drakgreen}
                  size={25}
                  onPress={() => getAuth().signOut()}
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
  },
});

export default App;
