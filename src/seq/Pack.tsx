import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {COLORS, DUR, SHOTS, TXT} from '../brand';
import {DirBlur, Hairline, Label, MaskWord} from '../components/fx';
import {OilLiquid} from '../components/OilLiquid';
import {ShotList, Title} from '../components/ui';
import {ease, lerp, rv} from '../lib/anim';

// Le pack : travelling accéléré (×2,8) sur les 5 bidons, cadre complet, texte dans la bande haute.
export const Pack: React.FC = () => {
  const f = useCurrentFrame();
  const whip = lerp(f, [0, 9], [1500, 0], ease.expoOut);
  const whipV = Math.abs(whip - lerp(f - 1, [0, 9], [1500, 0], ease.expoOut));
  return (
    <AbsoluteFill style={{background: COLORS.ink}}>
      <DirBlur x={whipV * 0.4} y={0} style={{position: 'absolute', inset: 0, transform: `translateX(${whip}px)`}}>
        <ShotList frame={f} shots={SHOTS.pack} />
      </DirBlur>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(11,11,12,0.75) 0%, rgba(11,11,12,0.35) 20%, transparent 26%)'}} />
      <div style={{position: 'absolute', top: 290, left: 64, right: 64, display: 'flex', alignItems: 'baseline', gap: 26}}>
        <Label p={rv(f, 4, 12)} size={24}>{TXT.packLabel}</Label>
        <Hairline p={rv(f, 6, 16)} color={COLORS.yellow} style={{width: 60, alignSelf: 'center'}} />
        <Title size={76}>
          <MaskWord p={rv(f, 6, 14)}>{TXT.pack[0]}</MaskWord>{' '}
          <MaskWord p={rv(f, 12, 14)} style={{color: COLORS.yellow}}>{TXT.pack[1]}</MaskWord>
        </Title>
      </div>
      <OilLiquid progress={lerp(f, [DUR.pack - 12, DUR.pack], [0, 1], ease.inOut)} frame={f} id="pack" />
      <Sequence from={DUR.pack - 14}>
        <Audio src={staticFile('sfx/whoosh.wav')} volume={0.35} />
      </Sequence>
    </AbsoluteFill>
  );
};
