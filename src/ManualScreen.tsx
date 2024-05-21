import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import init from 'react_native_mqtt';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

const topics: string[] = ['testtopic/11212', 'testtopic/11213', 'testtopic/11214','testtopic/11215'];

const ManualScreen = () => {

  const [robotPosition, setRobotPosition] = useState({ x: 0, y: 0 });
  const [movementPath, setMovementPath] = useState([]);



  const handleReset = () => {
    publishMessage('Reset')

  };

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
    <View style={styles.container}>
      <Text style={styles.title}>Control Robot </Text>
      <View style={styles.buttonContainer}>
        <View style={styles.row}>
          <TouchableOpacity
            onPressIn={handleForwardPressIn}
            onPressOut={handleForwardPressOut}
            style={[styles.button, { backgroundColor: 'lightblue' }]}>
            <Text style={styles.buttonText}>Forward</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            onPressIn={handleLeftPressIn}
            onPressOut={handleLeftPressOut}
            style={[styles.button, { backgroundColor: 'lightblue' }]}>
            <Text style={styles.buttonText}>Left</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPressIn={handleRightPressIn}
            onPressOut={handleRightPressOut}
            style={[styles.button, { backgroundColor: 'lightblue' }]}>
            <Text style={styles.buttonText}>Right</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            onPressIn={handleBackwardPressIn}
            onPressOut={handleBackwardPressOut}
            style={[styles.button, { backgroundColor: 'lightblue' }]}>
            <Text style={styles.buttonText}>Backward</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={handleAutoStart}
            style={[styles.button, { backgroundColor: 'lightcoral' }]}>
            <Text style={styles.buttonText}>Automatic</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleReset}
            style={[styles.button, { backgroundColor: 'lightcoral' }]}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'black',
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default ManualScreen;