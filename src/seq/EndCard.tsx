import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {ASSETS, COLORS, DUR, fmtPrice, FONTS, FX_LOGO_W, PRICES, SAFE, SHOTS, TXT} from '../brand';
import {Hairline, Label, MaskWord, Sheen} from '../components/fx';
import {OilLiquid} from '../components/OilLiquid';
import {PriceCounter} from '../components/PriceCounter';
import {ShotList} from '../components/ui';
import {ease, lerp, rv} from '../lib/anim';

// Prix du pack mis en avant (99,75 → 79,80 €), prix au litre en rappel.
const priceAt = (f: number) => lerp(f, [26, 42], [PRICES.packOldNum, PRICES.packNum], ease.inOut);

export const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const v = priceAt(f);
  const vel = v - priceAt(f - 1);
  const logo = rv(f, 14, 16);
  const col = rv(f, 22, 14);
  const stock = rv(f, 54, 14);
  const cta = rv(f, 72, 14);
  const loop = ((f - 72) % 36) / 36;
  return (
    <AbsoluteFill style={{background: COLORS.ink}}>
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <ShotList frame={f} shots={SHOTS.end} />
        <Sheen frame={f} at={30} dur={30} opacity={0.5} width={260} />
      </AbsoluteFill>
      <div style={{position: 'absolute', top: SAFE.top, width: '100%', display: 'flex', justifyContent: 'center', opacity: logo, transform: `translateY(${(1 - logo) * 24}px)`, filter: `blur(${(1 - logo) * 8}px)`}}>
        <Img src={staticFile(ASSETS.logoShop)} style={{width: FX_LOGO_W}} />
      </div>
      {/* encart prix : fond encre translucide + liseré jaune, lisible sans assombrir la vidéo */}
      <div style={{
        position: 'absolute', top: 980, right: 64, width: 280, padding: '22px 22px 18px', boxSizing: 'border-box', background: 'rgba(11,11,12,0.78)',
        backdropFilter: 'blur(8px)', borderRight: `4px solid ${COLORS.yellow}`, textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
        opacity: col, transform: `translateX(${(1 - col) * 40}px)`,
      }}>
        <Label p={col} size={19}>{TXT.endPackLabel}</Label>
        <div style={{position: 'relative', marginTop: 12, fontFamily: FONTS.info, fontWeight: 400, fontSize: 28, color: COLORS.grey}}>
          {PRICES.packOld}
          <div style={{position: 'absolute', left: -4, right: -4, top: '52%', height: 2, background: COLORS.white, transform: `scaleX(${rv(f, 30, 10)})`, transformOrigin: 'left'}} />
        </div>
        <PriceCounter value={v} size={86} vel={vel} suffix="€" />
        <div style={{fontFamily: FONTS.info, fontWeight: 600, fontSize: 28, color: COLORS.yellow}}>
          <MaskWord p={rv(f, 42, 12)}>Soit {fmtPrice(PRICES.perL)} €/L</MaskWord>
        </div>
        <div style={{fontFamily: FONTS.info, fontWeight: 500, fontSize: 21, letterSpacing: 2, color: COLORS.grey, marginTop: 8}}>{TXT.url}</div>
      </div>
      {/* bandeau bas : stock + lien du pack, abaissé sous le bidon (déborde de 66 px dans la zone basse) */}
      <div style={{position: 'absolute', top: 1470, left: 0, right: 0, height: 116, overflow: 'hidden'}}>
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(11,11,12,0.8)', backdropFilter: 'blur(8px)', borderTop: `1px solid ${COLORS.line}`,
          transform: `translateY(${(1 - stock) * 100}%)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONTS.info, fontWeight: 600, fontSize: 26, letterSpacing: 4, color: COLORS.white, whiteSpace: 'nowrap'}}>
            <span style={{position: 'relative', width: 12, height: 12}}>
              <span style={{position: 'absolute', inset: 0, borderRadius: 6, background: COLORS.yellow}} />
              <span style={{position: 'absolute', inset: 0, borderRadius: 6, border: `2px solid ${COLORS.yellow}`, transform: `scale(${1 + ((f % 40) / 40) * 2})`, opacity: 1 - (f % 40) / 40}} />
            </span>
            {TXT.stock}
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <div style={{fontFamily: FONTS.title, fontSize: 58, lineHeight: 1.05, color: COLORS.white, letterSpacing: 1}}>
              <MaskWord p={cta}>{TXT.cta}</MaskWord>
            </div>
            <svg width={30} height={54} style={{opacity: cta}}>
              <line x1={15} y1={4} x2={15} y2={4 + 38 * Math.min(1, loop * 1.6)} stroke={COLORS.yellow} strokeWidth={3} />
              <path d={`M 5 ${32 + loop * 9} L 15 ${43 + loop * 9} L 25 ${32 + loop * 9}`} fill="none" stroke={COLORS.yellow} strokeWidth={3} opacity={1 - Math.max(0, loop - 0.7) / 0.3} />
            </svg>
          </div>
        </div>
      </div>
      <OilLiquid progress={1 - lerp(f, [0, 18], [0, 1], ease.inOut)} frame={f} id="end" />
    </AbsoluteFill>
  );
};
