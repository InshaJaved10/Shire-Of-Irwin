import { Stack } from 'expo-router';
import { Slot } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(auth)/sign-in',
};

export default function RootLayout() {
  return <Slot />;
}