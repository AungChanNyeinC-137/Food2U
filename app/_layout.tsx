import useAuthStore from '@/sotre/auth.store';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from 'react';
import './globals.css';


export default function RootLayout() {
  const { isLoading, fetchAuthenticatedUser } = useAuthStore();
  const [fontsLoaded, error] = useFonts({
    "Quicksand-Bold": require('../assets/fonts/Quicksand-Bold.ttf'),
    "Quicksand-Light": require('../assets/fonts/Quicksand-Light.ttf'),
    "Quicksand-Medium": require('../assets/fonts/Quicksand-Medium.ttf'),
    "Quicksand-Regular": require('../assets/fonts/Quicksand-Regular.ttf'),
    "Quicksand-SemiBold.ttf": require('../assets/fonts/Quicksand-SemiBold.ttf'),
  });
  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  useEffect(() => {
    fetchAuthenticatedUser();
  }, [])

  if (!fontsLoaded || isLoading) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}
