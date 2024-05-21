import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import InfoScreen from './src/InfoScreen';
import Settings from './src/Settings';
import DeviceAddScreen from './src/DeviceAddScreen';
import AddTaskAreaScreen from './src/AddTaskAreaScreen';
import AutomaticScreen from './src/AutomaticScreen';
import ManualScreen from './src/ManualScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AddTaskAreaStack() {
  return (
    <Stack.Navigator initialRouteName="AddTaskAreaScreen">
      <Stack.Screen
        name="AddTaskAreaScreen"
        component={AddTaskAreaScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="AutomaticScreen" component={AutomaticScreen} />
      <Stack.Screen name="ManualScreen" component={ManualScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Tutorial"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'Information') {
            iconName = focused ? 'information-circle' : 'information-circle-outline';
          } else if (route.name === 'Control') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'olive',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Tutorial" component={Settings} />
      <Tab.Screen name="Control" component={AddTaskAreaStack} options={{ headerShown: false }} />
      <Tab.Screen name="Information" component={InfoScreen} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="DeviceAddScreen">
        <Stack.Screen 
          name="DeviceAddScreen" 
          component={DeviceAddScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Main" 
          component={MainTabs} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
