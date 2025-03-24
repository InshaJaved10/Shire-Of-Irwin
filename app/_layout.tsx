import { Stack } from 'expo-router';
import { Slot } from 'expo-router';
import 'react-native-gesture-handler';

export const unstable_settings = {
  initialRouteName: '(auth)/sign-in',
};

export default function RootLayout() {
  return <Slot />;
}