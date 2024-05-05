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

  //forward

  let forwardTimeout = null;

  const handleForwardPressIn = () => {
    forwardTimeout = setTimeout(() => {
      publishMessage('f');
    }, 0); // İlk basılı tutulduğu anda mesajı gönder
  };

  const handleForwardPressOut = () => {
    clearTimeout(forwardTimeout);
    publishMessage('s');
  };
  // backward

  let backwardTimeout = null;

  const handleBackwardPressIn = () => {
    backwardTimeout = setTimeout(() => {
      publishMessage('b');
    }, 0);
  };

  const handleBackwardPressOut = () => {
    clearTimeout(backwardTimeout);
    publishMessage('s');
  };

// left

  let leftTimeout = null;

  const handleLeftPressIn = () => {
    leftTimeout = setTimeout(() => {
      publishMessage('l');
    }, 0);
  };

  const handleLeftPressOut = () => {
    clearTimeout(leftTimeout);
    publishMessage('s');
  };

//right 

  let rightTimeout = null;

  const handleRightPressIn = () => {
    rightTimeout = setTimeout(() => {
      publishMessage('r');
    }, 0);
  };

  const handleRightPressOut = () => {
    clearTimeout(rightTimeout);
    publishMessage('s');
  };

  const handleAutoStart = () => {
    publishMessage('automatic'); // Automatic kesimi başlat
  };


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Manual Control</Text>
      <View style={{ flexDirection: 'column', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity
            onPressIn={handleForwardPressIn}
            onPressOut={handleForwardPressOut}
            style={styles.button}>
            <Text>Forward</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPressIn={handleBackwardPressIn}
            onPressOut={handleBackwardPressOut}
            style={styles.button}>
            <Text>Backward</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPressIn={handleLeftPressIn}
            onPressOut={handleLeftPressOut}
            style={styles.button}>
            <Text>Left</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPressIn={handleRightPressIn}
            onPressOut={handleRightPressOut}
            style={styles.button}>
            <Text>Right</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
        <Button title="Automatic" onPress={handleAutoStart} />
      </View>

        </View>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
});

export default ManualScreen;
