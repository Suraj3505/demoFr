import React, {useState} from 'react';
import {StyleSheet, View, Text, Image, ScrollView} from 'react-native';

export default function FaceRec({navigation}) {
  const [picture, setPicture] = useState(navigation.getParam('image'));
  const first = navigation.getParam('firstPicture');
  const second = navigation.getParam('secondPicture');
  return (
    <ScrollView style={styles.container}>
      <Text>Face Rec Screen</Text>
      <Text>First: {first}</Text>
      <Image style={styles.preview} source={{uri: first}} />
      <Text>Second: {second}</Text>
      <Image style={styles.preview} source={{uri: second}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  preview: {
    width: 320,
    height: 500,
  },
});
