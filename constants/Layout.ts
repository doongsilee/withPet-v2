import { Dimensions, Platform } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const tabHeight = Platform.OS === 'ios' ? 80 : 50;

export default {
  window: {
    width,
    height,
  },
  tabHeight,
  isSmallDevice: width < 375,
};


