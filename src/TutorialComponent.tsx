import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface TutorialComponentProps {
  step: number;
  onNextStep: () => void;
}

const TutorialComponent: React.FC<TutorialComponentProps> = ({ step, onNextStep }) => {
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <Text style={styles.text}>1- When the app first opens, click on the 'Connect to Turfinator' button and make sure you are connected to the robot.</Text>;
      case 2:
        return <Text style={styles.text}>2- If the connection is successful, click the 'Add Task Area' button on the tab bar on the incoming page.</Text>;
      case 3:
        return <Text style={styles.text}>3- If the connection is not successful, exit the app, delete the app from your phone's history and log in again.</Text>;
      case 4:
        return <Text style={styles.text}>4- After clicking the 'add task area' button on the tab bar, click the 'Manage Settings' button first.</Text>;
      case 5:
        return <Text style={styles.text}>5- On the screen that appears, select the grass height and vacuuming status you want to cut and save your selections.</Text>;  
      case 6:
        return <Text style={styles.text}>6- Go back and click on the 'Start Motion' button to start controlling your robot from this screen.</Text>;
          default:
        return <Text style={styles.text}>Tutorial tamamlandı!</Text>;
    }
  };

  return (
    <View style={styles.container}>
      {renderStepContent()}
      {step < 7 && <Button title="Next" 
      onPress={onNextStep}
      color="olive"  />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    color:'black'
  },
});

export default TutorialComponent;
