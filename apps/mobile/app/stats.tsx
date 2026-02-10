import { SafeAreaView, StyleSheet } from 'react-native';
import { StatsScreen } from '../src/screens/StatsScreen';
import { useTheme } from '../src/themes/useTheme';

export default function Stats() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme['--bg-deepest'] }]}>
      <StatsScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
