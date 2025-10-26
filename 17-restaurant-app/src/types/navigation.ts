import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { Restaurant } from './restaurant';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// Stack Navigator Params
export type HomeStackParamList = {
  HomeMain: undefined;
  RestaurantDetail: { restaurant: Restaurant };
};

export type MapStackParamList = {
  MapMain: { restaurants?: Restaurant[]; searchQuery?: string } | undefined;
  RestaurantDetail: { restaurant: Restaurant };
};

// Bottom Tab Navigator Params
export type TabParamList = {
  Home: undefined;
  Map: undefined;
};

// Navigation Props
export type HomeScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<HomeStackParamList, 'HomeMain'>,
  BottomTabNavigationProp<TabParamList>
>;

export type MapScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MapStackParamList, 'MapMain'>,
  BottomTabNavigationProp<TabParamList>
>;

export type RestaurantDetailRouteProp = RouteProp<
  HomeStackParamList | MapStackParamList,
  'RestaurantDetail'
>;
