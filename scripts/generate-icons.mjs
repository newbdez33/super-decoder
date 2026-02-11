import sharp from 'sharp';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const svgPath = join(root, 'apps/mobile/assets/icon.svg');
const svgBuffer = readFileSync(svgPath);

const outputDir = join(root, 'apps/mobile/assets/icons');

// iOS icon sizes (filename: size)
const iosIcons = {
  'ios-1024.png': 1024,       // App Store
  'ios-180.png': 180,         // iPhone @3x
  'ios-120.png': 120,         // iPhone @2x
  'ios-167.png': 167,         // iPad Pro @2x
  'ios-152.png': 152,         // iPad @2x
  'ios-87.png': 87,           // Spotlight @3x
  'ios-80.png': 80,           // Spotlight @2x
  'ios-76.png': 76,           // iPad @1x
  'ios-60.png': 60,           // iPhone notification @3x
  'ios-58.png': 58,           // Settings @2x
  'ios-40.png': 40,           // Notification @2x
  'ios-29.png': 29,           // Settings @1x
  'ios-20.png': 20,           // Notification @1x
};

// Android icon sizes
const androidIcons = {
  'android-512.png': 512,     // Play Store
  'android-192.png': 192,     // xxxhdpi
  'android-144.png': 144,     // xxhdpi
  'android-96.png': 96,       // xhdpi
  'android-72.png': 72,       // hdpi
  'android-48.png': 48,       // mdpi
};

// Android adaptive icon (foreground layer, 108dp with safe zone)
const adaptiveIcons = {
  'adaptive-foreground-432.png': 432,   // xxxhdpi (108 * 4)
  'adaptive-foreground-324.png': 324,   // xxhdpi  (108 * 3)
  'adaptive-foreground-216.png': 216,   // xhdpi   (108 * 2)
  'adaptive-foreground-162.png': 162,   // hdpi    (108 * 1.5)
  'adaptive-foreground-108.png': 108,   // mdpi    (108 * 1)
};

async function generate() {
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const allIcons = { ...iosIcons, ...androidIcons };

  // Generate standard icons
  for (const [filename, size] of Object.entries(allIcons)) {
    await sharp(svgBuffer, { density: Math.ceil((size / 1024) * 300) })
      .resize(size, size)
      .png()
      .toFile(join(outputDir, filename));
    console.log(`  ${filename} (${size}x${size})`);
  }

  // Generate adaptive icon foreground (with padding for safe zone)
  // Adaptive icons: 108dp canvas, content in 66dp center (61% of canvas)
  for (const [filename, size] of Object.entries(adaptiveIcons)) {
    const contentSize = Math.round(size * 0.66);
    const padding = Math.round((size - contentSize) / 2);

    const resized = await sharp(svgBuffer, { density: 300 })
      .resize(contentSize, contentSize)
      .png()
      .toBuffer();

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 10, g: 10, b: 18, alpha: 1 }, // #0A0A12
      },
    })
      .composite([{ input: resized, left: padding, top: padding }])
      .png()
      .toFile(join(outputDir, filename));
    console.log(`  ${filename} (${size}x${size})`);
  }

  // Also overwrite the main icon.png used by Expo
  await sharp(svgBuffer, { density: 300 })
    .resize(1024, 1024)
    .png()
    .toFile(join(root, 'apps/mobile/assets/icon.png'));
  console.log('  icon.png (1024x1024) — Expo main icon');

  console.log(`\nDone! Generated ${Object.keys(allIcons).length + Object.keys(adaptiveIcons).length + 1} icons in ${outputDir}`);
}

generate().catch(console.error);
