import React from 'react';
import {View, Text, ScrollView, Image, StyleSheet, Button} from 'react-native';

import DATA from '../components/globalData';

const Photos = ({navigation}) => {
  const first = DATA.panCardPicture.uri;
  const second = DATA.facePhoto.uri;
  const logout = () => {
    const loginData = DATA.loginData;
    const accessToken = loginData.id;
    console.log(accessToken);

    fetch(
      `https://preproduction.signzy.tech/api/v2/patrons/logout?access_token=${accessToken}`,
      {
        method: 'POST',
      },
    ).then(resp => {
      console.log(resp);
      navigation.navigate('Info');
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text>Face Rec Screen</Text>
      <Button title="logout" onPress={logout} />
      <Text>First: {first}</Text>
      <Image style={styles.preview} source={{uri: first}} />
      <Text>Second: {second}</Text>
      <Image style={styles.preview} source={{uri: second}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
  },
  preview: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 320,
    height: 500,
  },
});

export default Photos;
