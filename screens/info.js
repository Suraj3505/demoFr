import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import DATA from '../components/globalData';
const Info = ({ navigation }) => {
  const pressHandler = () => {
    navigation.navigate('PanCard');
  };

  const instructions = `1. First, scan the pan card with the back camera. Once the face on the pan card is detected capture button will appear. Click on the capture button. It will take a photo and navigate to the next screen. \n\n 2. Follow the same procedure with the face. Once a face is captured it will start the comparison.
  `
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Information about face verification</Text>
      <Text style={styles.instructions}>{instructions}</Text>
      <Button style={styles.btn} title="Continue" onPress={pressHandler} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  headerText: {
    marginBottom: 20,
    fontSize: 20
  },
  btn: {

  },
  instructions: {
    fontSize: 18,
    textAlign: 'justify',
    lineHeight: 25,
  }
});

export default Info;
