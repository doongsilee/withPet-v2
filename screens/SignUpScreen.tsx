import * as React from 'react';
import { StyleSheet, ImageBackground, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { View } from '../components/Themed';
import Layout from '../constants/Layout';

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground
        style={{
          width: Layout.window.width,
          height: Layout.window.height,
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
        source={require('../assets/images/splash.png')}>
        <TouchableOpacity
          style={{
            marginBottom: 100,
          }}>
          <Image
            style={{}}
            source={require('../assets/images/kakao_login_medium_wide.png')}
          />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
