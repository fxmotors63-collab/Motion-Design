import React from 'react';
import {COLORS, FONTS} from '../brand';
import {DirBlur} from './fx';

// Odomètre : chaque chiffre roule, avec retenue façon compteur mécanique.
const Digit: React.FC<{pos: number; size: number; blur: number}> = ({pos, size, blur}) => {
  const h = size * 1.1;
  return (
    <div style={{height: h, width: size * 0.56, overflow: 'hidden', display: 'inline-block'}}>
      <DirBlur x={0} y={blur} style={{transform: `translateY(${-pos * h}px)`}}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, i) => (
          <div key={i} style={{height: h, lineHeight: `${h}px`, textAlign: 'center'}}>
            {d}
          </div>
        ))}
      </DirBlur>
    </div>
  );
};

// vel = variation de la valeur (en €) par frame → flou vertical sur les chiffres qui roulent.
export const PriceCounter: React.FC<{value: number; size: number; color?: string; suffix?: string; suffixColor?: string; vel?: number}> = ({
  value,
  size,
  color = COLORS.white,
  suffix = '€/L',
  suffixColor = COLORS.yellow,
  vel = 0,
}) => {
  const blur = (i: number) => Math.min(40, (Math.abs(vel) * 100 * size * 1.1 * 0.12) / 10 ** i);
  const cents = Math.round(value * 100000) / 1000;
  const pos: number[] = [];
  for (let i = 0; i < 4; i++) {
    const base = Math.floor(cents / 10 ** i) % 10;
    pos[i] = i === 0 ? cents % 10 : base + Math.max(0, pos[i - 1] - 9);
  }
  return (
    <div
      style={{
        fontFamily: FONTS.title,
        fontSize: size,
        color,
        display: 'flex',
        alignItems: 'center',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      <Digit pos={pos[3]} size={size} blur={blur(3)} />
      <Digit pos={pos[2]} size={size} blur={blur(2)} />
      <span style={{width: size * 0.22, textAlign: 'center'}}>,</span>
      <Digit pos={pos[1]} size={size} blur={blur(1)} />
      <Digit pos={pos[0]} size={size} blur={blur(0)} />
      <span style={{fontFamily: FONTS.info, fontWeight: 500, fontSize: size * 0.26, color: suffixColor, marginLeft: size * 0.1, alignSelf: 'flex-end', marginBottom: size * 0.26, letterSpacing: size * 0.01}}>
        {suffix}
      </span>
    </div>
  );
};
