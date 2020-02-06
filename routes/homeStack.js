import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import Home from '../screens/home';
import FaceDetect from '../screens/faceDetect';
import FaceRec from '../screens/faceRec';
import VideoRec from '../screens/videoRec';
import Success from '../screens/passwordReset';

const screens = {
  Home: {
    screen: Home,
  },
  faceDetect: {
    screen: FaceDetect,
  },
  success: {
    screen: Success,
  },
  faceRec: {
    screen: FaceRec,
  },
  videoRec: {
    screen: VideoRec,
  },
};

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);
