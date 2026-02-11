import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useProgressStore } from '../stores/progressStore';
import { useTheme } from '../themes/useTheme';

export function StatsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const stats = useProgressStore(s => s.statistics);
  const currentLevel = useProgressStore(s => s.currentLevel);

  const winRate = stats.totalPlayed > 0
    ? Math.round((stats.totalWon / stats.totalPlayed) * 100)
    : 0;

  return (
    <View style={[styles.container, { backgroundColor: theme['--bg-deepest'] }]}>
      <View style={styles.header}>
        <Pressable testID="btn-back" onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: theme['--text-primary'] }]}>{'\u2190'}</Text>
        </Pressable>
        <Text
          testID="stats-title"
          accessibilityLabel="STATISTICS"
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
          STATISTICS
        </Text>
      </View>

      <View style={styles.grid}>
        <StatCard testID="stat-games-played" label="Games Played" value={stats.totalPlayed} theme={theme} />
        <StatCard testID="stat-games-won" label="Games Won" value={stats.totalWon} theme={theme} />
        <StatCard testID="stat-win-rate" label="Win Rate" value={`${winRate}%`} theme={theme} />
        <StatCard testID="stat-current-level" label="Current Level" value={currentLevel} theme={theme} accent />
        <StatCard testID="stat-current-streak" label="Current Streak" value={stats.currentStreak} theme={theme} />
        <StatCard testID="stat-best-streak" label="Best Streak" value={stats.bestStreak} theme={theme} accent />
        <StatCard
          testID="stat-avg-attempts"
          label="Avg Attempts"
          value={stats.averageAttempts > 0 ? stats.averageAttempts.toFixed(1) : '-'}
          theme={theme}
        />
      </View>
    </View>
  );
}

function StatCard({ testID, label, value, theme, accent }: {
  testID: string;
  label: string;
  value: string | number;
  theme: Record<string, string>;
  accent?: boolean;
}) {
  return (
    <View testID={testID} accessibilityLabel={`${label}: ${value}`} style={[styles.card, { backgroundColor: theme['--bg-card'], borderColor: theme['--border-subtle'] }]}>
      <Text
        accessibilityLabel={String(value)}
        style={[
          styles.cardValue,
          {
            color: accent ? theme['--text-accent'] : theme['--text-primary'],
            ...(accent ? {
              textShadowColor: theme['--text-accent'],
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 8,
            } : {}),
          },
        ]}
      >
        {value}
      </Text>
      <Text accessibilityLabel={label} style={[styles.cardLabel, { color: theme['--text-secondary'] }]}>
        {label}
      </Text>
    </View>
  );
}

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
    marginBottom: 16,
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 24,
  },
  card: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  cardValue: {
    fontSize: 24,
    fontFamily: 'Orbitron-Regular',
  },
  cardLabel: {
    fontSize: 11,
    fontFamily: 'Exo2-SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 4,
  },
});
