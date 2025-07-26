import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Login from './pages/auth/Login';
import Sign from './pages/auth/Sign';

const Stack = createNativeStackNavigator();
function App() {
  const AuthStack = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginPages" component={Login} />
        <Stack.Screen name="SignPages" component={Sign} />
      </Stack.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginPage" component={AuthStack} />
        {/* <Stack.Screen name="SignPages" component={Sign} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
