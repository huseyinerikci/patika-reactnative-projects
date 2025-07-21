import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { StyleSheet } from 'react-native';
import Products from './pages/Products';
import Detail from './pages/Detail';
import Login from './pages/Login';
import Loader from './components/Loader';
import { useDispatch, useSelector } from 'react-redux';

const Stack = createNativeStackNavigator();
function Router() {
  const userSession = useSelector(state => state.user);
  const isAuthLoading = useSelector(state => state.isAuthLoading);
  const dispatch = useDispatch();

  return (
    <NavigationContainer style={styles.container}>
      {isAuthLoading ? (
        <Loader />
      ) : !userSession ? (
        <Stack.Navigator>
          <Stack.Screen
            name="LoginPage"
            component={Login}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="ProductsPage"
            component={Products}
            options={{
              title: 'Dükkan',
              headerStyle: { backgroundColor: '#64b5f6' },
              headerTitleStyle: { color: 'white' },
              headerTintColor: 'white',
              headerRight: () => (
                <Icon
                  name="right-from-bracket"
                  size={26}
                  color="white"
                  onPress={() => dispatch({ type: 'REMOVE_USER' })}
                />
              ),
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
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Router;
