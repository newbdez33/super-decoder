import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useTheme } from '../src/themes/useTheme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const theme = useTheme();

  const [fontsLoaded] = useFonts({
    'Orbitron-Regular': require('../assets/fonts/Orbitron-Regular.ttf'),
    'Orbitron-Bold': require('../assets/fonts/Orbitron-Bold.ttf'),
    'Orbitron-Black': require('../assets/fonts/Orbitron-Black.ttf'),
    'Exo2-Light': require('../assets/fonts/Exo2-Light.ttf'),
    'Exo2-Regular': require('../assets/fonts/Exo2-Regular.ttf'),
    'Exo2-SemiBold': require('../assets/fonts/Exo2-SemiBold.ttf'),
    'Exo2-Bold': require('../assets/fonts/Exo2-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={[styles.loading, { backgroundColor: theme['--bg-deepest'] }]}>
        <ActivityIndicator color={theme['--text-accent']} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={[styles.container, { backgroundColor: theme['--bg-deepest'] }]}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme['--bg-deepest'] },
            animation: 'slide_from_right',
          }}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
