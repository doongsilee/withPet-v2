import * as React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Text,
  ScrollView,
  Image,
  Animated,
} from 'react-native';

import Colors from '../constants/Colors';

import { StackNavigationProp } from '@react-navigation/stack';

import {
  destinationPointGivenDistanceAndBearingFromSource,
  distanceInKmBetweenEarthCoordinates,
  kmToMeter,
} from '../constants/Utils';

import { CustomMarker } from '../components/CustomMarker';
import { TabOneParamList, store, location, Category } from '../types';

import MapView, { PROVIDER_GOOGLE, Marker, MapEvent } from 'react-native-maps';
import layout from '../constants/Layout';
import { Icon, Header, Button } from 'react-native-elements';

import * as firebase from 'firebase';
import 'firebase/firestore';
import StoreCard from '../components/StoreCard';

import * as Location from 'expo-location';

const ASPECT_RATIO = layout.window.width / layout.window.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

type HomeScreenNavigationProp = StackNavigationProp<TabOneParamList, 'Home'>;

type Tprops = {
  navigation: HomeScreenNavigationProp;
};
type Tstate = {
  curLocation: location;
  curLocationStr: string;
  places: Array<store>;
  needRefresh: boolean;
  selectedMarker?: string;
  isShowingStores: boolean;
  selectedCategory: number;
  scrollY: Animated.AnimatedValue;
};

export default class HomeScreen extends React.Component<Tprops, Tstate> {
  map: MapView | null;

  constructor(props: Tprops) {
    super(props);

    this.map = null;

    this.state = {
      curLocation: { latitude: 37.496366, longitude: 127.028364 },
      curLocationStr: '',
      places: [],
      needRefresh: false,
      isShowingStores: false,
      selectedCategory: -1,
      scrollY: new Animated.Value(0),
    };
  }

  componentDidMount() {
    this.retreiveDeviceLocation();
  }

  async retreiveDeviceLocation() {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
    }
    let location = await Location.getCurrentPositionAsync({});
    const curLocation: location = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    const curLocationStr = await this.reverseGeocoding(curLocation);
    this.setState({
      curLocation,
      curLocationStr,
    });

    this.map != null &&
      this.map.animateCamera({ center: curLocation, zoom: 14 });
  }

  async reverseGeocoding(position: location) {
    // eslint-disable-next-line no-undef
    const params = new URLSearchParams({
      request: 'coordsToaddr',
      coords: position.longitude + ',' + position.latitude,
      orders: 'addr,roadaddr',
      output: 'json',
    });

    try {
      const result = await fetch(
        'https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?' +
          params,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'X-NCP-APIGW-API-KEY-ID': 'ahbcif46uc',
            'X-NCP-APIGW-API-KEY': 'ZFdAXkloFxPXOKYaGifIWkYxHJiAV4MI58OaQD60',
          },
        },
      );
      const responseJson = await result.json();
      // console.log(responseJson);
      let area2 = responseJson.results[0].region.area2.name.split(' ');
      //   console.log(area2);
      area2 = area2.length === 1 ? area2[0] : area2[1];

      return area2 + ' ' + responseJson.results[0].region.area3.name;
    } catch (e) {
      console.log(e);
      return '';
    }
  }

  async retrieveStores(position: location, category: Category) {
    // const southWest = new firestore.GeoPoint(37.459524, 126.882231);
    // const northEast = new firestore.GeoPoint(37.609256, 127.105689);
    // console.log(position);

    if (!position) {
      position = this.state.curLocation;
    }

    const north = destinationPointGivenDistanceAndBearingFromSource(
      position.latitude,
      position.longitude,
      2000,
      0,
    );

    const south = destinationPointGivenDistanceAndBearingFromSource(
      position.latitude,
      position.longitude,
      2000,
      180,
    );

    const east = destinationPointGivenDistanceAndBearingFromSource(
      position.latitude,
      position.longitude,
      2000,
      90,
    );

    const west = destinationPointGivenDistanceAndBearingFromSource(
      position.latitude,
      position.longitude,
      2000,
      270,
    );

    // console.log(north, south, east, west);

    const querySnapshot = await firebase
      .firestore()
      .collection('Places')
      .where(
        'gps',
        '>',
        new firebase.firestore.GeoPoint(south.latitude, south.longitude),
      )
      .where(
        'gps',
        '<',
        new firebase.firestore.GeoPoint(north.latitude, north.longitude),
      )
      .where('category', 'array-contains', category.name)
      .get();

    let places = [];
    for (const docSnapshot of querySnapshot.docs) {
      const docId = docSnapshot.id;
      const data = { docId, ...(docSnapshot.data() as store) };
      places.push(data);
    }

    places = places.filter((place: store): boolean => {
      return (
        west.longitude < place.gps.longitude &&
        place.gps.longitude < east.longitude
      );
    });

    places = places.map(
      (place: store): store => {
        let _distance = distanceInKmBetweenEarthCoordinates(
          position.latitude,
          position.longitude,
          place.gps.latitude,
          place.gps.longitude,
        );

        place.distance =
          _distance > 1
            ? _distance.toFixed(2) + 'km'
            : kmToMeter(_distance) + 'm';
        return place;
      },
    );

    // console.log(places);

    if (places.length === 0) {
      console.log('No Places!');
      // Toast.show('앗, 이 주변에 댕댕이와 함께 갈 수있는 곳이 없네요');
    }
    this.setState({ places: places, needRefresh: false });
    this.map && this.map.animateCamera({ zoom: 14 });
  }

  handleCategoryPress = (category: Category, index: number) => {
    this.setState({
      isShowingStores: true,
      selectedCategory: index,
    });
    this.retrieveStores(this.state.curLocation, category);
  };

  handleBack = () => {
    this.setState({
      isShowingStores: false,
      selectedCategory: -1,
    })
  }

  render() {
    const {
      curLocation,
      curLocationStr,
      places,
      isShowingStores,
      selectedCategory,
      scrollY
    } = this.state;

    const categories: Array<Category> = getCategoryList();

    const translationY = this.state.scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [480,240],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.container}>
        <MapView
          ref={(el) => (this.map = el)}
          style={styles.mapStyle}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: curLocation.latitude,
            longitude: curLocation.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          showsMyLocationButton={true}
          showsUserLocation={true}
          toolbarEnabled={false}>
          {places.map((place) => (
            <Marker
              identifier={place.id}
              coordinate={{
                latitude: place.gps.latitude,
                longitude: place.gps.longitude,
              }}>
              <CustomMarker
                place={place}
                isSelected={
                  place.id === this.state.selectedMarker ? true : false
                }
              />
            </Marker>
          ))}
        </MapView>
        <View style={styles.upperContainer}>
          {!isShowingStores ? (
            <>
              <View style={styles.upper}>
                <Icon
                  containerStyle={styles.loccationIcon}
                  type="foundation"
                  name={'marker'}
                  size={26}
                  color={Colors.primariy}
                />
                <Text style={styles.locationText}>{curLocationStr}</Text>
              </View>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.low}>
                {categories.map((category, index) => {
                  return (
                    <Button
                      icon={
                        <Image
                          style={[
                            styles.categoryIcon,
                            { tintColor: category.color },
                          ]}
                          source={category.icon}
                        />
                      }
                      title={category.name}
                      titleStyle={styles.categoryLabel}
                      buttonStyle={styles.category}
                      containerStyle={{ marginRight: 8, paddingHorizontal: 4 }}
                      raised={true}
                      onPress={(e) => this.handleCategoryPress(category, index)}
                    />
                  );
                })}
              </ScrollView>
            </>
          ) : (
            <>
              <Header
                backgroundColor={'#fff'}
                leftComponent={{ icon: 'arrow-back', color: '#000', onPress: this.handleBack }}
                centerComponent={{
                  text: categories[selectedCategory].name,
                  style: { color: '#000' },
                }}
              />
              {places.length > 0 && (
                <Animated.ScrollView
                  style={[
                    styles.listView,
                    {
                      transform: [
                        {
                          translateY: translationY,
                        },
                      ],
                      height:  layout.window.height
                    },
                  ]}
                  scrollEventThrottle={16}
                  onScroll={Animated.event(
                    [
                      {
                        nativeEvent: { contentOffset: { y: scrollY } },
                      },
                    ],
                    {
                      useNativeDriver: true, // <- Native Driver used for animated events
                    },
                  )}
                >
                  {places.map((place) => (
                    <StoreCard store={place} />
                  ))}
                </Animated.ScrollView>
              )}
            </>
          )}
        </View>
      </View>
    );
  }
}

