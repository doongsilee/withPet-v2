import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

export const MyLocation = () => {
  return (
    <View style={styles.containerStyle}>
      <View style={styles.dot}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 137, 191, 0.4)',
    borderRadius: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 18,
    height: 18,
    backgroundColor: Colors.primariy,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 45,
  },
});
