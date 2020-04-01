import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const TextButton = ({onPress, text, bgColor}) => {
  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.capture, bgColor ? {backgroundColor: bgColor} : '#fff']}>
        <Text style={{fontSize: 14}}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  capture: {
    flex: 0,
    borderRadius: 5,
    padding: 5,
    paddingHorizontal: 5,
    alignSelf: 'center',
    margin: 5,
    textTransform: 'capitalize',
    backgroundColor: '#fff',
  },
});
export default TextButton;
