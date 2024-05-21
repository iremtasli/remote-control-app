import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import TutorialComponent from './TutorialComponent';

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
      {showTutorial ? (
        <TutorialComponent step={currentStep} onNextStep={handleNextStep} />
      ) : (
        <Button title="Show Tutorial" onPress={handleShowTutorial} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Settings;
