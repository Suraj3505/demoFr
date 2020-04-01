import React from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import Camera from '../components/Camera';

// import TextButton from '../components/textBtn';
import { withNavigationFocus } from 'react-navigation';
const PanCard = ({ navigation, isFocused }) => {
  const handleContinue = () => {
    navigation.navigate('SelfieCam');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>PanCard upload screen</Text>
      {isFocused ? (
        <Camera
          type={'back'}
          bucket={'id'}
          detectFace={false}
          action={'photo'}
          navigation={navigation}
          nextScreen={'SelfieCam'}
        />
      ) : (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
      <Button title="continue to face match" onPress={handleContinue} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  text: {
    fontSize: 15,
    textAlign: 'center',
    margin: 20,
  },
  preview: {
    width: 300,
    height: 300,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
export default withNavigationFocus(PanCard);
