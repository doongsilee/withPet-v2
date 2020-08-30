import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { Icon, Button, Rating } from 'react-native-elements';
import { LinearGradient } from 'react-native-linear-gradient';

import Colors from '../constants/Colors';
import { store as storeType } from '../types';

const StoreInfoTab = ({
  store,
  isActiveTab,
  onFindWayClicked,
}: {
  store: storeType;
  isActiveTab: boolean;
  onFindWayClicked: Function;
}) => {
  const [foldOpenningHour, setFoldOpenningHour] = useState(true);
  const [foldServices, setFoldServices] = useState(true);

  //   console.log(store);

  return (
    <View style={styles.contentArea}>
      <View style={styles.nameCard}>
        <Text style={[styles.sectionName, styles.fontBold]}>{store.name}</Text>
        <Text style={styles.category}>{store.category.join(' / ')}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 16,
        }}>
        <Rating imageSize={20} readonly />
        <Text style={{ marginLeft: 8, fontSize: 20, fontWeight: 'bold' }}>
          {' '}
          5.0
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 16,
          marginBottom: 32,
          marginHorizontal: 10,
          justifyContent: 'space-around',
        }}>
        <TouchableOpacity style={{ flex: 1 }}>
          <Icon name="pets" />
          <Text style={{ paddingVertical: 8, textAlign: 'center' }}>
            발도장
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1 }}>
          <Icon name="bookmark" />
          <Text style={{ paddingVertical: 8, textAlign: 'center' }}>
            가고싶어요
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => onFindWayClicked()}>
          <Icon name="navigation" />
          <Text style={{ paddingVertical: 8, textAlign: 'center' }}>
            길찾기
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1 }}>
          <Icon name="share" />
          <Text style={{ paddingVertical: 8, textAlign: 'center' }}>공유</Text>
        </TouchableOpacity>
      </View>
      <Text style={{ fontSize: 20 }}>기본정보</Text>
      {store.tags && (
        <View style={styles.tags}>
          {store.tags.map((tag) => {
            if (tag !== '') return <Text style={styles.tag}>{tag}</Text>;
          })}
        </View>
      )}
      <View style={styles.extraInfo}>
        <View style={styles.iconRow}>
          <Icon name="location" type="evilicon" size={16} />
          <Text style={styles.iconText}>{store.address}</Text>
        </View>
        <View style={styles.iconRow}>
          <Icon name="phone" type="MaterialIcons" size={16} />
          <Text style={styles.iconText}>{store.phone}</Text>
        </View>
      </View>
      <View style={styles.separator} />
      <View style={styles.openingHoursSection}>
        <Text style={styles.sectionName}>영업시간</Text>
        {foldOpenningHour ? (
          <View style={[styles.spaceBetweenRow, { marginTop: 16 }]}>
            <Text style={styles.fontBody}>
              {store.hours && store.hours[0] && store.hours[0].day !== ''
                ? store.hours[0].day
                : '정보 없음'}
            </Text>
            <Text style={styles.fontBody}>
              {store.hours && store.hours[0] && store.hours[0].schedules}
            </Text>
          </View>
        ) : (
          store.hours.map((data) => (
            <View style={[styles.spaceBetweenRow, { marginTop: 16 }]}>
              <Text style={styles.fontBody}>{data.day}</Text>
              <Text style={styles.fontBody}>{data.schedules}</Text>
            </View>
          ))
        )}

        <Button
          title="영업시간 더보기"
          type="clear"
          titleStyle={{
            color: Colors.primariy,
            ...styles.fontBody,
          }}
          onPress={() => setFoldOpenningHour(!foldOpenningHour)}
        />
      </View>
      <View style={styles.separator} />
      <View style={styles.serviceSection}>
        <Text style={styles.sectionName}>서비스</Text>
        {foldServices ? (
          <View style={[styles.spaceBetweenRow, { marginTop: 12 }]}>
            <Text style={styles.fontBody}>
              {store.menus[0] ? store.menus[0].name : '메뉴 정보 없음'}
            </Text>
            <Text style={styles.fontBody}>
              {store.menus[0].price === '변동'
                ? store.menus[0].price
                : Number(store.menus[0].price).toLocaleString() + '원'}
            </Text>
          </View>
        ) : (
          store.menus.map((service) => (
            <View style={[styles.spaceBetweenRow, { marginTop: 12 }]}>
              <Text style={styles.fontBody}>{service.name}</Text>
              <Text style={styles.fontBody}>
                {service.price === '변동'
                  ? service.price
                  : Number(service.price).toLocaleString() + '원'}
              </Text>
            </View>
          ))
        )}
        <Button
          title="서비스 더보기"
          type="clear"
          titleStyle={{
            color: Colors.primariy,
            ...styles.fontBody,
          }}
          onPress={() => setFoldServices(!foldServices)}
        />
      </View>
      <View style={styles.separator} />
      <View style={styles.snsSection}>
        {store.links && store.links.type === 'instagram' ? (
          <View style={styles.snsCard}>
            <Button
              ViewComponent={LinearGradient}
              linearGradientProps={{
                colors: ['#fed576', '#f47133', '#bc3081', '#4c63d2'],
                start: { x: 0, y: 1 },
                end: { x: 1, y: 0 },
              }}
              icon={
                <Icon
                  name="logo-instagram"
                  type="ionicon"
                  size={28}
                  color="white"
                />
              }
              containerStyle={styles.snsButtonStyle}
              onPress={() => {
                Linking.openURL(store.links.url);
              }}
            />
            <View style={styles.snsNameCard}>
              <Text style={[styles.fontBody, styles.fontBold]}>
                {store.name}
              </Text>
              <Text style={styles.fontBody}>인스타그램</Text>
            </View>
          </View>
        ) : store.links.type === 'blog' ? (
          <View style={styles.snsCard}>
            <Button
              icon={
                <Icon
                  name="logo-instagram"
                  type="ionicon"
                  size={28}
                  color="white"
                />
              }
              containerStyle={styles.snsButtonStyle}
              buttonStyle={{ backgroundColor: '#00c73c' }}
              onPress={() => {
                Linking.openURL(store.links.url);
              }}
            />
            <View style={styles.snsNameCard}>
              <Text style={[styles.fontBody, styles.fontBold]}>
                #{store.name}
              </Text>
              <Text style={styles.fontBody}>블로그</Text>
            </View>
          </View>
        ) : (
          store.links.type === 'website' && (
            <View style={styles.snsCard}>
              <Button
                icon={
                  <Icon
                    name="logo-instagram"
                    type="ionicon"
                    size={28}
                    color="white"
                  />
                }
                containerStyle={styles.snsButtonStyle}
                buttonStyle={{ backgroundColor: '#4c63d2' }}
                onPress={() => {
                  Linking.openURL(store.links.url);
                }}
              />
              <View style={styles.snsNameCard}>
                <Text style={[styles.fontBody, styles.fontBold]}>
                  #{store.name}
                </Text>
                <Text style={styles.fontBody}>웹사이트</Text>
              </View>
            </View>
          )
        )}
      </View>
    </View>
  );
};

