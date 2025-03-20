import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen 
        name="application-form" 
        options={{
          headerShown: true,
          headerTitle: 'Inspection Details',
          headerBackTitle: 'Back',
        }}
      />
    </Stack>
  );
} 