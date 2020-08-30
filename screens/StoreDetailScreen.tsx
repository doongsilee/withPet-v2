import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as firebase from 'firebase';
import React, { PureComponent } from 'react';
import 'firebase/firestore';
import * as Location from 'expo-location';
import { Text, View, StyleSheet, Linking, Platform } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { SliderBox } from 'react-native-image-slider-box';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import ReviewsTab from '../components/ReviewsTab';
import StoreInfoTab from '../components/StoreInfoTab';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import { HomeParamList, store, Review, location } from '../types';

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
  selectedTabIndex: number;
  tabRoutes: { key: string; title: string }[];
  reviews: Review[];
  curLocation: location;
  // store: store;
  // openingHours: Array<Object>;
  // services: Array<Object>;
};

export class StoreDetailScreen extends PureComponent<Tprops, Tstate> {
  constructor(props: Tprops) {
    super(props);

    // let hoursRegex: string = '([가-힣]+) ([0-9:]+ - [0-9:]+)';

    // const { store } = this.props.route.params;

    this.state = {
      selectedTabIndex: 0,
      tabRoutes: [
        { key: 'info', title: '매장정보' },
        { key: 'reviews', title: '매장후기' },
      ],
      reviews: [],
      curLocation: { latitude: 37.05, longitude: 123.0 },
    };
  }

  componentDidMount() {
    this.retreiveDeviceLocation();
    this.retreiveReviews();
  }

  retreiveDeviceLocation = async () => {
    const { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
    }
    const location = await Location.getCurrentPositionAsync({});
    const curLocation: location = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

    this.setState({
      curLocation,
    });
  };

  retreiveReviews = async () => {
    const { store } = this.props.route.params;

    const querySnapshot = await firebase
      .firestore()
      .collection('Places')
      .doc(store.id)
      .collection('Reviews')
      .get();

    const _reviews: Review[] = [];
    for (const docSnapshot of querySnapshot.docs) {
      const id = docSnapshot.id;
      // const data: store = { id, ...docSnapshot.data() } as store;
      // places.push(data);
      console.log(docSnapshot.data());
      _reviews.push(docSnapshot.data() as Review);
      // console.log(docSnapshot.data());
    }

    this.setState({ reviews: _reviews });
  };

  renderTabBar = (props: any) => (
    <TabBar
      {...props}
      navigationState={{
        index: this.state.selectedTabIndex,
        routes: this.state.tabRoutes,
      }}
      indicatorStyle={{ backgroundColor: Colors.light.tint }}
      style={{ backgroundColor: 'white', paddingVertical: 10 }}
      labelStyle={{ fontSize: 16 }}
      activeColor={Colors.light.tint}
      inactiveColor="#aaaaaa"
    />
  );

  onFindWayClicked = () => {
    const { curLocation } = this.state;
    const { store } = this.props.route.params;

    const baseUrl = 'nmap://route/public?';

    const record: Record<string, string> = {
      appname: 'com.nowwhat',
      sname: '내위치',
      slng: curLocation.longitude,
      slat: curLocation.latitude,
      dname: store.name,
      dlng: store.gps.longitude,
      dlat: store.gps.latitude,
    };

    // eslint-disable-next-line no-undef
    const params = new URLSearchParams(record);

    const url = baseUrl + params;

    const appStoreUrl =
      Platform.OS === 'ios'
        ? 'https://itunes.apple.com/app/id311867728?mt=8'
        : 'market://details?id=com.nhn.android.nmap';

    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log("Can't handle url: " + url);
          return Linking.openURL(appStoreUrl);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  render() {
    const { store } = this.props.route.params;

    const { selectedTabIndex, tabRoutes, reviews } = this.state;

    const renderScene = SceneMap({
      info: () => (
        <StoreInfoTab isActiveTab={selectedTabIndex === 0} store={store} onFindWayClicked={this.onFindWayClicked}/>
      ),
      reviews: () => (
        <ReviewsTab
          isActiveTab={selectedTabIndex === 1}
          reviews={reviews}
          navigation={this.props.navigation}
        />
      ),
    });

    return (
      <View style={styles.container}>
        <ScrollView>
          {/* <View style={styles.header}>
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
          </View> */}
          <SliderBox
            images={store.images}
            style={styles.storeImages}
            dotStyle={{ marginBottom: 15 }}
            dotColor={Colors.primariy}
            resizeMode="cover"
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
          <View style={{ width: Layout.window.width }}>
            <TabView
              renderTabBar={this.renderTabBar}
              navigationState={{ index: selectedTabIndex, routes: tabRoutes }}
              renderScene={renderScene}
              onIndexChange={(index) =>
                this.setState({
                  selectedTabIndex: index,
                })
              }
              initialLayout={{ width: 120 }}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // marginTop: getStatusBarHeight(),
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
