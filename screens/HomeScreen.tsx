import { StackNavigationProp } from '@react-navigation/stack';
import * as firebase from 'firebase';
import 'firebase/firestore';
import * as React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Text,
  ScrollView,
  Image,
  Animated,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Icon, Header, Button } from 'react-native-elements';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  MapEvent,
  Region,
} from 'react-native-maps';
import SlidingUpPanel from 'rn-sliding-up-panel';

import { CustomMarker } from '../components/CustomMarker';
import { MyLocation } from '../components/MyLocation';
import StoreCard from '../components/StoreCard';
import Colors from '../constants/Colors';
import layout from '../constants/Layout';
import {
  destinationPointGivenDistanceAndBearingFromSource,
  distanceInKmBetweenEarthCoordinates,
  kmToMeter,
} from '../constants/Utils';
import { HomeParamList, store, location, Category } from '../types';

// eslint-disable-next-line import/order
import * as Location from 'expo-location';
// import { FlatList } from 'react-native-gesture-handler';

const ASPECT_RATIO = layout.window.width / layout.window.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const DEFAULT_PADDING = { top: 140, right: 40, bottom: 340, left: 40 };

type HomeScreenNavigationProp = StackNavigationProp<HomeParamList, 'Home'>;

type Tprops = {
  navigation: HomeScreenNavigationProp;
};

type Tstate = {
  ancorLocation: location;
  myLocation: location;
  curLocationStr: string;
  places: store[];
  needRefresh: boolean;
  selectedMarker: string | null;
  isShowingStores: boolean;
  selectedCategory: number;
  scrollY: Animated.AnimatedValue;
  userTouched: boolean;
};

export default class HomeScreen extends React.Component<Tprops, Tstate> {
  map: MapView | null;
  panel: SlidingUpPanel | null | undefined;

  constructor(props: Tprops) {
    super(props);

    this.map = null;

    this.state = {
      ancorLocation: { latitude: 37.496366, longitude: 127.028364 },
      myLocation: { latitude: 37.496366, longitude: 127.028364 },
      curLocationStr: '',
      places: [],
      needRefresh: false,
      isShowingStores: false,
      selectedCategory: -1,
      scrollY: new Animated.Value(0),
      userTouched: false,
      selectedMarker: null,
    };
  }

  componentDidMount() {
    this.retreiveDeviceLocation();
  }

  retreiveDeviceLocation = async () => {
    const { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
    }
    const location = await Location.getCurrentPositionAsync({});
    const ancorLocation: location = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

    const myLocation = ancorLocation;
    const curLocationStr = await this.reverseGeocoding(ancorLocation);
    this.setState({
      myLocation,
      ancorLocation,
      curLocationStr,
    });

    this.map != null &&
      this.map.animateCamera({ center: ancorLocation, zoom: 14 });
  };

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
      position = this.state.ancorLocation;
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
      const id = docSnapshot.id;
      const data: store = { id, ...docSnapshot.data() } as store;
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
        const _distance = distanceInKmBetweenEarthCoordinates(
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
    this.setState({ places, needRefresh: false });
    this.fitAllMarkers(places);
  }

  handleCategoryPress = (category: Category, index: number) => {
    this.setState({
      isShowingStores: true,
      selectedCategory: index,
    });
    this.retrieveStores(this.state.ancorLocation, category);
  };

  handleBack = () => {
    this.setState({
      isShowingStores: false,
      selectedCategory: -1,
      selectedMarker: null,
    });
  };

  handlePressStore = (store: store) => {
    this.props.navigation.navigate('StoreDetail', { store });
  };

  handleRegionChanged = (region: Region) => {
    if (this.state.userTouched) {
      const newLocation: location = {
        latitude: region.latitude,
        longitude: region.longitude,
      };

      const _distance = distanceInKmBetweenEarthCoordinates(
        this.state.ancorLocation.latitude,
        this.state.ancorLocation.longitude,
        newLocation.latitude,
        newLocation.longitude,
      );

      if (_distance > 0.5) {
        this.setState({
          ancorLocation: newLocation,
          needRefresh: true,
          userTouched: false,
        });
      }
    }
  };

  fitAllMarkers = (places: store[]) => {
    const markers = places.map((place) => place.gps);

    if (places.length) {
      this.map &&
        this.map.fitToCoordinates(markers, {
          edgePadding: DEFAULT_PADDING,
          animated: true,
        });
    }
  };

  handleMarkerPress = (event: MapEvent<{ action: string; id: string }>) => {
    if (event.nativeEvent.id === 'myPos') return;
    const { selectedMarker } = this.state;

    console.log(event.nativeEvent);

    if (selectedMarker === null) {
      this.setState({
        selectedMarker: event.nativeEvent.id,
      });
    } else {
      this.setState({
        selectedMarker: null,
      });
    }
    // this.setState({
    //   markerPressed
    // })
  };

