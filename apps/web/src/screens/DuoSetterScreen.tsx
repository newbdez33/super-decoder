import { useState } from 'react';
import { COLOR_NAMES } from '@super-decoder/shared';
import type { Color } from '@super-decoder/shared';
import { ColorSlot } from '../components/ColorSlot';
import { ColorPicker } from '../components/ColorPicker';
import { useSettingsStore } from '../stores/settingsStore';

interface DuoSetterScreenProps {
  onConfirm: (secretCode: Color[], hintType: 'direct' | 'indirect', numColors: number, timerMinutes: number | null) => void;
  onBack: () => void;
}

const TIMER_OPTIONS = [
  { label: '30s', value: 0.5 },
  { label: '1m', value: 1 },
  { label: '2m', value: 2 },
  { label: '3m', value: 3 },
  { label: '5m', value: 5 },
  { label: 'None', value: null },
] as const;

export function DuoSetterScreen({ onConfirm, onBack }: DuoSetterScreenProps) {
  const [code, setCode] = useState<(Color | null)[]>([null, null, null, null]);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [hintType, setHintType] = useState<'direct' | 'indirect'>('direct');
  const [numColors, setNumColors] = useState(6);
  const [timerMinutes, setTimerMinutes] = useState<number | null>(2);
  const colorBlindMode = useSettingsStore(s => s.colorBlindMode);

  const availableColors = COLOR_NAMES.slice(0, numColors);
  const usedColors = code.filter((c): c is Color => c !== null);
  const isReady = code.every(c => c !== null) && new Set(code).size === 4;

  const handleColorSelect = (color: Color) => {
    if (usedColors.includes(color) && code[selectedSlot] !== color) return;
    const newCode = [...code];
    newCode[selectedSlot] = color;
    setCode(newCode);
    // Move to next empty slot
    for (let i = 1; i <= 4; i++) {
      const idx = (selectedSlot + i) % 4;
      if (newCode[idx] === null) {
        setSelectedSlot(idx);
        return;
      }
    }
    setSelectedSlot(Math.min(selectedSlot + 1, 3));
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100dvh',
      maxWidth: 480,
      margin: '0 auto',
      padding: '16px 24px',
    }}>
      <button onClick={onBack} style={{
        background: 'none', border: 'none', color: 'var(--text-primary)',
        fontSize: 20, cursor: 'pointer', alignSelf: 'flex-start', padding: 8,
        minWidth: 44, minHeight: 44,
      }}>
        &larr;
      </button>

      <h2 className="font-display" style={{
        textAlign: 'center', fontSize: 20, fontWeight: 700,
        color: 'var(--text-accent)', letterSpacing: 2, margin: '16px 0',
      }}>
        CODE SETTER
      </h2>

      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
        Set your secret code:
      </p>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
        {code.map((color, i) => (
          <ColorSlot
            key={i}
            color={color}
            isSelected={i === selectedSlot}
            isDisabled={false}
            colorBlindMode={colorBlindMode}
            onClick={() => setSelectedSlot(i)}
          />
        ))}
      </div>

      <div style={{ marginBottom: 24 }}>
        <ColorPicker
          availableColors={availableColors}
          usedColors={usedColors.filter(c => code[selectedSlot] !== c)}
          onColorSelect={handleColorSelect}
          colorBlindMode={colorBlindMode}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ color: 'var(--text-secondary)', fontSize: 13, display: 'block', marginBottom: 8 }}>
          Colors: {numColors}
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          {[4, 5, 6, 7, 8].map(n => (
            <button
              key={n}
              onClick={() => {
                setNumColors(n);
                setCode([null, null, null, null]);
                setSelectedSlot(0);
              }}
              style={{
                flex: 1, padding: '8px 4px', borderRadius: 8,
                border: n === numColors ? '1px solid var(--text-accent)' : '1px solid var(--border-subtle)',
                backgroundColor: n === numColors ? 'var(--accent-subtle)' : 'var(--bg-card)',
                color: 'var(--text-primary)', cursor: 'pointer', fontSize: 14,
                fontFamily: "'Exo 2', sans-serif",
              }}
            >{n}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ color: 'var(--text-secondary)', fontSize: 13, display: 'block', marginBottom: 8 }}>
          Hint Mode
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['direct', 'indirect'] as const).map(type => (
            <button
              key={type}
              onClick={() => setHintType(type)}
              style={{
                flex: 1, padding: '10px 12px', borderRadius: 8,
                border: type === hintType ? '1px solid var(--text-accent)' : '1px solid var(--border-subtle)',
                backgroundColor: type === hintType ? 'var(--accent-subtle)' : 'var(--bg-card)',
                color: 'var(--text-primary)', cursor: 'pointer', fontSize: 14,
                fontFamily: "'Exo 2', sans-serif", textTransform: 'capitalize',
              }}
            >{type}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={{ color: 'var(--text-secondary)', fontSize: 13, display: 'block', marginBottom: 8 }}>
          Timer
        </label>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {TIMER_OPTIONS.map(opt => (
            <button
              key={opt.label}
              onClick={() => setTimerMinutes(opt.value)}
              style={{
                padding: '8px 12px', borderRadius: 8,
                border: timerMinutes === opt.value ? '1px solid var(--text-accent)' : '1px solid var(--border-subtle)',
                backgroundColor: timerMinutes === opt.value ? 'var(--accent-subtle)' : 'var(--bg-card)',
                color: 'var(--text-primary)', cursor: 'pointer', fontSize: 13,
                fontFamily: "'Exo 2', sans-serif",
              }}
            >{opt.label}</button>
          ))}
        </div>
      </div>

      <button
        onClick={() => isReady && onConfirm(code as Color[], hintType, numColors, timerMinutes)}
        disabled={!isReady}
        style={{
          padding: '14px 24px', borderRadius: 12, border: 'none',
          backgroundColor: isReady ? 'var(--text-accent)' : 'var(--border-subtle)',
          color: isReady ? 'var(--bg-deepest)' : 'var(--text-secondary)',
          fontSize: 16, fontWeight: 700, cursor: isReady ? 'pointer' : 'default',
          opacity: isReady ? 1 : 0.4, fontFamily: "'Exo 2', sans-serif", minHeight: 48,
        }}
      >
        Confirm &amp; Pass to Opponent
      </button>
    </div>
  );
}
