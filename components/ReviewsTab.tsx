import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { ListItem, Button, Divider } from 'react-native-elements';

import Colors from '../constants/Colors';
import { store, Review } from '../types';
import ReviewCard from './ReviewCard';
import { Text, View } from './Themed';

// const reviews = [
//   {
//     name: 'Amy Farha',
//     avatar_url:
//       'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
//     subtitle: 'Vice President',
//   },
//   {
//     name: 'Chris Jackson',
//     avatar_url:
//       'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
//     subtitle: 'Vice Chairman',
//   },
//   {
//     name: 'Chris Jackson',
//     avatar_url:
//       'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
//     subtitle: 'Vice Chairman',
//   },
// ];

export default function ReviewsTab({
  isActiveTab,
  reviews,
  navigation,
}: {
  reviews: Review[];
  isActiveTab: boolean;
  navigation: any;
}) {
  // const [reviews, setReviews] = useState<Review[]>([]);
  // useEffect(() => {
  //   retreiveReviews();
  // }, []);

  if (!isActiveTab) {
    return <View />;
  }

  return (
    <View style={styles.container}>
      {reviews && (
        <>
          <View
            style={{
              backgroundColor: 'white',
              paddingTop: 8,
              paddingBottom: 4,
              paddingHorizontal: 16,
            }}>
            <Text style={{ alignSelf: 'flex-start', marginTop: 8 }}>
              <Text style={{ color: Colors.primariy }}>{reviews.length}</Text>개 후기
            </Text>
          </View>
          <View style={{ backgroundColor: 'white' }}>
            {reviews.map((item, index) => (
              <>
                <ReviewCard key={index} review={item} />
                <Divider
                  style={{ marginHorizontal: 16, backgroundColor: '#e9e9e9' }}
                />
              </>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
    backgroundColor: '#ededed',
  },
});
