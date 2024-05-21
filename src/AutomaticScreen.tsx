import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import init from 'react_native_mqtt';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

const topics: string[] = ['testtopic/11212', 'testtopic/11213', 'testtopic/11214','testtopic/11215'];

const AutomaticScreen = () => {
  const [selectedSize, setSelectedSize] = useState(' ');
  const [selectedVacuum, setSelectedVacuum] = useState(' ');
  const [latestSelections, setLatestSelections] = useState({
    size: selectedSize,
    vacuum: selectedVacuum,
  });

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const handleVacuumChange = (vacuum) => {
    setSelectedVacuum(vacuum);
  };

  const handleSaveSettings = async () => {
    try {
      await AsyncStorage.setItem('selectedSize', selectedSize);
      await AsyncStorage.setItem('selectedVacuum', selectedVacuum);
      alert('Settings saved successfully!');
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  };

  useEffect(() => {
    const message = latestSelections.size;
    publishMessage(message);
  }, [latestSelections.size]);

  useEffect(() => {
    const message = latestSelections.vacuum;
    publishMessage(message);
  }, [latestSelections.vacuum]);

  function onConnect() {
    Toast.show({
      type: 'success',
      text1: 'Bağlantı Başarılı',
      text2: 'Cihaz Eklendi',
      visibilityTime: 2000,
    });
  }

  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage);
    }
  }

  async function connectToMqtt() {
    const client = new Paho.MQTT.Client('broker.hivemq.com', 8000, 'uname');
    client.onMessageArrived = onMessageArrived;
    client.connect({
      onSuccess: () => {
        topics.forEach((topic) => client.subscribe(topic));
      },
      useSSL: false,
    });
  }

  function onMessageArrived(message) {
    const mqttMessage = message.payloadString;

    if (mqttMessage === 'oto') {
      onConnect();
    }
  }

  async function publishMessage(message) {
    const client = new Paho.MQTT.Client('broker.hivemq.com', 8000, 'uname');
    client.connect({
      onSuccess: () => {
        const mqttMessage = new Paho.MQTT.Message(message);
        mqttMessage.destinationName = topics[0];
        client.send(mqttMessage);
        client.disconnect();
      },
      useSSL: false,
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Select Cutting Size:</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, selectedSize === '10' && styles.selectedButton]}
          onPress={() => {
            setSelectedSize('10');
            setLatestSelections({ ...latestSelections, size: '10' });
          }}
        >
          <Text style={styles.buttonText}>10 cm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selectedSize === '20' && styles.selectedButton]}
          onPress={() => {
            setSelectedSize('20');
            setLatestSelections({ ...latestSelections, size: '20' });
          }}
        >
          <Text style={styles.buttonText}>20 cm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selectedSize === '30' && styles.selectedButton]}
          onPress={() => {
            setSelectedSize('30');
            setLatestSelections({ ...latestSelections, size: '30' });
          }}
        >
          <Text style={styles.buttonText}>30 cm</Text>
        </TouchableOpacity>
      </View>
  
      <Text style={styles.label}>Select Vacuum Situation:</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, selectedVacuum === 'Enable' && styles.selectedButton]}
          onPress={() => {
            setSelectedVacuum('Enable');
            setLatestSelections({ ...latestSelections, vacuum: 'Enable' });
          }}
        >
          <Text style={styles.buttonText}>Enable</Text>
        </TouchableOpacity>
  
        <TouchableOpacity
          style={[styles.button, selectedVacuum === 'Disable' && styles.selectedButton]}
          onPress={() => {
            setSelectedVacuum('Disable');
            setLatestSelections({ ...latestSelections, vacuum: 'Disable' });
          }}
        >
          <Text style={styles.buttonText}>Disable</Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={handleSaveSettings}
            style={[styles.button, { backgroundColor: 'lightgreen' }]}>
            <Text style={styles.buttonText}>Save Settings</Text>
          </TouchableOpacity>
          </View>
    </ScrollView>
  );
};  

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'lightblue',
    paddingVertical: 10,
    paddingHorizontal: 30,
    margin: 5,
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default AutomaticScreen;