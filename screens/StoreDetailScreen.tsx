import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, Linking } from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { HomeParamList } from '../types';

import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Image, Icon, Button } from 'react-native-elements';

// import LinearGradient from 'react-native-linear-gradient';

import Colors from '../constants/Colors';
// import BaseCss from '../modules/BaseCss';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { SliderBox } from 'react-native-image-slider-box';

type DetailScreenNavigationProp = StackNavigationProp<
  HomeParamList,
  'StoreDetail'
>;

type DetailScreenRouteProp = RouteProp<HomeParamList, 'StoreDetail'>;

type Tprops = {
  navigation: DetailScreenNavigationProp;
  route: DetailScreenRouteProp;
};

type Tstate = {
  foldServices: boolean;
  foldOpenningHour: boolean;
  // openingHours: Array<Object>;
  // services: Array<Object>;
};

export class StoreDetailScreen extends PureComponent<Tprops, Tstate> {
  constructor(props: Tprops) {
    super(props);

    // let hoursRegex: string = '([가-힣]+) ([0-9:]+ - [0-9:]+)';

    const { store } = this.props.route.params;

    console.log(store);
    // let openingHours = store.hours.map(hour => {
    //   // console.log()
    //   if (hour.match(hoursRegex)) {
    //     return {
    //       day: hour.match(hoursRegex)[1],
    //       schedules: hour.match(hoursRegex)[2],
    //     };
    //   } else {
    //     return {
    //       day: hour,
    //       schedules: '',
    //     };
    //   }
    // });

    // let menus = [];
    // for (const menu in store.menus) {
    //   console.log(`${menu}: ${store.menus[menu]}`);
    //   menus.push({
    //     name: menu,
    //     price:
    //       store.menus[menu] === '변동'
    //         ? store.menus[menu]
    //         : Number(store.menus[menu]).toLocaleString() + '원',
    //   });
    // }

    // console.log(store.links === '');

    this.state = {
      foldServices: true,
      foldOpenningHour: true,
      // openingHours: openingHours,
      // services: menus,
    };
  }
  render() {
    const { store } = this.props.route.params;
    const {
      foldOpenningHour,
      foldServices,
      // openingHours,
      // services,
    } = this.state;

    console.log(store);
    // let result = store.hours[0].match(hoursRegex);
    // console.log(store.hours[0]);
    // console.log(result);

    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backbutton}
              onPress={() => this.props.navigation.goBack()}>
              <Icon
                name="md-arrow-back"
                type="ionicon"
                size={28}
                color="white"
              />
            </TouchableOpacity>
          </View>
          <SliderBox
            images={store.images}
            style={styles.storeImages}
            dotStyle={{ marginBottom: 15 }}
            dotColor={Colors.primariy}
            resizeMode={'cover'}
            // onCurrentImagePressed={index =>
            //   console.warn(`image ${index} pressed`)
            // }
            // currentImageEmitter={index =>
            //   console.warn(`current pos is: ${index}`)
            // }
          />
          {/* <Image
            source={require('../assets/images/cafe_temp.jpeg')}
            style={styles.storeImages}
          /> */}
          <View style={styles.contentArea}>
            <View style={styles.nameCard}>
              <Text style={[styles.sectionName, styles.fontBold]}>
                {store.name}
              </Text>
              <Text style={styles.category}>{store.category.join(' / ')}</Text>
            </View>
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
                title={'영업시간 더보기'}
                type="clear"
                titleStyle={{
                  color: Colors.primariy,
                  ...styles.fontBody,
                }}
                onPress={() =>
                  this.setState({
                    foldOpenningHour: !this.state.foldOpenningHour,
                  })
                }
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
                title={'서비스 더보기'}
                type="clear"
                titleStyle={{
                  color: Colors.primariy,
                  ...styles.fontBody,
                }}
                onPress={() =>
                  this.setState({
                    foldServices: !this.state.foldServices,
                  })
                }
              />
            </View>
            <View style={styles.separator} />
            <View style={styles.snsSection}>
              {store.links && store.links.type === 'instagram' ? (
                <View style={styles.snsCard}>
                  <Button
                    // ViewComponent={LinearGradient}
                    // linearGradientProps={{
                    //   colors: ['#fed576', '#f47133', '#bc3081', '#4c63d2'],
                    //   start: { x: 0, y: 1 },
                    //   end: { x: 1, y: 0 },
                    // }}
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
                      #{store.name}
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
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: getStatusBarHeight(),
    flex: 1,
  },
  header: {
    position: 'absolute',
    width: '100%',
    height: 50,
    zIndex: 5,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  backbutton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 40,
    height: 40,
    padding: 6,
    borderRadius: 45,
  },
  storeImages: {
    width: '100%',
    height: 312,
  },
  contentArea: {
    backgroundColor: 'white',
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -15,
    paddingHorizontal: 12,
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
    fontSize: 20,
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
    justifyContent: 'space-evenly',
  },
  snsCard: {
    flexDirection: 'row',
    alignItems: 'center',
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

export default StoreDetailScreen;
