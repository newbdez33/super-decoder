import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore, COLOR_NAMES, SeededRandom } from '@super-decoder/shared';
import type { Color } from '@super-decoder/shared';
import { useProgressStore } from '../stores/progressStore';
import { ProgressBar } from '../components/ProgressBar';
import { useTheme } from '../themes/useTheme';

export function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const currentLevel = useProgressStore(s => s.currentLevel);

  const handleSolo = () => {
    useGameStore.getState().initLevel(currentLevel);
    router.push('/game');
  };

  const handleDuo = () => {
    router.push('/duo-setup');
  };

  const handleFreePlay = () => {
    const rng = new SeededRandom(Date.now());
    const availableColors = COLOR_NAMES.slice(0, 6);
    const shuffled = rng.shuffle(availableColors);
    const secretCode = shuffled.slice(0, 4) as Color[];
    useGameStore.getState().initCustomGame({
      secretCode,
      mode: 'advanced',
      availableColors,
    });
    router.push({ pathname: '/game', params: { mode: 'free' } });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme['--bg-deepest'] }]}>
      <View style={styles.titleBlock}>
        {/* Outer glow layer */}
        <Text
          style={[
            styles.title,
            styles.titleGlow,
            {
              textShadowColor: theme['--text-accent'],
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 30,
            },
          ]}
        >
          SUPER{'\n'}DECODER
        </Text>
        {/* Mid glow layer */}
        <Text
          style={[
            styles.title,
            styles.titleGlow,
            {
              textShadowColor: theme['--text-accent'],
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 15,
            },
          ]}
        >
          SUPER{'\n'}DECODER
        </Text>
        {/* Visible text */}
        <Text
          style={[
            styles.title,
            {
              color: theme['--text-accent'],
              textShadowColor: theme['--text-accent'],
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 8,
            },
          ]}
        >
          SUPER{'\n'}DECODER
        </Text>
      </View>

      <View style={styles.progressWrap}>
        <ProgressBar currentLevel={currentLevel} />
      </View>

      <View style={styles.menu}>
        <MenuButton
          label="SOLO MODE"
          sublabel="Single player"
          icon={'\u25B6'}
          primary
          theme={theme}
          onPress={handleSolo}
        />
        <MenuButton
          label="DUO MODE"
          sublabel="Two players"
          icon={'\u{1F465}'}
          theme={theme}
          onPress={handleDuo}
        />
        <MenuButton
          label="FREE PLAY"
          sublabel="Practice"
          icon={'\u{1F3B2}'}
          theme={theme}
          onPress={handleFreePlay}
        />

        <View style={styles.smallRow}>
          <Pressable
            onPress={() => router.push('/stats')}
            style={[styles.smallBtn, { backgroundColor: theme['--bg-card'], borderColor: theme['--border-subtle'] }]}
          >
            <Text style={[styles.smallBtnText, { color: theme['--text-secondary'] }]}>Stats</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/settings')}
            style={[styles.smallBtn, { backgroundColor: theme['--bg-card'], borderColor: theme['--border-subtle'] }]}
          >
            <Text style={[styles.smallBtnText, { color: theme['--text-secondary'] }]}>Settings</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function MenuButton({ label, sublabel, icon, primary, theme, onPress }: {
  label: string;
  sublabel: string;
  icon: string;
  primary?: boolean;
  theme: Record<string, string>;
  onPress: () => void;
}) {
  const borderColor = primary ? theme['--text-accent'] : theme['--border-subtle'];

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.menuBtn,
        {
          backgroundColor: theme['--bg-card'],
          borderColor,
        },
      ]}
    >
      <View style={[styles.indicator, { backgroundColor: primary ? theme['--text-accent'] : theme['--border-subtle'] }]} />
      <Text style={styles.menuIcon}>{icon}</Text>
      <View>
        <Text style={[styles.menuLabel, { color: theme['--text-primary'] }]}>{label}</Text>
        <Text style={[styles.menuSublabel, { color: theme['--text-secondary'] }]}>{sublabel}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    paddingVertical: 40,
  },
  titleBlock: {
    marginBottom: 12,
    overflow: 'visible',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Orbitron-Black',
    letterSpacing: 4,
    textAlign: 'center',
    lineHeight: 48,
    padding: 24,
  },
  titleGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    color: 'transparent',
  },
  progressWrap: {
    width: '100%',
    maxWidth: 480,
    marginBottom: 32,
  },
  menu: {
    gap: 12,
    width: '100%',
    maxWidth: 480,
  },
  menuBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    paddingLeft: 20,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 64,
    overflow: 'hidden',
  },
  indicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
  menuIcon: {
    fontSize: 20,
    marginLeft: 8,
  },
  menuLabel: {
    fontFamily: 'Exo2-Bold',
    fontSize: 15,
    letterSpacing: 1,
  },
  menuSublabel: {
    fontFamily: 'Exo2-Regular',
    fontSize: 12,
  },
  smallRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  smallBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallBtnText: {
    fontFamily: 'Exo2-SemiBold',
    fontSize: 14,
  },
});
