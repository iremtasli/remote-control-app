import React, { useEffect, useState } from 'react';
import init from 'react_native_mqtt';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { Button, SafeAreaView, StatusBar, StyleSheet, Text, useColorScheme, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const topics: string[] = ['testtopic/11212', 'testtopic/11213', 'testtopic/11214', 'testtopic/11215'];

type SectionProps = React.PropsWithChildren<{
  title: string;
}>;

function Section({ children, title }: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function DeviceAddScreen({ navigation }): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';

  const handlePress = () => {
    setIsLoading(true);
    publishMessage('CONNECT');
  };

  const [topicMessage, setTopicMessage] = useState('.');
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
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
    Toast.show({
      type: 'success',
      text1: 'Bağlantı Başarılı',
      text2: 'Cihaz Eklendi',
      visibilityTime: 2000,
    });

    navigation.navigate('Main'); // Main stack'ine yönlendirin
  }

  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage);
    }
  }

  function onMessageArrived(message) {
    const mqttMessage = message.payloadString;

    if (mqttMessage === 'ok') {
      onConnect();
      setIsLoading(false);
      Toast.show({
        type: 'success',
        text1: 'Bağlantı Başarılı',
        text2: 'Cihaz Eklendi',
        visibilityTime: 2000,
      });
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

  async function publishMessage(message: string, retryCount = 3) {
    try {
      if (client.isConnected()) {
        const mqttMessage = new Paho.MQTT.Message(message);
        mqttMessage.destinationName = topics[0]; // Örnek olarak sadece ilk topic'e yayın yapılıyor
        client.send(mqttMessage);
      } else {
        console.log('MQTT not connected');
      }
    } catch (error) {
      console.log('Error:', error);

      if (retryCount > 0) {
        setTimeout(() => {
          publishMessage(message, retryCount - 1);
        }, 1000);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Hata',
          text2: 'Tekrar Denemeleri Başarısız',
          visibilityTime: 2000,
        });
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.sectionContainer}>
          <Text style={styles.title}>CONNECT TO YOUR DEVICE</Text>
          <Section>
            <TouchableOpacity style={styles.addButton} onPress={handlePress}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Connect to Turfinator</Text>
              )}
            </TouchableOpacity>
          </Section>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title:{
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: 'lightblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default DeviceAddScreen;
