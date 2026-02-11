import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { COLOR_NAMES, useGameStore } from '@super-decoder/shared';
import type { Color } from '@super-decoder/shared';
import { useSettingsStore } from '../stores/settingsStore';
import { ColorSlot } from '../components/ColorSlot';
import { ColorPicker } from '../components/ColorPicker';
import { useTheme } from '../themes/useTheme';

export function DuoSetterScreen() {
  const theme = useTheme();
  const router = useRouter();
  const colorBlindMode = useSettingsStore(s => s.colorBlindMode);

  const [code, setCode] = useState<(Color | null)[]>([null, null, null, null]);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [hintType, setHintType] = useState<'direct' | 'indirect'>('direct');
  const [numColors, setNumColors] = useState(6);

  const availableColors = COLOR_NAMES.slice(0, numColors);
  const usedColors = code.filter((c): c is Color => c !== null);
  const isReady = code.every(c => c !== null) && new Set(code).size === 4;

  const handleColorSelect = (color: Color) => {
    if (usedColors.includes(color) && code[selectedSlot] !== color) return;
    const newCode = [...code];
    newCode[selectedSlot] = color;
    setCode(newCode);
    for (let i = 1; i <= 4; i++) {
      const idx = (selectedSlot + i) % 4;
      if (newCode[idx] === null) {
        setSelectedSlot(idx);
        return;
      }
    }
    setSelectedSlot(Math.min(selectedSlot + 1, 3));
  };

  const handleConfirm = () => {
    if (!isReady) return;
    const mode = hintType === 'direct' ? 'easy' as const : 'advanced' as const;
    useGameStore.getState().initCustomGame({
      secretCode: code as Color[],
      mode,
      availableColors,
    });
    router.replace({ pathname: '/game', params: { mode: 'duo' } });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme['--bg-deepest'] }]} contentContainerStyle={styles.content}>
      <Pressable testID="btn-back" onPress={() => router.back()} style={styles.backBtn}>
        <Text style={[styles.backText, { color: theme['--text-primary'] }]}>{'\u2190'}</Text>
      </Pressable>

      <Text
        testID="duo-title"
        accessibilityLabel="CODE SETTER"
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
        CODE SETTER
      </Text>
      <Text accessibilityLabel="Set your secret code:" style={[styles.subtitle, { color: theme['--text-secondary'] }]}>Set your secret code:</Text>

      <View style={styles.codeRow}>
        {code.map((color, i) => (
          <ColorSlot
            key={i}
            color={color}
            isSelected={i === selectedSlot}
            isDisabled={false}
            colorBlindMode={colorBlindMode}
            onPress={() => setSelectedSlot(i)}
          />
        ))}
      </View>

      <View style={styles.pickerWrap}>
        <ColorPicker
          availableColors={availableColors}
          usedColors={usedColors.filter(c => code[selectedSlot] !== c)}
          onColorSelect={handleColorSelect}
          colorBlindMode={colorBlindMode}
        />
      </View>

      <Text style={[styles.sectionLabel, { color: theme['--text-secondary'] }]}>Colors: {numColors}</Text>
      <View style={styles.optionRow}>
        {[4, 5, 6, 7, 8].map(n => (
          <Pressable
            key={n}
            testID={`color-count-${n}`}
            accessibilityLabel={String(n)}
            onPress={() => {
              setNumColors(n);
              setCode([null, null, null, null]);
              setSelectedSlot(0);
            }}
            style={[
              styles.optionBtn,
              {
                borderColor: n === numColors ? theme['--text-accent'] : theme['--border-subtle'],
                backgroundColor: n === numColors ? theme['--accent-subtle'] : theme['--bg-card'],
              },
            ]}
          >
            <Text style={[styles.optionText, { color: theme['--text-primary'] }]}>{n}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.sectionLabel, { color: theme['--text-secondary'] }]}>Hint Mode</Text>
      <View style={styles.optionRow}>
        {(['direct', 'indirect'] as const).map(type => (
          <Pressable
            key={type}
            testID={`hint-${type}`}
            accessibilityLabel={type}
            onPress={() => setHintType(type)}
            style={[
              styles.optionBtn,
              styles.hintBtn,
              {
                borderColor: type === hintType ? theme['--text-accent'] : theme['--border-subtle'],
                backgroundColor: type === hintType ? theme['--accent-subtle'] : theme['--bg-card'],
              },
            ]}
          >
            <Text style={[styles.optionText, { color: theme['--text-primary'], textTransform: 'capitalize' }]}>
              {type}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        testID="btn-confirm"
        accessibilityLabel="Confirm & Pass to Opponent"
        onPress={handleConfirm}
        style={[
          styles.confirmBtn,
          {
            backgroundColor: isReady ? theme['--text-accent'] : theme['--border-subtle'],
            opacity: isReady ? 1 : 0.4,
          },
        ]}
      >
        <Text style={[styles.confirmText, { color: isReady ? theme['--bg-deepest'] : theme['--text-secondary'] }]}>
          Confirm & Pass to Opponent
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  content: {
    padding: 24,
  },
  backBtn: {
    padding: 8,
    alignSelf: 'flex-start',
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
  },
  backText: {
    fontSize: 20,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Orbitron-Bold',
    letterSpacing: 2,
    marginVertical: 16,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Exo2-Regular',
    marginBottom: 24,
  },
  codeRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 24,
  },
  pickerWrap: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 13,
    fontFamily: 'Exo2-SemiBold',
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  optionBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  hintBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Exo2-Regular',
  },
  confirmBtn: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  confirmText: {
    fontSize: 16,
    fontFamily: 'Exo2-Bold',
  },
});
