import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CharactersScreen from '../screens/main/CharactersScreen';
import ComicsScreen from '../screens/main/ComicsScreen';
import FavoritesScreen from '../screens/main/FavoritesScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import { createStackNavigator } from '@react-navigation/stack';
import CharacterDetailScreen from '../screens/detail/CharacterDetailScreen';
import ComicDetailScreen from '../screens/detail/ComicDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const CharactersStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CharactersList" component={CharactersScreen} />
      <Stack.Screen name="CharacterDetail" component={CharacterDetailScreen} />
    </Stack.Navigator>
  );
};
const ComicsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ComicsList" component={ComicsScreen} />
      <Stack.Screen name="ComicDetail" component={ComicDetailScreen} />
    </Stack.Navigator>
  );
};

const FavoritesStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FavoritesList" component={FavoritesScreen} />
      <Stack.Screen name="CharacterDetail" component={CharacterDetailScreen} />
      <Stack.Screen name="ComicDetail" component={ComicDetailScreen} />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a1a2e',
          borderTopColor: '#e74c3c',
          borderTopWidth: 1,
          height: 60,
          paddingHorizontal: 5,
        },
        tabBarActiveTintColor: '#e74c3c',
        tabBarInactiveTintColor: '#8e8e93',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Characters':
              iconName = 'people';
              break;
            case 'Comics':
              iconName = 'book';
              break;
            case 'Favorites':
              iconName = 'favorite';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'help';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Characters" component={CharactersStack} />
      <Tab.Screen name="Comics" component={ComicsStack} />
      <Tab.Screen name="Favorites" component={FavoritesStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
