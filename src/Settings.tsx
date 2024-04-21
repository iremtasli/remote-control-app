import React, { useState } from 'react';
import { View, Text, Button, Switch, Picker } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

    const Settings = () => {
    const [cuttingSize, setCuttingSize] = useState(10); // Default cutting size: 10 cm
    const [vacuum, setVacuum] = useState(false); // Default vacuum: false
  
    const saveSettings = async () => {
      try {
        // Kaydedilecek veri objesi
        const settings = {
          cuttingSize,
          vacuum,
        };
  
        // AsyncStorage kullanarak veriyi kaydetme
        await AsyncStorage.setItem('settings', JSON.stringify(settings));
  
        alert('Ayarlar kaydedildi!');
      } catch (error) {
        console.error('Ayarları kaydetme hatası:', error);
      }
    };
  
    return (
      <View>
        <Text>Choose cutting size:</Text>
        <Picker
          selectedValue={cuttingSize}
          onValueChange={(itemValue) => setCuttingSize(itemValue)}
        >
          <Picker.Item label="10 cm" value={10} />
          <Picker.Item label="20 cm" value={20} />
          <Picker.Item label="30 cm" value={30} />
          <Picker.Item label="40 cm" value={40} />
          <Picker.Item label="50 cm" value={50} />
        </Picker>
  
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text>Vacuum: </Text>
          <Switch
            value={vacuum}
            onValueChange={(value) => setVacuum(value)}
          />
        </View>
  
        <Button title="Save Settings" onPress={saveSettings} />
      </View>
    );
  };
  
  export default Settings