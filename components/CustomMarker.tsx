import * as React from 'react';
import { Image, View, StyleSheet, ImageBackground } from 'react-native';
import Colors from '../constants/Colors';

export const CustomMarker = (props: { place: any; isSelected: any }) => {
  const { isSelected, place } = props;

  if (isSelected) {
    console.log(isSelected);
  }

  let color, icon;
  if (place.category[0] === '카페/디저트') {
    color = Colors.cafeColor;
    icon = require('../assets/images/cafe_ic.png');
  } else if (place.category[0] === '식당/레스토랑') {
    color = Colors.restarauntColor;
    icon = require('../assets/images/restaurant_ic.png');
  } else {
    color = Colors.cafeColor;
    icon = require('../assets/images/cafe_ic.png');
  }
  return (
    <View style={styles.containerStyle}>
      {isSelected ? (
        <ImageBackground
          style={styles.backgroundStyleSelected}
          imageStyle={{ tintColor: color }}
          source={require('../assets/images/ic_map_pin_select.png')}>
          <Image style={styles.iconStyleSelected} source={icon} />
        </ImageBackground>
      ) : (
        <ImageBackground
          style={styles.backgroundStyleDefault}
          imageStyle={{ tintColor: color }}
          source={require('../assets/images/ic_map_pin_default.png')}>
          <Image style={styles.iconStyleDefault} source={icon} />
        </ImageBackground>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: { flex: 1 },
  backgroundStyleDefault: { height: 27, width: 30 },
  backgroundStyleSelected: { height: 34, width: 24 },
  backgroundImageStyle: { tintColor: Colors.cafeColor },
  iconStyleDefault: {
    width: 12,
    height: 12,
    left: '30%',
    top: '45%',
  },
  iconStyleSelected: {
    width: 16,
    height: 16,
    left: '16%',
    top: '16%',
  },
});
