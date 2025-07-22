import 'react-native-reanimated';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Jobs from './pages/Jobs/Jobs';
import Favorite from './pages/Favorite/Favorite';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Detail from './pages/Detail';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function JobsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Jobs"
        component={Jobs}
        options={{
          headerTintColor: 'red',
          headerTitle: 'Jobs',
        }}
      />
      <Stack.Screen
        name="DetailPage"
        component={Detail}
        options={({ route }) => ({
          headerTintColor: 'red',
          headerTitle:
            route.params?.name?.length > 25
              ? route.params.name.slice(0, 25) + '...'
              : route.params?.name,
          headerTitleAlign: 'left',
        })}
      />
    </Stack.Navigator>
  );
}

function FavoriteStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Favorited Jobs"
        component={Favorite}
        options={{
          headerTintColor: 'red',
          headerTitle: 'Favorited Jobs',
        }}
      />
    </Stack.Navigator>
  );
}

function Router() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Drawer.Screen name="Jobs" component={JobsStack} />
        <Drawer.Screen name="Favorited Jobs" component={FavoriteStack} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Router;
