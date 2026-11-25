import React from 'react';
import {COLORS, H, W} from '../brand';

// Nappe d'huile sombre qui descend avec une onde douce. progress 0 = rien, 1 = écran couvert.
// Reflet spéculaire sur le front de la vague + filet jaune.
const edge = (level: number, frame: number, amp: number) => {
  const pts: string[] = [];
  for (let x = -20; x <= W + 20; x += 30) {
    const y = level + Math.sin(x / 210 + frame / 9) * amp + Math.sin(x / 95 - frame / 6) * amp * 0.35;
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return pts;
};

export const OilLiquid: React.FC<{progress: number; frame: number; id?: string}> = ({progress, frame, id = 'oil'}) => {
  if (progress <= 0) return null;
  if (progress >= 0.999) return <div style={{position: 'absolute', inset: 0, background: COLORS.ink, pointerEvents: 'none'}} />;
  const level = -120 + progress * (H + 240);
  const amp = 26 + 40 * Math.sin(progress * Math.PI);
  const front = edge(level, frame, amp);
  const back = edge(level - 90 * Math.sin(progress * Math.PI), frame + 20, amp * 0.8);
  const shape = (pts: string[]) => `M -20,-20 L ${pts.join(' L ')} L ${W + 20},-20 Z`;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={COLORS.ink} />
          <stop offset="1" stopColor={COLORS.graphite} />
        </linearGradient>
        <linearGradient id={`${id}-spec`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={shape(back)} fill={COLORS.graphite} opacity={0.7} />
      <path d={shape(front)} fill={`url(#${id}-g)`} />
      <polyline points={front.map((p) => p.replace(/,(.*)/, (_, y) => `,${Number(y) - 10}`)).join(' ')} fill="none" stroke={`url(#${id}-spec)`} strokeWidth={6} opacity={0.5} />
      <polyline points={front.join(' ')} fill="none" stroke={COLORS.yellow} strokeWidth={3} />
    </svg>
  );
};
