// AddNoGoZoneScreen.js

import React from 'react';
import { View, Text, Button } from 'react-native';

const AddNoGoZoneScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Add No-Go Zone Screen</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default AddNoGoZoneScreen;
