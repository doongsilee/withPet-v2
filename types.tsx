export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
  SignUp: undefined;
};

export type BottomTabParamList = {
  HomeStack: undefined;
  MyPageStack: undefined;
};

export type HomeParamList = {
  Home: undefined;
  StoreDetail: { store: store, name: string };
};

export type MyPageStackParamList = {
  MyPageScreen: undefined;
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
  images: string[];
  phone: string;
  distance: string;
  category: string[];
  hours: hour[];
  menus: menu[];
  rating: number;
  reviews: Review[];
  tags: string[];
  gps: location;
  links: link;
};

type hour = {
  day: string;
  schedules: string;
};

type menu = {
  name: string;
  price: string;
};

type link = {
  type: string;
  url: string;
};

export type Category = {
  name: string;
  icon: any;
  color: string;
};

export type Review = {
  score: number;
  reviewer: string;
  review: string;
  review_date: Date;
};
