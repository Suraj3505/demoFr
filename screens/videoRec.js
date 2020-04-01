import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Video from 'react-native-video';
const videoRec = ({navigation}) => {
  const {uri} = navigation.getParam('video');
  return (
    <View>
      <Text>Hello Video</Text>
      <Text>{uri}</Text>
      {uri && (
        <Video
          source={{uri: uri}}
          style={styles.video}
          fullscreen={true}
          resizeMode={'cover'}
        />
      )}
      {!uri && <Text>Not any videos</Text>}
    </View>
  );
};
const styles = StyleSheet.create({
  video: {
    // position: 'absolute',
    height: 600,
    width: 330,
  },
});
export default videoRec;
