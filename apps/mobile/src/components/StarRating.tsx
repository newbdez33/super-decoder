import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../themes/useTheme';

interface StarRatingProps {
  stars: number;
  maxStars?: number;
}

export function StarRating({ stars, maxStars = 3 }: StarRatingProps) {
  const theme = useTheme();

  return (
    <View testID="star-rating" style={styles.container}>
      {Array.from({ length: maxStars }, (_, i) => (
        <Text
          key={i}
          testID={`star-${i + 1}`}
          accessibilityLabel={i < stars ? 'earned star' : 'empty star'}
          style={[
            styles.star,
            { color: i < stars ? theme['--star-color'] : theme['--border-subtle'] },
          ]}
        >
          {i < stars ? '\u2605' : '\u2606'}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
  },
  star: {
    fontSize: 24,
  },
});
