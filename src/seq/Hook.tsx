import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {ASSETS, COLORS, FONTS, FX_LOGO_H, FX_LOGO_W, MOTOREX_LOGO_W, SAFE, SHOTS, TXT} from '../brand';
import {DirBlur, Hairline, MaskWord} from '../components/fx';
import {OilLiquid} from '../components/OilLiquid';
import {Thumbnail} from '../components/Thumbnail';
import {ShotList, Title} from '../components/ui';
import {ease, lerp, rv} from '../lib/anim';

const OUT = 63;

export type Variant = 'A' | 'B';
// Version B : miniature tenue 0,6 s, puis vague d'huile qui l'emporte et révèle le hook.
const B_HOLD = 18;
const B_IN = 26;

export const Hook: React.FC<{variant?: Variant}> = ({variant = 'A'}) => {
  const f = useCurrentFrame();
  const isB = variant === 'B';
  const t0 = isB ? B_IN : 0; // décalage des entrées de texte
  const lines = isB ? TXT.hookB : TXT.hook;
  // zoom arrière rapide puis push lent : accroche dès la 1re frame sans effet cheap
  const whip = lerp(f, [OUT, 72], [0, -1500], ease.expoIn);
  const whipV = Math.abs(whip - lerp(f - 1, [OUT, 72], [0, -1500], ease.expoIn));
  const sub = rv(f, 18 + t0, 14);
  return (
    <AbsoluteFill style={{background: COLORS.ink}}>
      <DirBlur x={whipV * 0.4} y={0} style={{position: 'absolute', inset: 0, transform: `translateX(${whip}px)`}}>
        <ShotList frame={f} dim={0.04} shots={SHOTS.hook} />
        <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(11,11,12,0.5) 0%, transparent 22%, transparent 42%, rgba(11,11,12,0.72) 72%, rgba(11,11,12,0.85) 100%)`}} />
        {/* logos, taille réduite : Motorex centré en haut, FX MOTORS centré en bas */}
        <div style={{position: 'absolute', top: SAFE.top, width: '100%', display: 'flex', justifyContent: 'center', opacity: rv(f, t0, 10), transform: `translateY(${(1 - rv(f, t0, 12)) * -20}px)`}}>
          <Img src={staticFile(ASSETS.logoBrand)} style={{width: MOTOREX_LOGO_W, borderRadius: 4}} />
        </div>
        <div style={{position: 'absolute', top: SAFE.textMaxY - FX_LOGO_H, width: '100%', display: 'flex', justifyContent: 'center', opacity: rv(f, 6 + t0, 10), transform: `translateY(${(1 - rv(f, 6 + t0, 12)) * 20}px)`}}>
          <Img src={staticFile(ASSETS.logoShop)} style={{width: FX_LOGO_W}} />
        </div>
        <div style={{position: 'absolute', left: 64, right: 64, top: 860}}>
          <Hairline p={rv(f, 2 + t0, 16)} color={COLORS.yellow} style={{width: 120, marginBottom: 30}} />
          {lines.map((l, i) => (
            <Title key={i} size={isB ? 104 : 112} color={i === lines.length - 1 ? COLORS.yellow : COLORS.white}>
              <MaskWord p={lerp(f, [-4 + i * 5 + t0, 10 + i * 5 + t0], [0, 1], ease.expoOut)}>{l}</MaskWord>
            </Title>
          ))}
          <div style={{marginTop: 34, display: 'inline-block'}}>
            <div style={{fontFamily: FONTS.info, fontWeight: 500, fontSize: 60, color: COLORS.white, letterSpacing: -0.5}}>
              <MaskWord p={sub}>{isB ? TXT.hookBSub : TXT.hookSub}</MaskWord>
            </div>
            <Hairline p={rv(f, 28 + t0, 14)} color={COLORS.yellow} thickness={4} style={{marginTop: 10}} />
          </div>
        </div>
      </DirBlur>
      {isB && f < B_IN + 12 && (
        <>
          {f < B_IN && (
            <AbsoluteFill style={{transform: `scale(${1 + lerp(f, [B_HOLD - 4, B_IN], [0, 0.06], ease.expoIn)})`}}>
              <Thumbnail />
            </AbsoluteFill>
          )}
          <OilLiquid progress={f < B_IN ? lerp(f, [B_HOLD - 2, B_IN], [0, 1], ease.inOut) : 1 - lerp(f, [B_IN, B_IN + 12], [0, 1], ease.inOut)} frame={f} id="hookb" />
        </>
      )}
      {isB && (
        <Sequence from={B_HOLD - 4} durationInFrames={20}>
          <Audio src={staticFile('sfx/whoosh_rev.wav')} volume={0.5} />
        </Sequence>
      )}
      <Sequence from={OUT - 3}>
        <Audio src={staticFile('sfx/whoosh.wav')} volume={0.55} />
      </Sequence>
    </AbsoluteFill>
  );
};
