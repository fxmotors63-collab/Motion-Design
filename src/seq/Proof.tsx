import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {COLORS, DUR, FONTS, SHOTS, TXT} from '../brand';
import {Hairline, Label, MaskWord} from '../components/fx';
import {OilLiquid} from '../components/OilLiquid';
import {ShotList, Title} from '../components/ui';
import {ease, lerp, rv} from '../lib/anim';


export const Proof: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: COLORS.ink}}>
      <ShotList frame={f} dim={0} shots={SHOTS.proof} />
      {/* dégradé haut uniquement : le produit reste visible */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(11,11,12,0.82) 0%, rgba(11,11,12,0.6) 22%, transparent 38%)'}} />
      <div style={{position: 'absolute', top: 300, left: 64, right: 64}}>
        <Label p={rv(f, 6, 12)} size={22}>{TXT.proofLabel}</Label>
        <Hairline p={rv(f, 8, 16)} color={COLORS.yellow} style={{width: 90, marginTop: 14, marginBottom: 18}} />
        {TXT.proofTitle.map((l, i) => (
          <Title key={i} size={64}>
            <MaskWord p={rv(f, 10 + i * 6, 14)}>{l}</MaskWord>
          </Title>
        ))}
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '14px 34px', marginTop: 24}}>
          {TXT.proof.map((txt, i) => {
            const p = rv(f, 24 + i * 9, 14);
            return (
              <div key={i} style={{display: 'flex', alignItems: 'baseline', gap: 10, textShadow: '0 2px 12px rgba(0,0,0,0.6)'}}>
                <span style={{fontFamily: FONTS.info, fontWeight: 600, fontSize: 18, letterSpacing: 2, color: COLORS.yellow, opacity: p}}>0{i + 1}</span>
                <span style={{fontFamily: FONTS.info, fontWeight: 600, fontSize: 32, color: COLORS.white}}><MaskWord p={p}>{txt}</MaskWord></span>
              </div>
            );
          })}
        </div>
      </div>
      <OilLiquid progress={1 - lerp(f, [0, 14], [0, 1], ease.inOut)} frame={f} id="proof-in" />
      <OilLiquid progress={lerp(f, [DUR.proof - 15, DUR.proof], [0, 1], ease.inOut)} frame={f} id="proof-out" />
      <Sequence from={DUR.proof - 17}>
        <Audio src={staticFile('sfx/whoosh_rev.wav')} volume={0.4} />
      </Sequence>
    </AbsoluteFill>
  );
};
