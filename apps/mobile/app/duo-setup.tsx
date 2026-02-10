import { SafeAreaView, StyleSheet } from 'react-native';
import { DuoSetterScreen } from '../src/screens/DuoSetterScreen';
import { useTheme } from '../src/themes/useTheme';

export default function DuoSetup() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme['--bg-deepest'] }]}>
      <DuoSetterScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
