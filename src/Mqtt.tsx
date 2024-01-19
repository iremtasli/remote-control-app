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