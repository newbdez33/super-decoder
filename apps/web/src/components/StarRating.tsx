interface StarRatingProps {
  stars: number;
  maxStars?: number;
}

export function StarRating({ stars, maxStars = 3 }: StarRatingProps) {
  return (
    <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
      {Array.from({ length: maxStars }, (_, i) => (
        <span
          key={i}
          aria-label={i < stars ? 'earned star' : 'empty star'}
          style={{
            fontSize: 24,
            color: i < stars ? 'var(--star-color)' : 'var(--border-subtle)',
            textShadow: i < stars ? 'var(--star-glow)' : 'none',
          }}
        >
          {i < stars ? '\u2605' : '\u2606'}
        </span>
      ))}
    </div>
  );
}
