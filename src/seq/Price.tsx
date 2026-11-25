import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {COLORS, fmtPrice, FONTS, PRICES, TXT} from '../brand';
import {DirBlur, Hairline, Label, MaskWord, Sheen} from '../components/fx';
import {PriceCounter} from '../components/PriceCounter';
import {Title} from '../components/ui';
import {decay, ease, lerp, rv} from '../lib/anim';

export const LAND = 36; // 15,96 €/L se fige à 10,8 s dans Main (sur une frappe)
const COUNT_FROM = 12;
const ROWS_AT = 54;
const CLAIM_AT = 106; // calé sur la voix « Le meilleur prix du web » (13,15 s dans Main)

const priceAt = (f: number) => lerp(f, [COUNT_FROM, LAND], [PRICES.perLOld, PRICES.perL], ease.inOut);

export const Price: React.FC = () => {
  const f = useCurrentFrame();
  const v = priceAt(f);
  const vel = v - priceAt(f - 1);
  const settle = 1 + decay(f, LAND, 6) * 0.035;
  const old = rv(f, 4, 10);
  const strike = rv(f, 9, 8);
  // sortie : le contenu remonte et se floute, le fond encre reste
  const out = lerp(f, [130, 144], [0, 1], ease.expoIn);
  const outV = out - lerp(f - 1, [130, 144], [0, 1], ease.expoIn);
  return (
    <AbsoluteFill style={{background: COLORS.ink}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 90% 45% at ${50 + 8 * Math.sin(f / 40)}% 45%, ${COLORS.graphite} 0%, ${COLORS.ink} 75%)`}} />
      <DirBlur x={0} y={outV * 260} style={{position: 'absolute', inset: 0, transform: `translateY(${-out * 260}px)`, opacity: 1 - out}}>
        <div style={{position: 'absolute', top: 400, left: 64, right: 64}}>
          <Label p={rv(f, 2, 12)}>{TXT.priceLabel}</Label>
          <Hairline p={rv(f, 4, 16)} color={COLORS.yellow} style={{width: 120, marginTop: 20}} />
          <div style={{marginTop: 40, position: 'relative', display: 'inline-block', fontFamily: FONTS.info, fontWeight: 400, fontSize: 58, color: COLORS.grey, opacity: old}}>
            <MaskWord p={old}>{fmtPrice(PRICES.perLOld)} €/L</MaskWord>
            <div style={{position: 'absolute', left: -6, right: -6, top: '52%', height: 3, background: COLORS.white, transform: `scaleX(${strike})`, transformOrigin: 'left'}} />
          </div>
        </div>
        <div style={{position: 'absolute', top: 640, left: 50, opacity: rv(f, COUNT_FROM - 6, 8), transform: `scale(${settle})`, transformOrigin: 'left center'}}>
          <PriceCounter value={v} size={300} vel={vel} />
        </div>
        <Hairline p={rv(f, LAND, 18)} color={COLORS.yellow} thickness={4} style={{position: 'absolute', top: 990, left: 64, width: 400}} />
        <div style={{position: 'absolute', top: 1042, left: 64, right: 64}}>
          <Title size={60} color={COLORS.yellow}>
            <MaskWord p={rv(f, CLAIM_AT, 14)}>{TXT.priceClaim}</MaskWord>
          </Title>
        </div>
        <div style={{position: 'absolute', top: 1140, left: 64, right: 64}}>
          {TXT.priceRows.map(([k, val], i) => {
            const p = rv(f, ROWS_AT + i * 8, 14);
            const last = i === TXT.priceRows.length - 1;
            return (
              <div key={i}>
                <Hairline p={p} />
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '17px 0'}}>
                  <div style={{fontFamily: FONTS.info, fontWeight: 600, fontSize: 24, letterSpacing: 5, color: COLORS.grey}}>
                    <MaskWord p={p}>{k}</MaskWord>
                  </div>
                  <div style={{
                    fontFamily: FONTS.title, fontSize: 60, color: last ? COLORS.yellow : COLORS.white, opacity: i === 1 ? 0.6 : 1,
                    textDecoration: i === 1 ? 'line-through' : undefined, textDecorationThickness: 3,
                  }}>
                    <MaskWord p={p}>{val}</MaskWord>
                  </div>
                </div>
              </div>
            );
          })}
          <Hairline p={rv(f, ROWS_AT + 24, 14)} />
        </div>
      </DirBlur>
      <Sheen frame={f} at={LAND + 6} dur={20} opacity={0.4} width={260} />
      <Sheen frame={f} at={108} dur={20} opacity={0.3} width={220} />
      <Sequence from={LAND - 1}>
        <Audio src={staticFile('sfx/impact_low.wav')} volume={0.35} />
      </Sequence>
      <Sequence from={128}>
        <Audio src={staticFile('sfx/whoosh_rev.wav')} volume={0.45} />
      </Sequence>
    </AbsoluteFill>
  );
};
