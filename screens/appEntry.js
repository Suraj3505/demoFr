import React, { Component } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default class AppEntry extends Component {
  componentDidMount() { }
  pressHandler = () => {
    console.log('open verification');
    this.props.navigation.navigate('Info');
  };
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Welcome To Face Recognition</Text>
        <Button
          style={{ width: 100 }}
          title="Start Verfication"
          onPress={this.pressHandler}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  text: {
    marginBottom: 50,
    fontSize: 20
  },
});
