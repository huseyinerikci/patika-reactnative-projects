import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Login from './pages/auth/Login';
import Sign from './pages/auth/Sign';
import FlashMessage from 'react-native-flash-message';
import Messages from './pages/Messages';
import colors from './styles/color';

const Stack = createNativeStackNavigator();
function App() {
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
      <Stack.Navigator>
        <Stack.Screen
          name="MessagesScreen"
          component={Messages}
          options={{ title: 'Chat', headerTintColor: colors.drakgreen }}
        />
        <Stack.Screen name="AuthStack" component={AuthStack} />
      </Stack.Navigator>
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
