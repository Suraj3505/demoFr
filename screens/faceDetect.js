'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import CameraRoll from '@react-native-community/cameraroll';
import TextButton from '../components/textBtn';

class FaceDetect extends Component {
  state = {
    faceDetection: true,
    faces: [],
    firstPicture: {},
    secondPicture: {},
    frondID: {},
    backID: {},
    type: 'back',
    pictureIn: 'first',
    recording: false,
    processing: false,
    video: {},
    uploadFirstImage: {},
    uploadSecondImage: {},
    uploadFrontId: {},
    uploadBackId: {},
    idCardPhoto: 'front',
  };

  render() {
    const {recording, processing, faces} = this.state;

    let button = (
      <TextButton onPress={this.startRecording.bind(this)} text={'RECORD'} />
    );

    if (recording) {
      button = (
        <TextButton onPress={this.stopRecording.bind(this)} text={'STOP'} />
      );
    }

    return (
      <View style={styles.container}>
        {processing && (
          <View style={styles.capture}>
            <Text>Please wait while we are processing...</Text>
          </View>
        )}
        {/* <View>
          <Text style={styles.faces}>{JSON.stringify(faces)}</Text>
        </View> */}

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
          // flashMode={RNCamera.Constants.FlashMode.on}
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
          onFacesDetected={this.handleFaceDetection.bind(this)}
          onFaceDetectionError={err => console.log(err)}
        />
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'flex-center',
            flexWrap: 'wrap',
          }}>
          <TextButton onPress={this.handleDetectPress} text={'Detect'} />
          <TextButton onPress={this.verifyFaces} text={'Verify'} />
          <TextButton onPress={this.compareFaces} text={'compare'} />
          <TextButton onPress={this.openPhotos} text={'Open Photos'} />
          <TextButton onPress={this.flip} text={'Flip'} />
          {/* <TextButton onPress={this.openVideo} text={'Open Video'} /> */}
          {/* <TextButton onPress={this.uploadImage} text={'uploadImage'} /> */}
          <TextButton onPress={this.logout} text={'logout'} />
          <TextButton onPress={this.demo} text={'demo'} />
          <TextButton
            onPress={this.idCapture}
            text={this.state.idCardPhoto == 'front' ? 'Front' : 'Back'}
          />
          <TextButton onPress={this.uploadVideo} text={'UploadVideo'} />
          {button}
        </View>
      </View>
    );
  }
  demo = () => {
    // CameraRoll.saveToCameraRoll(this.state.video.uri);
    console.log('working');
  };
  async startRecording() {
    this.setState({recording: true, processing: true});
    // default to mp4 for android as codec is not set
    const options = {maxDuration: 5};
    const data = await this.camera.recordAsync(options);
    console.log(data);
    // console.log(await this.toBase64(data.uri));
    // CameraRoll.saveToCameraRoll(data.uri);
    this.setState({video: data});
    this.setState({recording: false, processing: false});
    this.openVideo();
  }

  stopRecording() {
    this.camera.stopRecording();
    // console.log(this.state.video);
  }

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

  openVideo = () => {
    this.props.navigation.navigate('videoRec', {video: this.state.video});
  };

  takePicture = async bucket => {
    if (this.camera) {
      const options = {width: 300, quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);

      switch (bucket) {
        case 'first':
          this.setState({firstPicture: data});
          this.uploadImage('first');
          break;

        case 'second':
          this.setState({secondPicture: data});
          this.uploadImage('second');
          break;

        case 'frondID':
          this.setState({frondID: data});
          this.uploadID('front');
          break;

        case 'backID':
          this.setState({backID: data});
          this.uploadID('front');
          break;
      }
      console.log(this.state);
      // CameraRoll.saveToCameraRoll(data.uri, 'photo');
      // this.setState({picture: data});
    }
  };

  handleDetectPress = () => {
    this.setState({pictureIn: 'first'});
    this.setState({faceDetection: true});
    // this.setState({isVideo: true});
  };

  verifyFaces = () => {
    this.setState({pictureIn: 'second'});
    this.setState({faceDetection: true});
    // this.setState({isVideo: false});
    this.setState({processing: true});
  };

  handleFaceDetection = async ({faces}) => {
    // console.log(faces);
    // this.setState({faces: faces});
    if (this.state.faceDetection) {
      if (this.state.pictureIn == 'first') {
        this.takePicture('first');
      } else {
        this.takePicture('second');
      }
      this.setState({faces: faces, faceDetection: false});
    }
  };

  logout = () => {
    const loginData = this.props.navigation.getParam('loginData');
    const accessToken = loginData.id;
    console.log(accessToken);

    fetch(
      `https://preproduction.signzy.tech/api/v2/patrons/logout?access_token=${accessToken}`,
      {
        method: 'POST',
      },
    ).then(resp => console.log(resp));
  };

  uploadImage = bucket => {
    const picture =
      bucket == 'first'
        ? this.state.firstPicture.base64
        : this.state.secondPicture.base64;

    const formData = {
      base64String: picture,
      mimetype: 'image/jpg',
      ttl: '2 mins',
    };

    fetch('https://preproduction-persist.signzy.tech/api/base64', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(resp => resp.json())
      .then(data => {
        console.log(data);
        if (bucket == 'first') {
          this.setState({uploadFirstImage: data.file});
        } else {
          this.setState({uploadSecondImage: data.file});
          this.compareFaces();
          // this.logout();
        }
        console.log(this.state);
      })
      .catch(err => console.log(err));
  };

  uploadVideo = bucket => {
    console.log(this.state);
    const video = this.state.video;
    const formData = new FormData();
    formData.append('file', video.uri);
    // formData.append('ttl', '2 mins');
    fetch('https://preproduction-persist.signzy.tech/api/files/upload', {
      method: 'POST',
      body: formData,
    })
      .then(resp => resp.json())
      .then(data => {
        console.log(data);
        // console.log(this.state);
      })
      .catch(err => console.log(err));
  };

  uploadID = bucket => {
    const picture =
      bucket == 'front' ? this.state.frontID.base64 : this.state.backID.base64;
    const formData = {
      base64String: picture,
      mimetype: 'image/jpg',
      ttl: '2 mins',
    };
    fetch('https://preproduction-persist.signzy.tech/api/base64', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(resp => resp.json())
      .then(data => {
        console.log(data);
        if (bucket == 'front') {
          this.setState({uploadFrontId: data.file});
        } else {
          this.setState({uploadBackId: data.file});
        }
        console.log(this.state);
      })
      .catch(err => console.log(err));
  };

  compareFaces = () => {
    const loginData = this.props.navigation.getParam('loginData');
    const patronID = loginData.userId;
    const accessToken = loginData.id;
    const firstImageUrl = this.state.uploadFirstImage.directURL;
    const secondImageUrl = this.state.uploadSecondImage.directURL;
    const url = `https://preproduction.signzy.tech/api/v2/patrons/${patronID}/facematches`;

    const body = {
      essentials: {
        firstImage: firstImageUrl,
        secondImage: secondImageUrl,
        // threshold: '0.05',
      },
    };

    const headers = {
      Authorization: accessToken,
      'Content-type': 'application/json',
    };

    fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    })
      .then(resp => resp.json())
      .then(data => {
        console.log(data);
        this.setState({processing: false});
        this.props.navigation.navigate('success', {result: data.result});
      })
      .catch(err => console.log(err));
  };

  toBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      console.log(reader);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  idCapture = () => {
    const type = this.state.idCardPhoto;
    this.uploadID(type);
    this.setState({idCardPhoto: type == 'front' ? 'back' : 'front'});
  };

  extractPhoto = () => {
    console.log('extrction started');
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
    padding: 3,
    paddingHorizontal: 5,
    alignSelf: 'center',
    margin: 5,
    textTransform: 'capitalize',
  },
  faces: {
    color: 'white',
  },
});

export default FaceDetect;
