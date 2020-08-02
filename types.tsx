export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  HomeStack: undefined;
  TabTwo: undefined;
};

export type HomeParamList = {
  Home: undefined;
  StoreDetail: {store: store};
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
  hours: Array<hour>;
  menus: Array<menu>;
  rating: number;
  reviews: number;
  tags: Array<string>;
  gps: location;
  links: link;
};

type hour = {
  day: string;
  schedules: string;
}

type menu = {
  name: string;
  price: string;
}

type link = {
  type: string;
  url: string;
}

export type Category = {
  name: string;
  icon: any;
  color: string;
}
