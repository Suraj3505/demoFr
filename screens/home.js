import React, { useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';

export default function Home({ navigation }) {
  const pressHandler = () => {
    const userName = 'fplabs_test';
    const passWord = 'W9chAfr&bAthlf0owlWr';
    console.log(userName, passWord);
    // navigation.navigate('faceDetect');

    fetch('https://preproduction.signzy.tech/api/v2/patrons/login', {
      method: 'POST',
      headers: {
        'Accept-language': 'en-US,en;q=0.8',
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        username: userName,
        password: passWord,
      }),
    })
      .then(resp => resp.json())
      .then(data => {
        console.log(data);
        navigation.navigate('faceDetect', { loginData: data });
      })
      .catch(err => console.log(err));
  };

  const pressHandlerWithOutSignZy = () => {
    navigation.navigate('faceDetect', { loginData: null });
  };
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Button style={styles.btn} title="open camera" onPress={pressHandler} />
      <Text> </Text>
      <Button
        style={styles.btn}
        title="open camera 2"
        onPress={pressHandlerWithOutSignZy}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    // backgroundColor: 'red',
  },
  btn: {},
});
