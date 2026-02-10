import { SafeAreaView, StyleSheet } from 'react-native';
import { SettingsScreen } from '../src/screens/SettingsScreen';
import { useTheme } from '../src/themes/useTheme';

export default function Settings() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme['--bg-deepest'] }]}>
      <SettingsScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
