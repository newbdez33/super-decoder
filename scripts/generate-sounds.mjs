/**
 * Generate retro sci-fi sound effects using jsfxr.
 * Run: node scripts/generate-sounds.mjs
 */
import { writeFileSync } from 'fs';

const { sfxr } = await import('jsfxr');

function generateAndSave(name, algorithm, overrides = {}) {
  const result = sfxr.generate(algorithm, { sound_vol: 0.25, sample_rate: 44100, sample_size: 8 });
  // Apply parameter overrides
  for (const [key, value] of Object.entries(overrides)) {
    result[key] = value;
  }
  const buf = sfxr.toBuffer(result);
  const wavBuf = Buffer.from(buf);
  writeFileSync(`${webDir}/${name}.wav`, wavBuf);
  writeFileSync(`${mobileDir}/${name}.wav`, wavBuf);
  console.log(`Generated ${name}.wav (${wavBuf.length} bytes)`);
}

const webDir = 'apps/web/public/sounds';
const mobileDir = 'apps/mobile/assets/sounds';

// tap - Short UI blip
generateAndSave('tap', 'blipSelect', {
  wave_type: 0,       // sine
  p_env_sustain: 0.05,
  p_env_decay: 0.12,
  p_base_freq: 0.5,
});

// place - Click/beep when placing a color
generateAndSave('place', 'blipSelect', {
  wave_type: 1,       // square
  p_env_sustain: 0.04,
  p_env_decay: 0.1,
  p_base_freq: 0.55,
  p_freq_ramp: 0.1,
  p_duty: 0.5,
});

// submit - Whoosh/sweep when submitting a guess
generateAndSave('submit', 'laserShoot', {
  wave_type: 3,        // noise
  p_env_sustain: 0.08,
  p_env_decay: 0.25,
  p_base_freq: 0.3,
  p_freq_ramp: -0.3,
  p_lpf_freq: 0.5,
  p_lpf_ramp: -0.3,
});

// win - Ascending chime
generateAndSave('win', 'powerUp', {
  wave_type: 0,        // sine
  p_env_sustain: 0.15,
  p_env_decay: 0.4,
  p_base_freq: 0.4,
  p_freq_ramp: 0.15,
  p_arp_mod: 0.5,
  p_arp_speed: 0.3,
});

// lose - Descending sad tone
generateAndSave('lose', 'hitHurt', {
  wave_type: 2,        // sawtooth
  p_env_sustain: 0.15,
  p_env_decay: 0.5,
  p_base_freq: 0.35,
  p_freq_ramp: -0.2,
  p_vib_strength: 0.02,
  p_vib_speed: 0.3,
  p_lpf_freq: 0.6,
  p_lpf_ramp: -0.1,
});

// star - Sparkle/ding
generateAndSave('star', 'pickupCoin', {
  wave_type: 0,        // sine
  p_env_sustain: 0.06,
  p_env_decay: 0.3,
  p_base_freq: 0.7,
  p_freq_ramp: 0.05,
  p_arp_mod: 0.7,
  p_arp_speed: 0.15,
});

// clear - Reverse sweep
generateAndSave('clear', 'laserShoot', {
  wave_type: 3,        // noise
  p_env_sustain: 0.06,
  p_env_decay: 0.2,
  p_base_freq: 0.15,
  p_freq_ramp: 0.4,
  p_lpf_freq: 0.6,
  p_lpf_ramp: 0.3,
});

console.log('\nDone! Sound files written to:');
console.log(`  ${webDir}/`);
console.log(`  ${mobileDir}/`);
