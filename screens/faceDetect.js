'use strict';
import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  CameraRoll,
} from 'react-native';
import {RNCamera} from 'react-native-camera';

class FaceDetect extends Component {
  state = {
    faceDetection: false,
    faces: [],
    firstPicture: {},
    secondPicture: {},
    type: 'front',
    pictureIn: 'first',
  };
  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={
            this.state.type == 'front'
              ? RNCamera.Constants.Type.front
              : RNCamera.Constants.Type.back
          }
          flashMode={RNCamera.Constants.FlashMode.on}
          captureAudio={false}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.accurate}
          onFacesDetected={this.handleFaceDetection.bind(this)}
          onFaceDetectionError={err => console.log(err)}
        />
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
          <TouchableOpacity
            onPress={this.handleDetectPress.bind(this)}
            style={styles.capture}>
            <Text style={{fontSize: 14}}>Detect</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.verifyFaces} style={styles.capture}>
            <Text style={{fontSize: 14}}>Verify</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.openPhotos} style={styles.capture}>
            <Text style={{fontSize: 14}}>Open Photos</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.flip} style={styles.capture}>
            <Text style={{fontSize: 14}}>Flip</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  verifyFaces = () => {
    this.setState({pictureIn: 'second'});
    this.setState({faceDetection: true});
  };

  flip = () => {
    const type = this.state.type == 'front' ? 'back' : 'front';
    this.setState({type: type});
  };

  openPhotos = () => {
    this.props.navigation.navigate('faceRec', {
      firstPicture: this.state.firstPicture.uri,
      secondPicture: this.state.secondPicture.uri,
      // base64: this.state.picture.base64,
    });
  };

  takePicture = async bucket => {
    if (this.camera) {
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);
      if (bucket == 'first') {
        this.setState({firstPicture: data});
      } else {
        this.setState({secondPicture: data});
      }
      // CameraRoll.saveToCameraRoll(data.uri, 'photo');
      // this.setState({picture: data});
    }
  };

  handleDetectPress = () => {
    this.setState({pictureIn: 'first'});
    this.setState({faceDetection: true});
  };

  handleFaceDetection = async ({faces}) => {
    if (this.state.faceDetection) {
      if (this.state.pictureIn == 'first') {
        this.takePicture('first');
      } else {
        this.takePicture('second');
      }
      this.setState({faces: faces, faceDetection: false});
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 5,
    paddingHorizontal: 10,
    alignSelf: 'center',
    margin: 10,
  },
});

export default FaceDetect;
