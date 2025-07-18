import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import Meal from './pages/Meal/Meal';
import Detail from './pages/Detail';
import Category from './pages/Category';

const Stack = createNativeStackNavigator();

function Router() {
  return (
    <NavigationContainer style={styles.container}>
      <Stack.Navigator>
        <Stack.Screen
          name="CategoryPage"
          component={Category}
          options={{
            title: 'Categories',
            headerTitleStyle: { color: 'orange' },
          }}
        />
        <Stack.Screen
          name="MealPage"
          component={Meal}
          options={{
            title: 'Meals',
            headerTitleStyle: { color: 'orange' },
            headerTintColor: 'orange',
          }}
        />
        <Stack.Screen
          name="DetailPage"
          component={Detail}
          options={{
            title: 'Detail',
            headerTitleStyle: { color: 'orange' },
            headerTintColor: 'orange',
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
