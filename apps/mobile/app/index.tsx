import { SafeAreaView, StyleSheet } from 'react-native';
import { HomeScreen } from '../src/screens/HomeScreen';
import { useTheme } from '../src/themes/useTheme';

export default function Home() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme['--bg-deepest'] }]}>
      <HomeScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
