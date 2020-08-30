import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AirbnbRating, Image } from 'react-native-elements';

import { Review } from '../types';

const ReviewCard = (key: any, review: Review) => {
  // console.log(key);
  console.log(key.review.reviewDate);

  const { review: Review } = key;

  return (
    <View style={{ paddingHorizontal: 16, marginVertical: 12 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <AirbnbRating
          count={5}
          showRating={false}
          size={20}
          defaultRating={Number(key.review.score)}
          isDisabled
          selectedColor="#ffc059"
          starStyle={{ marginLeft: -2 }}
        />
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 4 }}>
          {Number.parseFloat(key.review.score).toFixed(1)}
        </Text>
      </View>
      <Text style={{ fontSize: 16, marginVertical: 8 }}>
        {key.review.review}
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {key.review.source == 'naver' ? (
          <View style={{ flexDirection: 'row' }}>
            <Image
              source={require('../assets/images/naverIc.png')}
              containerStyle={{ width: 12, height: 12 }}
            />
            <Text style={{ fontSize: 12, marginLeft: 4 }}>네이버영수증리뷰</Text>
          </View>
        ) : (
          <Text style={{ fontSize: 12 }}>{key.review.reviewer}</Text>
        )}
        <Text style={{ fontSize: 12 }}>{key.review.review_date}</Text>
      </View>
    </View>
  );
};

export default ReviewCard;

const styles = StyleSheet.create({});
