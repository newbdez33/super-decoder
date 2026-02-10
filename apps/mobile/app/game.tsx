import { SafeAreaView, StyleSheet } from 'react-native';
import { GameScreen } from '../src/screens/GameScreen';
import { useTheme } from '../src/themes/useTheme';

export default function Game() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme['--bg-deepest'] }]}>
      <GameScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
