import Svg, { Rect } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

// Pixel 3D play button - isometric arrow
export function SoloIcon({ size = 28, color = '#00FFAA' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      {/* Shadow / depth layer (darker) */}
      <Rect x={5} y={3} width={1} height={1} fill={color} opacity={0.3} />
      <Rect x={5} y={4} width={1} height={1} fill={color} opacity={0.3} />
      <Rect x={5} y={5} width={1} height={1} fill={color} opacity={0.3} />
      <Rect x={5} y={6} width={1} height={1} fill={color} opacity={0.3} />
      <Rect x={5} y={7} width={1} height={1} fill={color} opacity={0.3} />
      <Rect x={5} y={8} width={1} height={1} fill={color} opacity={0.3} />
      <Rect x={5} y={9} width={1} height={1} fill={color} opacity={0.3} />
      <Rect x={5} y={10} width={1} height={1} fill={color} opacity={0.3} />
      <Rect x={5} y={11} width={1} height={1} fill={color} opacity={0.3} />
      <Rect x={5} y={12} width={1} height={1} fill={color} opacity={0.3} />
      <Rect x={5} y={13} width={1} height={1} fill={color} opacity={0.3} />

      {/* Main arrow body */}
      <Rect x={4} y={2} width={1} height={11} fill={color} />
      <Rect x={5} y={3} width={1} height={9} fill={color} opacity={0.85} />
      <Rect x={6} y={4} width={1} height={7} fill={color} opacity={0.9} />
      <Rect x={7} y={5} width={1} height={5} fill={color} />
      <Rect x={8} y={6} width={1} height={3} fill={color} />
      <Rect x={9} y={7} width={1} height={1} fill={color} />

      {/* 3D top highlight */}
      <Rect x={4} y={2} width={1} height={1} fill="white" opacity={0.4} />
      <Rect x={5} y={3} width={1} height={1} fill="white" opacity={0.3} />
      <Rect x={6} y={4} width={1} height={1} fill="white" opacity={0.25} />
      <Rect x={7} y={5} width={1} height={1} fill="white" opacity={0.2} />
      <Rect x={8} y={6} width={1} height={1} fill="white" opacity={0.15} />

      {/* 3D bottom shadow */}
      <Rect x={4} y={13} width={1} height={1} fill="black" opacity={0.4} />
      <Rect x={5} y={12} width={1} height={1} fill="black" opacity={0.3} />
      <Rect x={6} y={11} width={1} height={1} fill="black" opacity={0.25} />
      <Rect x={7} y={10} width={1} height={1} fill="black" opacity={0.2} />
    </Svg>
  );
}
