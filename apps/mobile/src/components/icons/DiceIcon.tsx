import Svg, { Rect } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

// Pixel 3D dice - isometric cube with dots
export function DiceIcon({ size = 28, color = '#00FFAA' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      {/* Top face (brightest - isometric rhombus) */}
      <Rect x={4} y={1} width={8} height={1} fill={color} opacity={0.95} />
      <Rect x={3} y={2} width={10} height={1} fill={color} opacity={0.95} />
      <Rect x={3} y={3} width={10} height={1} fill={color} opacity={0.9} />
      <Rect x={4} y={4} width={8} height={1} fill={color} opacity={0.9} />
      {/* Top face highlight */}
      <Rect x={4} y={1} width={8} height={1} fill="white" opacity={0.35} />
      <Rect x={3} y={2} width={10} height={1} fill="white" opacity={0.2} />
      {/* Top face dot */}
      <Rect x={7} y={2} width={2} height={2} fill="#0A0A12" opacity={0.8} />

      {/* Front face (medium brightness) */}
      <Rect x={3} y={5} width={6} height={6} fill={color} opacity={0.7} />
      {/* Front face left edge highlight */}
      <Rect x={3} y={5} width={1} height={6} fill="white" opacity={0.1} />
      {/* Front face dots (showing 3) */}
      <Rect x={4} y={6} width={1} height={1} fill="#0A0A12" opacity={0.7} />
      <Rect x={6} y={8} width={1} height={1} fill="#0A0A12" opacity={0.7} />
      <Rect x={4} y={10} width={1} height={1} fill="#0A0A12" opacity={0.7} />
      {/* Front face bottom shadow */}
      <Rect x={3} y={11} width={6} height={1} fill="black" opacity={0.3} />

      {/* Right face (darkest - shadow side) */}
      <Rect x={9} y={5} width={4} height={6} fill={color} opacity={0.45} />
      {/* Right face dots (showing 2) */}
      <Rect x={10} y={6} width={1} height={1} fill="#0A0A12" opacity={0.5} />
      <Rect x={11} y={9} width={1} height={1} fill="#0A0A12" opacity={0.5} />
      {/* Right face bottom shadow */}
      <Rect x={9} y={11} width={4} height={1} fill="black" opacity={0.4} />
      {/* Right face right edge shadow */}
      <Rect x={13} y={5} width={1} height={6} fill="black" opacity={0.2} />

      {/* Ground shadow */}
      <Rect x={4} y={12} width={9} height={1} fill={color} opacity={0.15} />
      <Rect x={5} y={13} width={7} height={1} fill={color} opacity={0.08} />
    </Svg>
  );
}
