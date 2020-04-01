import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import TextButton from './textBtn';
import DATA from './globalData';

export default class Camera extends Component {
  state = {
    flash: false,
    detectFace: this.props.detectFace,
    faces: false,
    nextScreen: null,
  };

  componentDidMount() {
    if (Object.prototype.hasOwnProperty.call(this.props, 'nextScreen')) {
      this.setState({ nextScreen: this.props.nextScreen })
    }
  }
  handleFlash = () => {
    this.setState({ flash: !this.state.flash });
  };

  capture = async () => {
    if (this.camera) {
      const options = { base64: true, quality: 0.5, width: 500 };
      const data = await this.camera.takePictureAsync(options);
      console.log(data);
      console.log(this.props.bucket)
      if (this.props.bucket == 'id') {
        DATA.panCardPicture = data;
      } else {
        DATA.facePhoto = data;
      }
      if (this.state.nextScreen) {
        this.props.navigation.navigate(this.state.nextScreen)
      }
    }
  };


  startRecording = async () => {
    // default to mp4 for android as codec is not set
    const options = { maxDuration: 2 };
    const data = await this.camera.recordAsync(options);
    if (this.props.bucket == 'id') {
      DATA.panCardVid = data;
    } else {
      DATA.faceVid = data;
    }
    console.log(DATA);
  };

  handleFaceDetection = ({ faces }) => {
    // console.log(faces[0]);
    if (faces) {
      this.setState({ faces: true })
    }
    if (this.state.detectFace) {
      this.capture();
      this.setState({ detectFace: false });
    }
  };

  render() {
    const { type } = this.props;
    let cameraType = {
      front: RNCamera.Constants.Type.front,
      back: RNCamera.Constants.Type.back,
    };
    // let cameraType =
    //   type == 'front'
    //     ? RNCamera.Constants.Type.front
    //     : RNCamera.Constants.Type.back;
    return (
      <View style={styles.container}>
        {this.state.faces ?
          (<View>
            <Text style={styles.text}>
              Face Detected
          </Text>
          </View>) :
          (<View>
            <Text style={styles.text}>
              Face Not Detected
            </Text>
          </View>)
        }
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={cameraType[type]}
          flashMode={
            this.state.flash
              ? RNCamera.Constants.FlashMode.on
              : RNCamera.Constants.FlashMode.off
          }
          captureAudio={false}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          faceDetectionLandmarks={
            RNCamera.Constants.FaceDetection.Landmarks.all
          }
          faceDetectionClassifications={
            RNCamera.Constants.FaceDetection.Classifications.all
          }
          faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.accurate}
          onFacesDetected={this.handleFaceDetection}
          onFaceDetectionError={err => console.log(err)}
        />
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap',
            padding: 5,
          }}>
          <TextButton
            onPress={this.handleFlash}
            text={this.state.flash ? 'flash : on' : 'flash : off'}
            bgColor={'red'}
          />
          {!this.props.detectFace && this.state.faces ? (
            <TextButton
              onPress={
                this.props.action == 'photo'
                  ? this.capture
                  : this.startRecording
              }
              text={'CAPTURE NOW'}
              bgColor={'red'}
            />
          ) : null}
        </View>
      </View>
    );
  }
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
    padding: 10,
    paddingHorizontal: 5,
    alignSelf: 'center',
    margin: 5,
    textTransform: 'capitalize',
  },
  faces: {
    color: 'white',
  },
  text: {
    fontSize: 15,
    textAlign: 'center',
    margin: 10,
    color: 'white',
  },
});
