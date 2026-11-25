import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {BEAT, COLORS, DUR, FONTS, TXT} from '../brand';
import {Hairline, Label, MaskWord, Sheen} from '../components/fx';
import {IsoBottle, IsoGrid, IsoStage} from '../components/Iso';
import {OilLiquid} from '../components/OilLiquid';
import {Title} from '../components/ui';
import {ease, lerp, rv} from '../lib/anim';

// Offre 4 + 1 en 3D isométrique : les bidons tombent sur la grille sur les demi-temps, le 5e sur un temps fort.
const IN = [BEAT, BEAT * 1.5, BEAT * 2, BEAT * 2.5, BEAT * 5];
const FALL = 9;
const FALL_HERO = 5;
const SPACING = 175;

// Chute + rebond. Le 5e tombe plus vite et rebondit plus fort.
const dropZ = (f: number, at: number, hero = false) => {
  const t = f - at;
  if (t < 0) return null;
  const fall = hero ? FALL_HERO : FALL;
  if (t < fall) return 900 * (1 - (t / fall) ** 2);
  const tt = t - fall;
  return hero ? 150 * Math.abs(Math.sin(tt * 0.42)) * Math.exp(-tt / 6) : 40 * Math.abs(Math.sin(tt * 0.45)) * Math.exp(-tt / 3);
};

export const Deal: React.FC = () => {
  const f = useCurrentFrame();
  const rotZ = lerp(f, [0, DUR.deal], [-52, -38], ease.inOut);
  const zoom = lerp(f, [0, 20], [0.82, 0.92], ease.expoOut) + lerp(f, [20, DUR.deal], [0, 0.06]);
  const land = (i: number) => IN[i] + (i === 4 ? FALL_HERO : FALL);
  const bump = IN.reduce((s, _, i) => s + (f >= land(i) ? Math.exp(-(f - land(i)) / 3) * (i === 4 ? 14 : 5) : 0), 0);
  const paidP = rv(f, BEAT * 3.5, 14);
  const freeP = rv(f, BEAT * 6, 14);
  const glow = rv(f, land(4), 18);
  const ripple = (k: number) => Math.min(1, Math.max(0, (f - land(4) - k * 6) / 24));
  return (
    <AbsoluteFill style={{background: COLORS.ink, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 75% 45% at 50% 60%, ${COLORS.graphite} 0%, ${COLORS.ink} 72%)`}} />
      <div style={{position: 'absolute', left: 0, top: 1110 + bump, width: 1080, height: 0}}>
        <IsoStage rotZ={rotZ} scale={zoom}>
          <IsoGrid x={-560} y={-420} w={1120} d={840} opacity={rv(f, 0, 20)} />
          {/* filets au sol sous les 4 achetés / le 5e */}
          <div style={{position: 'absolute', left: -440, top: 130, width: 3 * SPACING + 150, height: 3, background: COLORS.white, transform: `scaleX(${paidP})`, transformOrigin: 'left'}} />
          <div style={{position: 'absolute', left: -440 + 4 * SPACING - 10, top: 130, width: 170, height: 3, background: COLORS.yellow, transform: `scaleX(${freeP})`, transformOrigin: 'left'}} />
          {IN.map((at, i) => (
            <div key={'n' + i} style={{
              position: 'absolute', left: -440 + i * SPACING + 20, top: 150, fontFamily: FONTS.info, fontWeight: 600, fontSize: 30, letterSpacing: 3,
              color: i === 4 ? COLORS.yellow : COLORS.grey, opacity: rv(f, at + FALL, 10),
            }}>0{i + 1}</div>
          ))}
          {/* ondes au sol sous le 5e bidon */}
          {[0, 1].map((k) => {
            const r = ripple(k);
            return r > 0 && r < 1 ? (
              <div key={'r' + k} style={{position: 'absolute', left: -440 + 4 * SPACING + 70 - 60 - r * 160, top: 2 - 60 - r * 160, width: 120 + r * 320, height: 120 + r * 320,
                borderRadius: '50%', border: `3px solid rgba(255,229,0,${1 - r})`, transform: 'translateZ(1px)'}} />
            ) : null;
          })}
          {/* ordre de rendu : du fond vers l'avant */}
          {[4, 3, 2, 1, 0].map((i) => {
            const z = dropZ(f, IN[i], i === 4);
            return z === null ? null : <IsoBottle key={i} x={-440 + i * SPACING} y={-40} z={z} glow={i === 4 ? glow : 0} />;
          })}
        </IsoStage>
      </div>
      <div style={{position: 'absolute', top: 330, left: 64, right: 64}}>
        <Label p={rv(f, 4, 12)}>{TXT.dealLabel}</Label>
        <Hairline p={rv(f, 6, 16)} color={COLORS.yellow} style={{width: 120, marginTop: 20, marginBottom: 28}} />
        {TXT.deal.map((l, i) => (
          <Title key={i} size={124} color={i ? COLORS.yellow : COLORS.white}>
            <MaskWord p={rv(f, 8 + i * 8, 14)}>{l}</MaskWord>
          </Title>
        ))}
      </div>
      <div style={{position: 'absolute', top: 1400, left: 64, right: 64, display: 'flex', justifyContent: 'space-between', fontFamily: FONTS.info, fontWeight: 600, fontSize: 28, letterSpacing: 5}}>
        <div style={{color: COLORS.white}}><MaskWord p={paidP}>{TXT.dealPaid}</MaskWord></div>
        <div style={{color: COLORS.yellow}}><MaskWord p={freeP}>{TXT.dealFree}</MaskWord></div>
      </div>
      <Sheen frame={f} at={BEAT * 6} dur={22} opacity={0.3} />
      <OilLiquid progress={1 - lerp(f, [0, 14], [0, 1], ease.inOut)} frame={f} id="deal-in" />
      <OilLiquid progress={lerp(f, [DUR.deal - 15, DUR.deal], [0, 1], ease.inOut)} frame={f} id="deal-out" />
      {IN.map((at, i) => (
        <Sequence key={i} from={land(i) - 1} durationInFrames={15}>
          <Audio src={staticFile('sfx/clunk.wav')} volume={i === 4 ? 0.4 : 0.25} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
