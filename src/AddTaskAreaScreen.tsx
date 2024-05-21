import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AddTaskAreaScreen = ({ navigation }) => {
  const goToAutomaticScreen = () => {
    navigation.navigate('AutomaticScreen');
  };

  const goToManualScreen = () => {
    navigation.navigate('ManualScreen');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goToAutomaticScreen} style={styles.button}>
        <Text style={styles.buttonText}>Manage Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={goToManualScreen} style={styles.button}>
        <Text style={styles.buttonText}>Start Motion</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'olive',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddTaskAreaScreen;
