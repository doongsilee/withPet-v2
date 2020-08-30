import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Image, Platform } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import HomeScreen from '../screens/HomeScreen';
import MyPageScreen from '../screens/MyPageScreen';
import StoreDetailScreen from '../screens/StoreDetailScreen';
import {
  BottomTabParamList,
  HomeParamList,
  MyPageStackParamList,
} from '../types';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  const tabHeight = Platform.OS === 'ios' ? 80 : 50;

  return (
    <BottomTab.Navigator
      initialRouteName="HomeStack"
      tabBarOptions={{
        activeTintColor: Colors[colorScheme].tint,
        style: { height: tabHeight },
      }}>
      <BottomTab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              style={{ height: 20, width: 20, tintColor: color }}
              source={require('../assets/images/pets_tab_01_on.png')}
            />
          ),
          tabBarLabel: '댕댕여지도',
        }}
      />
      <BottomTab.Screen
        name="MyPageStack"
        component={MyPageStackNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              size={30}
              style={{ marginBottom: -3 }}
              name="account-box"
              color={color}
            />
          ),
          tabBarLabel: '마이페이지',
        }}
      />
    </BottomTab.Navigator>
  );
}

// // You can explore the built-in icon families and icons on the web at:
// // https://icons.expo.fyi/
// function TabBarIcon(props: { name: string; color: string }) {
//   return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
// }

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const HomeStack = createStackNavigator<HomeParamList>();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator initialRouteName="Home">
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="StoreDetail"
        component={StoreDetailScreen}
        options={{}}
      />
    </HomeStack.Navigator>
  );
}

const MyPageStack = createStackNavigator<MyPageStackParamList>();

function MyPageStackNavigator() {
  return (
    <MyPageStack.Navigator>
      <MyPageStack.Screen
        name="MyPageScreen"
        component={MyPageScreen}
        options={{ headerTitle: '마이페이지' }}
      />
    </MyPageStack.Navigator>
  );
}
