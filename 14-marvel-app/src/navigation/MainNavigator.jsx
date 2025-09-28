import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CharactersScreen from '../screens/main/CharactersScreen';
import ComicsScreen from '../screens/main/ComicsScreen';
import FavoritesScreen from '../screens/main/FavoritesScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const Tab = createBottomTabNavigator();

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
      <Tab.Screen name="Characters" component={CharactersScreen} />
      <Tab.Screen name="Comics" component={ComicsScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
