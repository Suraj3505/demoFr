import React, { Component } from 'react';
import { Text, View, StyleSheet, BackHandler, Button } from 'react-native';
import DATA from '../components/globalData';
export default class PasswordReset extends Component {
  state = {
    message: null,
    matchPercentage: null,
    verified: null
  }
  componentDidMount() {
    this._s1 = this.props.navigation.addListener('didFocus', this._onDF);
    this._s2 = this.props.navigation.addListener('willBlur', this._onWB);
    this.logout();
    console.log(this.props.navigation.state.params)
    if (Object.prototype.hasOwnProperty.call(this.props.navigation.state.params, 'result')) {
      const result = this.props.navigation.state.params.result
      console.log(result, 'result')
      if (result.message !== undefined || result.matchPercentage !== undefined || result.verified !== undefined) {
        this.setState({
          message: result.message,
          matchPercentage: result.matchPercentage,
          verified: result.verified
        })
      }
    }
  }
  logout = () => {
    const loginData = DATA.loginData;
    const accessToken = loginData.id;
    console.log(accessToken);

    fetch(
      `https://preproduction.signzy.tech/api/v2/patrons/logout?access_token=${accessToken}`,
      {
        method: 'POST',
      },
    ).then(resp => console.log(resp));
  };
  _onDF = () => {
    this.bh = BackHandler.addEventListener('hardwareBackPress', () => {
      this.handleBackButtonClick();
      return true;
    });
  };

  _onWB = () => {
    BackHandler.removeEventListener('hardwareBackPress', () => { });

  };

  handleBackButtonClick = () => {
    this.props.navigation.navigate('AppEntry');
  };

  render() {
    const { message, matchPercentage, verified } = this.state
    return (
      (
        message !== null ||
        matchPercentage !== null ||
        verified !== null
      ) ?
        (<View style={styles.container}>
          <Text style={styles.successMessage}>Message : {message}</Text>
          <Text style={styles.successMessage}>matchPercentage : {matchPercentage}</Text>
          {!verified && (
            <View style={styles.btn}>
              <Text>Verification failed.. please read instructions..</Text>
              <Button title={'Try Again'} onPress={this.handleBackButtonClick} />
            </View>
          )}
        </View>) :
        <View style={styles.successMessage}>
          <Text>Please wait</Text>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    textAlign: 'center',
    justifyContent: 'center',
  },
  successMessage: {
    margin: 5,
    fontSize: 20,
  }, btn: {
    marginTop: 10
  }
});
