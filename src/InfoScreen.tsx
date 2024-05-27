import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InfoScreen = () => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedVacuum, setSelectedVacuum] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const size = await AsyncStorage.getItem('selectedSize');
        const vacuum = await AsyncStorage.getItem('selectedVacuum');
        setSelectedSize(size || 'N/A');
        setSelectedVacuum(vacuum || 'N/A');
      } catch (error) {
        console.log('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={[styles.infoText, styles.sizeText]}>Selected Cutting Size: {selectedSize}</Text>
      <Text style={[styles.infoText, styles.vacuumText]}>Vacuum Situation: {selectedVacuum}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5dc', // Arka plan rengi (bej)
    padding: 20,
  },
  infoText: {
    fontSize: 20,
    marginVertical: 15,
    padding: 10,
    borderRadius: 10,
    textAlign: 'center',
    width: '90%',
  },
  sizeText: {
    backgroundColor: 'olive', // Kesim boyutu arka plan rengi
    color: 'white', // Kesim boyutu metin rengi
  },
  vacuumText: {
    backgroundColor: 'sienna', // Vakum durumu arka plan rengi
    color: 'white', // Vakum durumu metin rengi
  },
});

export default InfoScreen;