export default StoreInfoTab;

const styles = StyleSheet.create({
  contentArea: {
    backgroundColor: 'white',
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 30,
  },
  nameCard: {
    marginLeft: 4,
  },
  sectionName: {
    fontSize: 20,
  },
  category: {
    marginTop: 4,
    color: 'grey',
    fontSize: 14,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  tag: {
    backgroundColor: Colors.primariy,
    color: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 4,
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 4,
  },
  extraInfo: { marginLeft: 4 },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  iconText: {
    marginLeft: 4,
    fontSize: 16,
  },
  separator: {
    marginVertical: 24,
    height: 1,
    backgroundColor: '#e9e9e9',
    marginHorizontal: 4,
  },
  openingHoursSection: {
    marginHorizontal: 4,
  },
  spaceBetweenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceSection: {},
  snsSection: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.12,
    shadowRadius: 3.84,

    elevation: 5,
  },
  snsCard: {
    flexDirection: 'row',
  },
  snsNameCard: {
    justifyContent: 'center',
    marginLeft: 8,
  },
  snsButtonStyle: {
    width: 44,
    borderRadius: 45,
    overflow: 'hidden',
  },
  //temp
  fontBold: {
    fontWeight: 'bold',
  },
  fontTitle: {
    fontSize: 20,
  },
  fontBody: {
    fontSize: 16,
  },
});
