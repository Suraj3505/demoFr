import React from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';

export default function Home({navigation}) {
  const pressHandler = () => {
    navigation.navigate('faceDetect');
    // logIn();
  };

  const logIn = () => {
    const userName = 'fplabs_test';
    const passWord = 'W9chAfr&bAthlf0owlWr';
    fetch('https://preproduction.signzy.tech/api/v2/patrons/login', {
      method: 'POST',
      body: JSON.stringify({
        username: userName,
        password: passWord,
      }),
    })
      .then(resp => resp.json())
      .then(data => console.log(data));
  };
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Button title="open camera" onPress={pressHandler} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
});
