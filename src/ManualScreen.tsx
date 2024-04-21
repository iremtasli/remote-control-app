import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import init from 'react_native_mqtt';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

const topics: string[] = ['testtopic/11212', 'testtopic/11213', 'testtopic/11214'];


const ManualScreen = () => {

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
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Manual Control</Text>
      <View style={{ flexDirection: 'column', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Button title="Forward" onPress={() => publishMessage('f')} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button title="Left" onPress={() => publishMessage('l')} />
          <Button title="Stop" onPress={() => publishMessage('s')} />
          <Button title="Right" onPress={() => publishMessage('r')} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Button title="Backward" onPress={() => publishMessage('b')} />
        </View>
      </View>
    </View>
  );
};

export default ManualScreen;