function getCategoryList(): Array<Category> {
  const assetUrl = '../assets/images/';
  return [
    {
      name: '카페',
      icon: require(assetUrl + 'cafe_ic.png'),
      color: Colors.cafeColor,
    },
    {
      name: '식당',
      icon: require(assetUrl + 'restaurant_ic.png'),
      color: Colors.restarauntColor,
    },
    {
      name: '실내놀이터',
      icon: require(assetUrl + 'enter_in_ic.png'),
      color: Colors.enterInColor,
    },
    // {
    //   name: '실외놀이터',
    //   icon: assetUrl + 'enter_out_ic.png',
    //   color: Colors.enterOutColor,
    // },
    // {
    //   name: '펜션',
    //   icon: assetUrl + 'pension_ic.png',
    //   color: Colors.pensionColor,
    // },
    // {
    //   name: '호텔',
    //   icon: assetUrl + 'hotel_ic.png',
    //   color: Colors.hotelColor,
    // },
    // {
    //   name: '쇼핑몰',
    //   icon: assetUrl + 'mall_ic.png',
    //   color: Colors.mallColor,
    // },
    // {
    //   name: '동물병원',
    //   icon: assetUrl + 'hospital_ic.png',
    //   color: Colors.hospitalColor,
    // },
    // {
    //   name: '미용실',
    //   icon: assetUrl + 'hairshop_ic.png',
    //   color: Colors.hairShopColor,
    // },
    // {
    //   name: '휴양림',
    //   icon: assetUrl + 'park_ic.png',
    //   color: Colors.parkColor,
    // },
  ];
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  mapStyle: {
    position: 'absolute',
    width: layout.window.width,
    height: layout.window.height,
  },
  upperContainer: {
    flexDirection: 'column',
  },
  upper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:
      Platform.OS === 'ios'
        ? layout.window.height * 0.05
        : layout.window.height * 0.02,
    marginHorizontal: '3%',
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 6,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  loccationIcon: {
    position: 'absolute',
    left: 20,
  },
  locationText: {
    fontSize: 18,
    fontWeight: '600',
  },
  low: {
    marginTop: 12,
    marginHorizontal: '3%',
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    backgroundColor: 'white',
    borderRadius: 16,
    color: 'black',
  },
  categoryLabel: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
  },
  categoryIcon: {
    height: 16,
    width: 16,
    marginRight: 4,
  },
  listView: {
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});
