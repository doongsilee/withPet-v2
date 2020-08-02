import React, { PureComponent } from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { location, store } from '../types';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: 16,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingBottom: 8,
  },
  cardSection: {
    justifyContent: 'space-between',
  },
  rowSection: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeName: {
    fontSize: 18,
    fontWeight: '600',
  },
  categoryText: {
    color: 'grey',
    marginTop: 2,
  },
  storeTag: {
    backgroundColor: '#fbbbd6',
    color: 'white',
    paddingVertical: 2,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
    overflow: 'hidden',
  },
  storeImage: { width: 92, height: 92 },
  divider: {
    width: 1,
    height: 20,
    marginHorizontal: 10,
    backgroundColor: '#e9e9e9',
  },
  icon: {
    marginHorizontal: 8,
  },
});

type Props = {
  store: store;
  onPress: Function;
};

export default class StoreCard extends PureComponent<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { store } = this.props;
    // console.log(store.hours[0].day);

    // console.log(store);

    if (store !== undefined) {
      return (
        <TouchableOpacity
          style={styles.container}
          onPress={() => this.props.onPress(store)}>
          <View style={styles.cardSection}>
            <View style={styles.rowSection}>
              <Text style={styles.storeName}>{store.name}</Text>
              {/* <Text style={styles.storeTag}>뱃지</Text> */}
            </View>
            <View style={styles.rowSection}>
              <Text style={styles.categoryText}>{store.category[0]}</Text>
            </View>
            <View style={{ ...styles.rowSection, marginTop: 12 }}>
              <Icon
                style={{ marginTop: 2 }}
                name="location"
                type="evilicon"
                size={20}
                onPress={() => console.log('hello')}
              />
              <Text style={{ marginLeft: 8 }}>{store.distance}</Text>
              {/* <View style={styles.divider} /> */}
            </View>
            <View style={styles.rowSection}>
              <Icon
                style={{ marginTop: 2 }}
                name="clock"
                type="evilicon"
                size={20}
                onPress={() => console.log('hello')}
              />
              <Text style={{ marginLeft: 8 }}>
                {store.hours && store.hours[0] && store.hours[0].day !== ''
                  ? store.hours[0].day + ' ' + store.hours[0].schedules
                  : '정보 없음'}
              </Text>
            </View>
            {/* <View style={styles.rowSection}>
            <Icon
              name="star"
              type="font-awesome"
              size={16}
              color="#F6C16B"
              onPress={() => console.log('hello')}
            />
            <Text style={{ marginLeft: 8 }}>{'10.0'}</Text>
            <View style={styles.divider} />
            <Text>리뷰</Text>
            <Text style={{ marginLeft: 8 }}>{'257'}</Text>
          </View> */}
          </View>

          {store.images && store.images[0] !== '' && (
            <Image
              style={styles.storeImage}
              source={{
                uri: store.images[0],
              }}
            />
          )}
        </TouchableOpacity>
      );
    } else {
      return (
        <Text> 상점 정보를 불러오는데 실패하였습니다. 다시 시도해주세요.</Text>
      );
    }
  }
}
