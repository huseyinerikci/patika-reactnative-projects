import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { RootState } from '../store';
import { RootStackParamList } from '../types';
import { theme } from '../theme';

// Auth Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Main Screens
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddPostScreen from '../screens/AddPostScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import BookDetailScreen from '../screens/BookDetailScreen';
// removed custom tab button to avoid misalignment
import { SafeAreaView } from 'react-native-safe-area-context';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: theme.colors.background },
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarShowLabel: true,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: string;

        switch (route.name) {
          case 'Home':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Search':
            iconName = focused ? 'magnify' : 'magnify';
            break;
          case 'AddPost':
            iconName = 'plus-circle';
            break;
          case 'Profile':
            iconName = focused ? 'account' : 'account-outline';
            break;
          default:
            iconName = 'circle';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: theme.colors.placeholder,
      tabBarStyle: {
        backgroundColor: theme.colors.surface,
        borderTopColor: theme.colors.border,
        height: 70,
        paddingTop: 4,
        paddingBottom: 10,
      },
      tabBarItemStyle: { paddingVertical: 6 },
      tabBarIconStyle: { marginTop: 0 },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
      },
      headerShown: false,
    })}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarLabel: 'Ana Sayfa',
      }}
    />
    <Tab.Screen
      name="Search"
      component={SearchScreen}
      options={{
        tabBarLabel: 'Ara',
      }}
    />
    <Tab.Screen
      name="AddPost"
      component={AddPostScreen}
      options={{
        tabBarLabel: 'Paylaş',
        tabBarIcon: ({ color, size }) => (
          <Icon name="plus-circle" size={size} color={color} />
        ),
      }}
    />

    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarLabel: 'Profil',
      }}
    />
  </Tab.Navigator>
);

const MainStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.surface,
        elevation: 2,
        shadowOpacity: 0.1,
      },
      headerTintColor: theme.colors.text,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
      cardStyle: { backgroundColor: theme.colors.background },
    }}
  >
    <Stack.Screen
      name="Main"
      component={MainTabNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="AddPost"
      component={AddPostScreen}
      options={{
        title: 'Yeni Gönderi',
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="PostDetail"
      component={PostDetailScreen}
      options={{
        title: 'Gönderi Detayı',
      }}
    />
    <Stack.Screen
      name="UserProfile"
      component={UserProfileScreen}
      options={{
        title: 'Profil',
      }}
    />
    <Stack.Screen
      name="BookDetail"
      component={BookDetailScreen}
      options={{
        title: 'Kitap Detayı',
      }}
    />
  </Stack.Navigator>
);

const RootNavigator = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={['top', 'bottom']}
    >
      <NavigationContainer>
        {isAuthenticated ? <MainStack /> : <AuthStack />}
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default RootNavigator;
