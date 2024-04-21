import React from 'react';
import { View, Button } from 'react-native';

const AddTaskAreaScreen = ({ navigation }) => {
  const goToAutomaticScreen = () => {
    navigation.navigate('AutomaticScreen');
  };

  const goToManualScreen = () => {
    navigation.navigate('ManualScreen');
  };

  return (
    <View>
      <Button title="Automatic" onPress={goToAutomaticScreen} />
      <Button title="Manual" onPress={goToManualScreen} />
    </View>
  );
};

export default AddTaskAreaScreen;