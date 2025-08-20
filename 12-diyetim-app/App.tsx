import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { store, persistor } from './src/store';

import HomeScreen from './src/screens/HomeScreen';
import PlanScreen from './src/screens/PlanScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import ReportScreen from './src/screens/ReportScreen';
import ReminderScreen from './src/screens/ReminderScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarIcon: ({ focused, color, size }) => {
                let iconName = '';

                switch (route.name) {
                  case 'Ana Sayfa':
                    iconName = focused ? 'home' : 'home-outline';
                    break;
                  case 'Planla':
                    iconName = focused ? 'playlist-plus' : 'playlist-plus';
                    break;
                  case 'Hatırlatıcı':
                    iconName = focused ? 'alarm' : 'alarm';
                    break;
                  case 'Geçmiş':
                    iconName = focused ? 'history' : 'history';
                    break;
                  case 'Raporlar':
                    iconName = focused ? 'chart-bar' : 'chart-bar';
                    break;
                  default:
                    iconName = 'circle';
                }

                return <Icon name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#007bff',
              tabBarInactiveTintColor: 'gray',
            })}
          >
            <Tab.Screen name="Ana Sayfa" component={HomeScreen} />
            <Tab.Screen name="Planla" component={PlanScreen} />
            <Tab.Screen name="Hatırlatıcı" component={ReminderScreen} />
            <Tab.Screen name="Geçmiş" component={HistoryScreen} />
            <Tab.Screen name="Raporlar" component={ReportScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
