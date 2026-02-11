import Svg, { Rect } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

// Pixel 3D two-player icon - two isometric heads/shoulders
export function DuoIcon({ size = 28, color = '#00FFAA' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      {/* Left person - head */}
      <Rect x={3} y={2} width={3} height={3} fill={color} />
      {/* Left person - head highlight */}
      <Rect x={3} y={2} width={3} height={1} fill="white" opacity={0.3} />
      <Rect x={3} y={2} width={1} height={3} fill="white" opacity={0.15} />
      {/* Left person - head shadow */}
      <Rect x={3} y={5} width={3} height={1} fill="black" opacity={0.3} />

      {/* Left person - body */}
      <Rect x={1} y={6} width={7} height={2} fill={color} opacity={0.85} />
      <Rect x={2} y={8} width={5} height={2} fill={color} opacity={0.7} />
      {/* Left body highlight */}
      <Rect x={1} y={6} width={7} height={1} fill="white" opacity={0.2} />
      {/* Left body depth */}
      <Rect x={2} y={10} width={5} height={1} fill="black" opacity={0.3} />

      {/* Right person - head (offset forward, overlapping) */}
      <Rect x={9} y={3} width={3} height={3} fill={color} />
      {/* Right person - head highlight */}
      <Rect x={9} y={3} width={3} height={1} fill="white" opacity={0.3} />
      <Rect x={9} y={3} width={1} height={3} fill="white" opacity={0.15} />
      {/* Right person - head shadow */}
      <Rect x={9} y={6} width={3} height={1} fill="black" opacity={0.3} />

      {/* Right person - body */}
      <Rect x={7} y={7} width={7} height={2} fill={color} opacity={0.85} />
      <Rect x={8} y={9} width={5} height={2} fill={color} opacity={0.7} />
      {/* Right body highlight */}
      <Rect x={7} y={7} width={7} height={1} fill="white" opacity={0.2} />
      {/* Right body depth */}
      <Rect x={8} y={11} width={5} height={1} fill="black" opacity={0.3} />

      {/* 3D depth blocks - left person */}
      <Rect x={1} y={8} width={1} height={2} fill={color} opacity={0.4} />
      {/* 3D depth blocks - right person */}
      <Rect x={13} y={9} width={1} height={2} fill={color} opacity={0.4} />
    </Svg>
  );
}
