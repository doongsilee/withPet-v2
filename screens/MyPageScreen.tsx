import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Avatar } from 'react-native-elements';
import { Text, View } from '../components/Themed';

export default function MyPageScreen() {
  return (
    <View style={styles.container}>
      <Avatar
        rounded
        source={{
          uri:
            "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
        }}
        size={64}
      />
      <Text>이현우</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 24,
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
