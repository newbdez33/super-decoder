import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { THEMES } from '@super-decoder/shared';
import { useSettingsStore } from '../stores/settingsStore';
import { useProgressStore } from '../stores/progressStore';
import { Toggle } from '../components/Toggle';
import { useTheme } from '../themes/useTheme';

export function SettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const settings = useSettingsStore();
  const resetProgress = useProgressStore(s => s.resetProgress);

  const handleReset = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all progress? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetProgress },
      ]
    );
  };

  const languages = [
    { label: 'English', value: 'en' as const },
    { label: 'Japanese', value: 'ja' as const },
    { label: 'Chinese', value: 'zh' as const },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme['--bg-deepest'] }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: theme['--text-primary'] }]}>{'\u2190'}</Text>
        </Pressable>
        <Text
          style={[
            styles.title,
            {
              color: theme['--text-accent'],
              textShadowColor: theme['--text-accent'],
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 10,
            },
          ]}
        >
          SETTINGS
        </Text>
      </View>

      <View style={styles.body}>
        <SettingRow label="Sound Effects" theme={theme}>
          <Toggle enabled={settings.soundEnabled} onToggle={settings.setSoundEnabled} label="Sound effects" />
        </SettingRow>

        <SettingRow label="Vibration" theme={theme}>
          <Toggle enabled={settings.vibrationEnabled} onToggle={settings.setVibrationEnabled} label="Vibration" />
        </SettingRow>

        <Divider label="Theme" theme={theme} />

        <View style={styles.themeRow}>
          {THEMES.map(t => (
            <Pressable
              key={t.id}
              onPress={() => settings.setTheme(t.id)}
              style={[
                styles.themeCard,
                {
                  backgroundColor: t.variables['--bg-deepest'],
                  borderColor: settings.theme === t.id ? t.variables['--text-accent'] : theme['--border-subtle'],
                },
              ]}
            >
              <View style={styles.themePreview}>
                <View style={[styles.previewDot, { backgroundColor: t.variables['--text-accent'] }]} />
                <View style={[styles.previewDot, { backgroundColor: t.variables['--text-primary'] }]} />
              </View>
              <Text
                style={[
                  styles.themeName,
                  { color: settings.theme === t.id ? t.variables['--text-accent'] : theme['--text-secondary'] },
                ]}
              >
                {t.name}
              </Text>
            </Pressable>
          ))}
        </View>

        <Divider label="Gameplay" theme={theme} />

        <SettingRow label="Color Blind Mode" theme={theme}>
          <Toggle enabled={settings.colorBlindMode} onToggle={settings.setColorBlindMode} label="Color blind mode" />
        </SettingRow>

        <SettingRow label="Language" theme={theme}>
          <View style={styles.langRow}>
            {languages.map(lang => (
              <Pressable
                key={lang.value}
                onPress={() => settings.setLanguage(lang.value)}
                style={[
                  styles.langBtn,
                  {
                    backgroundColor: settings.language === lang.value ? theme['--accent-subtle'] : theme['--bg-card'],
                    borderColor: settings.language === lang.value ? theme['--text-accent'] : theme['--border-subtle'],
                  },
                ]}
              >
                <Text style={[styles.langText, { color: theme['--text-primary'] }]}>{lang.label}</Text>
              </Pressable>
            ))}
          </View>
        </SettingRow>

        <Divider label="Data" theme={theme} />

        <Pressable
          onPress={handleReset}
          style={[styles.resetBtn, { borderColor: theme['--failure'] }]}
        >
          <Text style={[styles.resetText, { color: theme['--failure'] }]}>Reset All Progress</Text>
        </Pressable>
      </View>
    </View>
  );
}

function SettingRow({ label, theme, children }: { label: string; theme: Record<string, string>; children: React.ReactNode }) {
  return (
    <View style={settingStyles.row}>
      <Text style={[settingStyles.label, { color: theme['--text-primary'] }]}>{label}</Text>
      {children}
    </View>
  );
}

function Divider({ label, theme }: { label: string; theme: Record<string, string> }) {
  return (
    <View style={[settingStyles.divider, { borderTopColor: theme['--border-subtle'] }]}>
      <Text style={[settingStyles.dividerText, { color: theme['--text-secondary'] }]}>{label}</Text>
    </View>
  );
}

const settingStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  label: {
    fontSize: 15,
    fontFamily: 'Exo2-Regular',
  },
  divider: {
    borderTopWidth: 1,
    paddingTop: 16,
  },
  dividerText: {
    fontSize: 12,
    fontFamily: 'Exo2-SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backBtn: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
  },
  backText: {
    fontSize: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Orbitron-Bold',
    letterSpacing: 2,
  },
  body: {
    paddingHorizontal: 24,
    gap: 16,
  },
  themeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  themeCard: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    gap: 8,
    minHeight: 80,
  },
  themePreview: {
    flexDirection: 'row',
    gap: 4,
  },
  previewDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  themeName: {
    fontSize: 11,
    fontFamily: 'Exo2-SemiBold',
  },
  langRow: {
    flexDirection: 'row',
    gap: 6,
  },
  langBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  langText: {
    fontSize: 12,
    fontFamily: 'Exo2-Regular',
  },
  resetBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetText: {
    fontSize: 14,
    fontFamily: 'Exo2-SemiBold',
  },
});
