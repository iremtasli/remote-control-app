import React, { useEffect, useState } from 'react';
import init from 'react_native_mqtt';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { Button, SafeAreaView, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const topics: string[] = ['testtopic/11212', 'testtopic/11213', 'testtopic/11214'];

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
  const isDarkMode = useColorScheme() === 'dark';

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

    navigation.navigate('AddTaskAreaScreen');
  }

  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage);
    }
  }

  function onMessageArrived(message) {
    const mqttMessage = message.payloadString;

    if (mqttMessage === 'okay') {
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
    <SafeAreaView style={[styles.container, styles.backgroundWhite]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={Colors.white} />
      <View style={styles.contentContainer}>
        <View style={styles.sectionContainer}>
          <Section title='Add Device'>
            <View style={styles.buttonContainer}>
              <Button title='Add Device' onPress={() => publishMessage('CONNECT')} />
            </View>
          </Section>
        </View>
      </View>
      <Toast />
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
  },
  sectionContainer: {
    marginTop: 50,
    paddingHorizontal: 24,
    backgroundColor: Colors.white,
  },
  backgroundWhite: {
    backgroundColor: Colors.white,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  highlight: {
    fontWeight: '700',
  },
  buttonContainer: {
    marginTop: 10,
  },
  topicText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default DeviceAddScreen;