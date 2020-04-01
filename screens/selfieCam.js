import React from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';

import Camera from '../components/Camera';
import { withNavigationFocus } from 'react-navigation';

const SelfieCam = ({ navigation, isFocused }) => {
  const handlePress = () => {
    navigation.navigate('Photos');
  };
  const compare = () => {
    navigation.navigate('Loading');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Face Recognation</Text>
      {isFocused ? (
        <Camera
          type={'front'}
          bucket={'face'}
          detectFace={false}
          action={'photo'}
          navigation={navigation}
          nextScreen={'Loading'}
        />
      ) : (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
      <View style={styles.btns}>
        <Button onPress={handlePress} title={'Open Photos'} />
        <Button onPress={compare} title={'compare'} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  btns: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  }, text: {
    fontSize: 15,
    textAlign: 'center',
    margin: 10,
  },
});

export default withNavigationFocus(SelfieCam);
