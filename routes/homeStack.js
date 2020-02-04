import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import Home from '../screens/home';
import FaceDetect from '../screens/faceDetect';
import FaceRec from '../screens/faceRec';
const screens = {
  Home: {
    screen: Home,
  },
  faceDetect: {
    screen: FaceDetect,
  },
  faceRec: {
    screen: FaceRec,
  },
};

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);
