// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DeviceAddScreen from './src/DeviceAddScreen';
import MapScreen from './src/MapScreen';
import AddTaskAreaScreen from './src/AddTaskAreaScreen';
import AutomaticScreen from './src/AutomaticScreen';
import ManualScreen from './src/ManualScreen';
import Settings from './src/Settings';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="DeviceAddScreen">
        <Stack.Screen name="DeviceAddScreen" component={DeviceAddScreen} />
        <Stack.Screen name="AutomaticScreen" component={AutomaticScreen} />
        <Stack.Screen name="ManualScreen" component={ManualScreen} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="MapScreen" component={MapScreen} />
        <Stack.Screen name="AddTaskAreaScreen" component={AddTaskAreaScreen} />
     
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
