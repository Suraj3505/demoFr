import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button } from 'react-native';
import DATA from '../components/globalData';
const fs = require('react-native-fs');
export default class Loading extends React.Component {
  state = {
    error: false,
  };
  // componentDidMount() {}
  componentDidMount() {
    this._s1 = this.props.navigation.addListener('didFocus', this._onDF);
    this._s2 = this.props.navigation.addListener('willBlur', this._onWB);
  }

  _onDF = () => {
    this.bh = BackHandler.addEventListener('hardwareBackPress', () => {
      this.handleBackButtonClick();
      return true;
    });
  };

  _onWB = () => {
    BackHandler.removeEventListener('hardwareBackPress', () => { });
    this.bh.remove();
  };

  handleBackButtonClick = () => {
    this.props.navigation.navigate('AppEntry');
  };

  uploadImage = bucket => {
    const picture =
      bucket == 'id' ? DATA.panCardPicture.base64 : DATA.facePhoto.base64;

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
        if (bucket == 'id') {
          DATA.uploadedFacePhoto = data.file;
        } else {
          DATA.uploadedIDPhoto = data.file;
          // this.logout();
          // this.props.navigation.navigate('Photos');
          this.login();
        }
        console.log(DATA);
      })
      .catch(err => {
        this.setState({ error: true });
        console.log(err);
      });
  };

  uploadVideo = bucket => {
    const form = new FormData();
    const video = bucket == 'id' ? DATA.panCardVid.uri : DATA.faceVid.uri;
    // const stream = fs.createReadStream(video);
    // console.log(stream);
    form.append('file', video);
    const uri = 'https://preproduction-persist.signzy.tech/api/files/upload';
    const obj = {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: form,
    };
    fetch(uri, obj)
      .then(resp => resp.json())
      .then(data => console.log(data));

  };

  login = () => {
    const userName = 'fplabs_test';
    const passWord = 'W9chAfr&bAthlf0owlWr';
    console.log(userName, passWord);

    fetch('https://preproduction.signzy.tech/api/v2/patrons/login', {
      method: 'POST',
      headers: {
        'Accept-language': 'en-US,en;q=0.8',
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        username: userName,
        password: passWord,
      }),
    })
      .then(resp => resp.json())
      .then(data => {
        DATA.loginData = data;
        return true;
      })
      .then(() => {
        this.compareFaces();
      })
      .catch(err => {
        console.log(err);
        this.setState({ error: true });
      });
  };

  compareFaces = () => {
    const loginData = DATA.loginData;
    const patronID = loginData.userId;
    const accessToken = loginData.id;
    const firstImageUrl = DATA.uploadedIDPhoto.directURL;
    const secondImageUrl = DATA.uploadedFacePhoto.directURL;
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
    // console.log('body', body);
    fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    })
      .then(resp => resp.json())
      .then(data => {
        if (data.result) {
          this.props.navigation.navigate('PasswordReset', { result: data.result });
        } else {
          console.log('no data')
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({ error: true });
      });
  };

  pressHandler = () => {
    this.props.navigation.navigate('Info');
  };

  componentDidMount() {
    this.login();
    this.uploadImage('id');
    this.uploadImage('face');
    // this.uploadVideo('face');
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.error ? (
          <View style={styles.container}>
            <Text>Verification failed..</Text>
            <Text style={styles.failedText}>
              please read instructions and try again
            </Text>
            <Button title={'Try Again'} onPress={this.pressHandler} />
          </View>
        ) : (
            <View style={styles.container}>
              <ActivityIndicator size="large" />
              <Text style={styles.load}>please wait...</Text>
            </View>
          )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  load: {
    marginTop: 5,
  },
  failedText: {
    marginBottom: 10,
  },
});
