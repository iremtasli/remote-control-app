
// MapScreen.tsx

import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
//import { publishMessage } from './src/Mqtt'; // MQTT fonksiyonlarını içe aktarın (mqtt dosyanızın adını ve yolunu düzenleyin)

const MapScreen = () => {
  const [direction, setDirection] = useState('');

  const sendDirectionMessage = () => {
    // Belirli bir aralıkta MQTT mesajını gönderen fonksiyon
    const intervalId = setInterval(() => {
      publishMessage(direction); // Yön mesajını MQTT üzerinden gönder
    }, 250); // 250 milisaniyede bir mesaj gönder

    // Basılı tutma bittiğinde interval'ı temizle
    const clearInterval = () => {
      clearInterval(intervalId);
      publishMessage('STOP'); // Durdurma mesajını MQTT üzerinden gönder
    };

    return clearInterval;
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Map Screen</Text>
      <View style={{ flexDirection: 'row' }}>
        {/* İleri Tuşu */}
        <TouchableOpacity
          onPressIn={() => {
            setDirection('FORWARD');
            sendDirectionMessage();
          }}
          onPressOut={() => setDirection('STOP')}>
          <Text>↑</Text>
        </TouchableOpacity>

        {/* Geri Tuşu */}
        <TouchableOpacity
          onPressIn={() => {
            setDirection('BACKWARD');
            sendDirectionMessage();
          }}
          onPressOut={() => setDirection('STOP')}>
          <Text>↓</Text>
        </TouchableOpacity>

        {/* Sol Tuşu */}
        <TouchableOpacity
          onPressIn={() => {
            setDirection('LEFT');
            sendDirectionMessage();
          }}
          onPressOut={() => setDirection('STOP')}>
          <Text>←</Text>
        </TouchableOpacity>

        {/* Sağ Tuşu */}
        <TouchableOpacity
          onPressIn={() => {
            setDirection('RIGHT');
            sendDirectionMessage();
          }}
          onPressOut={() => setDirection('STOP')}>
          <Text>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MapScreen;
