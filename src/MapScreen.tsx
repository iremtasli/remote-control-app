import React, { useEffect, useRef, useState } from 'react';
import { ToastAndroid, View, SafeAreaView, StatusBar, StyleSheet, useColorScheme, PanResponder, Dimensions } from 'react-native';
import init from 'react_native_mqtt';

import { useFocusEffect } from '@react-navigation/native';
import Svg, { Line, Circle, Text } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
const window = Dimensions.get('window');

function MapScreen({ navigation }) {
  const isDarkMode = useColorScheme() === 'dark';
  const [lines, setLines] = useState([]);
  const topics = ['testtopic/11212', 'testtopic/11213', 'testtopic/11214'];

  const joystickRadius = 50;

  const panResponderStart = { x: 0, y: 0 };
  const [lastLineEnd, setLastLineEnd] = useState({ x: 0, y: 0 });
  const [startingPoint, setStartingPoint] = useState({ x: window.width / 2, y: window.height / 2 });

 

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event, gestureState) => {
        isPanResponderActive = true;
        handleJoystickMove(gestureState.moveX, gestureState.moveY);
      },
      onPanResponderMove: (event, gestureState) => {
        handleJoystickMove(gestureState.moveX, gestureState.moveY);
      },
      onPanResponderRelease: () => {
        isPanResponderActive = false;
        handleJoystickRelease();
      },
    })
  ).current;

  const addLine = (x1, y1, x2, y2) => {
    setLines((prevLines) => [
      ...prevLines,
      {
        x1,
        y1,
        x2,
        y2,
        stroke: 'red',
        strokeWidth: 2,
      },
    ]);
  };

  init({
    size: 10000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    reconnect: true,
    sync: {},
  });

  const client = new Paho.MQTT.Client('broker.hivemq.com', 8000, 'uname');
  client.onMessageArrived = onMessageArrived;
  client.onConnectionLost = onConnectionLost;

  useEffect(() => {
    connectToMqtt();
  }, []);

  function onConnect() {
    ToastAndroid.showWithGravityAndOffset(
      'Ready to move\nCihaz başladı',
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  }

  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage);
    }
  }

  function onMessageArrived(message) {
    const mqttMessage = message.payloadString;

    if (mqttMessage === 'x0y0=0') {
      onConnect();
    }
  }

  async function connectToMqtt() {
    client.connect({
      onSuccess: () => {
        topics.forEach((topic) => client.subscribe(topic));
      },
      useSSL: false,
    });
  }

  async function publishMessage(direction, rotation) {
    const message = `direction=${direction}&rotation=${rotation}`;
    try {
      if (client.isConnected()) {
        const mqttMessage = new Paho.MQTT.Message(message);
        mqttMessage.destinationName = topics[0];
        client.send(mqttMessage);
      } else {
        console.log('MQTT not connected');
      }
    } catch (error) {
      console.log('Error:', error);
    }
  }

  function handleJoystickRelease() {
    // PanResponder bırakıldığında, başlangıç noktasını sadece son çizginin bitiş noktasına eşitle
    if (lines.length > 0) {
      const lastLine = lines[lines.length - 1];
      panResponderStart.x = lastLine.x2;
      panResponderStart.y = lastLine.y2;
      setLastLineEnd({ x: lastLine.x2, y: lastLine.y2 });
    }
  }


  function handleJoystickMove(moveX, moveY) {
    const deltaX = moveX - panResponderStart.x;
    const deltaY = moveY - panResponderStart.y;

    const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
    const direction =
      angle >= 45 && angle < 135
        ? 'geri'
        : angle >= 135 && angle < 225
        ? 'sola'
        : angle >= 225 && angle < 315
        ? 'ileri'
        : 'saga';

    const rotation = angle; // Dönüş derecesi

    const newX1 = panResponderStart.x;
    const newY1 = panResponderStart.y;
    const newX2 = moveX;
    const newY2 = moveY;

    addLine(newX1, newY1, newX2, newY2);
    publishMessage(direction, rotation);

    panResponderStart.x = newX2;
    panResponderStart.y = newY2;
    setLastLineEnd({ x: newX2, y: newY2 }); // Son çizginin bitiş noktasını güncelle
  }
  
  

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? 'black' : 'white' }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? 'black' : 'white'}
      />
      <View style={styles.contentContainer}>
        <Svg height="100%" width="100%" style={{ position: 'absolute' }}>
      {lines.map((line, index) => (
        <Line key={index} {...line} />
      ))}
      <Circle
        cx={startingPoint.x}
        cy={startingPoint.y}
        r={joystickRadius}
        fill="rgba(0, 0, 255, 0.5)"
        {...panResponder.panHandlers}
      />
      <Text x="50%" y="5%" textAnchor="middle" fill="white" fontSize="16">
        Harita Başlığı
      </Text>
    </Svg>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapScreen;
