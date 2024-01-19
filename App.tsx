// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DeviceAddScreen from './src/DeviceAddScreen';
import MapScreen from './src/MapScreen';
import AddTaskAreaScreen from './src/AddTaskAreaScreen';
import AddNoGoZoneScreen from './src/AddNoGoZoneScreen';
import AddChannelScreen from './src/AddChannelScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="DeviceAddScreen">
        <Stack.Screen name="DeviceAddScreen" component={DeviceAddScreen} />
        <Stack.Screen name="MapScreen" component={MapScreen} />
        <Stack.Screen name="AddTaskAreaScreen" component={AddTaskAreaScreen} />
        <Stack.Screen name="AddNoGoZoneScreen" component={AddNoGoZoneScreen} />
        <Stack.Screen name="AddChannelScreen" component={AddChannelScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
