import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import Products from './pages/Products';
import Detail from './pages/Detail';

const Stack = createNativeStackNavigator();
function Router() {
  return (
    <NavigationContainer style={styles.container}>
      <Stack.Navigator>
        <Stack.Screen
          name="ProductsPage"
          component={Products}
          options={{
            title: 'Dükkan',
            headerStyle: { backgroundColor: '#64b5f6' },
            headerTitleStyle: { color: 'white' },
          }}
        />
        <Stack.Screen
          name="DetailPage"
          component={Detail}
          options={{
            title: 'Detay',
            headerStyle: { backgroundColor: '#64b5f6' },
            headerTitleStyle: { color: 'white' },
            headerTintColor: 'white',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Router;