  render() {
    const {
      ancorLocation,
      myLocation,
      curLocationStr,
      places,
      isShowingStores,
      selectedCategory,
      scrollY,
      needRefresh,
      selectedMarker,
    } = this.state;

    const categories: Category[] = getCategoryList();

    // const translationY = this.state.scrollY.interpolate({
    //   inputRange: [0, 100],
    //   outputRange: [480, 240],
    //   extrapolate: 'clamp',
    // });

    // const translationY = 0;

    return (
      <View style={styles.container}>
        <MapView
          ref={(el) => (this.map = el)}
          style={styles.mapStyle}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: ancorLocation.latitude,
            longitude: ancorLocation.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          minZoomLevel={14}
          maxZoomLevel={16}
          toolbarEnabled={false}
          onPanDrag={() => {
            this.setState({ userTouched: true });
          }}
          onPress={() => this.setState({ selectedMarker: null })}
          onRegionChangeComplete={this.handleRegionChanged}
          onMarkerPress={this.handleMarkerPress}>
          <Marker identifier="myPos" coordinate={myLocation}>
            <MyLocation />
          </Marker>
          {isShowingStores &&
            places.map((place) => (
              <Marker
                identifier={place.id}
                coordinate={{
                  latitude: place.gps.latitude,
                  longitude: place.gps.longitude,
                }}>
                <CustomMarker
                  place={place}
                  isSelected={place.id === this.state.selectedMarker}
                />
              </Marker>
            ))}
        </MapView>
        <View pointerEvents="box-none" style={styles.overlayContainer}>
          {!isShowingStores ? (
            <View>
              <View style={styles.upper}>
                <Icon
                  containerStyle={styles.loccationIcon}
                  type="foundation"
                  name="marker"
                  size={26}
                  color={Colors.primariy}
                />
                <Text style={styles.locationText}>{curLocationStr}</Text>
              </View>
              <ScrollView
                horizontal
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
                      raised
                      onPress={(e) => this.handleCategoryPress(category, index)}
                    />
                  );
                })}
              </ScrollView>
              <TouchableOpacity
                style={styles.myLocationButton}
                onPress={this.retreiveDeviceLocation}>
                <Icon name="my-location" size={18} color={Colors.primariy} />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View>
                <Header
                  // containerStyle={{ position: 'absolute', width: '100%', zIndex: 4 }}
                  onLayout={(e) => console.log(e.nativeEvent.layout)}
                  backgroundColor="#fff"
                  leftComponent={{
                    icon: 'arrow-back',
                    color: '#000',
                    onPress: this.handleBack,
                  }}
                  centerComponent={{
                    text: categories[selectedCategory].name,
                    style: { color: '#000' },
                  }}
                />
                <TouchableOpacity
                  style={[styles.myLocationButton, { marginTop: 10 }]}
                  onPress={this.retreiveDeviceLocation}>
                  <Icon name="my-location" size={18} color={Colors.primariy} />
                </TouchableOpacity>

                {needRefresh && (
                  <Button
                    containerStyle={styles.searchThisAreaBtn}
                    buttonStyle={{ backgroundColor: 'white', borderRadius: 20 }}
                    titleStyle={{ color: '#0091ea', fontSize: 12 }}
                    raised
                    onPress={() => {
                      this.retrieveStores(
                        this.state.ancorLocation,
                        categories[selectedCategory],
                      );
                    }}
                    icon={
                      <Icon
                        containerStyle={styles.categoryIcon}
                        name="refresh"
                        type="material"
                        size={18}
                        color="#0091ea"
                      />
                    }
                    title="이 지역 검색하기"
                  />
                )}
              </View>
              {places.length > 0 &&
                (selectedMarker === null ? (
                  <SlidingUpPanel
                    ref={(c) => (this.panel = c)}
                    draggableRange={{
                      top: layout.window.height - 88 - 80,
                      bottom: 200,
                    }}
                    containerStyle={styles.listView}
                    // animatedValue={this._draggedValue}
                    showBackdrop={false}>
                    {(dragHandler) => (
                      <View
                        style={{
                          flex: 1,
                          zIndex: -3,
                          backgroundColor: 'white',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View style={styles.dragHandler} {...dragHandler}>
                          <View style={styles.indicator} />
                        </View>
                        <FlatList
                          style={{ width: '100%' }}
                          data={places}
                          renderItem={(item) => (
                            <StoreCard
                              store={item.item}
                              onPress={this.handlePressStore}
                            />
                          )}
                        />
                      </View>
                    )}
                  </SlidingUpPanel>
                ) : (
                  <View style={styles.shadow}>
                    <StoreCard
                      store={
                        places.filter((place) => place.id === selectedMarker)[0]
                      }
                      onPress={this.handlePressStore}
                    />
                  </View>
                ))}
            </>
          )}
        </View>
      </View>
    );
  }
}

function getCategoryList(): Category[] {
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
    // {
    //   name: '실내놀이터',
    //   icon: require(assetUrl + 'enter_in_ic.png'),
    //   color: Colors.enterInColor,
    // },
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
    height: layout.window.height - layout.tabHeight,
  },
  overlayContainer: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
  },
  upper: {
    height: 50,
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
  myLocationButton: {
    backgroundColor: 'white',
    width: 45,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    alignSelf: 'flex-end',
    marginRight: 15,
  },
  searchThisAreaBtn: {
    width: 160,
    marginTop: 16,
    // backgroundColor: 'white',
    borderRadius: 20,
    alignSelf: 'center',
  },
  listView: {
    backgroundColor: 'white',
    zIndex: 1,
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
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  dragHandler: {
    alignSelf: 'stretch',
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  indicator: {
    width: 50,
    height: 3,
    opacity: 0.5,
    borderRadius: 1,
    backgroundColor: '#555869',
    alignSelf: 'center',
  },
});
