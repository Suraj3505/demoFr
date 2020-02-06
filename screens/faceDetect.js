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
// import { withNavigationFocus } from 'react-navigation'
class FaceDetect extends Component {
  state = {
    faceDetection: true,
    faces: [],
    firstPicture: {},
    secondPicture: {},
    type: 'front',
    pictureIn: 'first',
    recording: false,
    processing: false,
    video: {},
    uploadFirstImage: {},
    uploadSecondImage: {},
    // isVideo: false,
  };

  render() {
    const {recording, processing, faces} = this.state;
    let button = (
      <TouchableOpacity
        onPress={this.startRecording.bind(this)}
        style={styles.capture}>
        <Text style={{fontSize: 14}}> RECORD </Text>
      </TouchableOpacity>
    );

    if (recording) {
      button = (
        <TouchableOpacity
          onPress={this.stopRecording.bind(this)}
          style={styles.capture}>
          <Text style={{fontSize: 14}}> STOP </Text>
        </TouchableOpacity>
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

          <TouchableOpacity onPress={this.compareFaces} style={styles.capture}>
            <Text style={{fontSize: 14}}>compare</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.openPhotos} style={styles.capture}>
            <Text style={{fontSize: 14}}>Open Photos</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.flip} style={styles.capture}>
            <Text style={{fontSize: 14}}>Flip</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.openVideo} style={styles.capture}>
            <Text style={{fontSize: 14}}>Open Video</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.uploadImage} style={styles.capture}>
            <Text style={{fontSize: 14}}>upload</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.logout} style={styles.capture}>
            <Text style={{fontSize: 14}}>logout</Text>
          </TouchableOpacity>
          {button}
        </View>
      </View>
    );
  }

  async startRecording() {
    this.setState({recording: true, processing: true});
    // default to mp4 for android as codec is not set
    const options = {maxDuration: 2};
    const data = await this.camera.recordAsync(options);
    console.log(data);
    console.log(await this.toBase64(data.uri));
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
      if (bucket == 'first') {
        this.setState({firstPicture: data});
        this.uploadImage('first');
      } else {
        this.setState({secondPicture: data});
        this.uploadImage('second');
      }
      // CameraRoll.saveToCameraRoll(data.uri, 'photo');
      // this.setState({picture: data});
    }
  };

  handleDetectPress = () => {
    this.setState({faceDetection: true});
    // this.setState({isVideo: true});
    this.setState({pictureIn: 'first'});
  };

  verifyFaces = () => {
    this.setState({faceDetection: true});
    // this.setState({isVideo: false});
    this.setState({processing: true});
    this.setState({pictureIn: 'second'});
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
        }
        console.log(this.state);
      })
      .catch(err => console.log(err));
  };

  uploadVideo = () => {};

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
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
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
// export default withNavigationFocus(FaceDetect);
// const toBase64 = file => new Promise((resolve, reject) => {
//   const reader = new FileReader();
//   reader.readAsDataURL(file);
//   reader.onload = () => resolve(reader.result);
//   reader.onerror = error => reject(error);
// });

// async function Main() {
//  const file = document.querySelector('#myfile').files[0];
//  console.log(await toBase64(file));
// }

// Main();
