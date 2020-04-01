import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import PanCard from '../screens/panCard';
import SelfieCam from '../screens/selfieCam';
import AppEntry from '../screens/appEntry';
import Info from '../screens/info';
import Photos from '../screens/Photos';
import Loading from '../screens/loading';
import PasswordReset from '../screens/passwordReset';
const screens = {
  AppEntry: {
    screen: AppEntry,
    navigationOptions: {
      header: null
    }
  },
  Info: {
    screen: Info,
    navigationOptions: {
      header: null
    }
  },
  PanCard: {
    screen: PanCard,
    navigationOptions: {
      header: null
    }
  },
  SelfieCam: {
    screen: SelfieCam,
    navigationOptions: {
      header: null
    }
  },
  Photos: {
    screen: Photos,
    navigationOptions: {
      header: null
    }
  },
  Loading: {
    screen: Loading,
    navigationOptions: {
      header: null,
    },
  },
  PasswordReset: {
    screen: PasswordReset,
    navigationOptions: {
      header: null
    }
  },
};

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);
