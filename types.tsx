export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
};

export type TabOneParamList = {
  TabOneScreen: undefined;
  Home: undefined;
};

export type TabTwoParamList = {
  TabTwoScreen: undefined;
};

export type location = {
  latitude: number;
  longitude: number;
};

export type store = {
  id: string;
  nid: string;
  name: string;
  address: string;
  images: Array<string>;
  phone: string;
  distance: string;
  category: Array<string>;
  hours: Array<object>;
  menus: Array<object>;
  rating: number;
  reviews: number;
  tags: Array<string>;
  gps: location;
};

export type Category = {
  name: string;
  icon: any;
  color: string;
}
