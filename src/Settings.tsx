import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import TutorialComponent from './TutorialComponent';
import FastImage from 'react-native-fast-image';

const Settings: React.FC = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(prevStep => prevStep + 1);
    } else {
      setShowTutorial(false);
    }
  };

  const handleShowTutorial = () => {
    setShowTutorial(true);
    setCurrentStep(1); // Tutorial başladığında adımı sıfırla
  };

  return (
    <View style={styles.container}>
      <FastImage
        style={styles.gif}
        source={require('../assets/connect3_gif.gif')}
        resizeMode={FastImage.resizeMode.contain}
      />
      {showTutorial ? (
        <TutorialComponent step={currentStep} onNextStep={handleNextStep} />
      ) : (
        <Button
          title="Show Tutorial"
          onPress={handleShowTutorial}
          color="olive"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'white'
  },
  gif: {
    width: 500,
    height: 500,
    marginBottom: 20,
  },
});

export default Settings;
