import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {COLORS, FONTS, FX_LOGO_W, SAFE, W} from './brand';
import {Hairline, Label, MaskWord} from './components/fx';
import {OilLiquid} from './components/OilLiquid';
import {ease, lerp, rv} from './lib/anim';

// Story Black Week FX MOTORS : rush unique (son d'origine coupé) + voix UGC + habillage offre / noms produits.
// Timeline en frames (30 fps), calée sur les coupes du rush et les phrases de la voix (assets/audio/vo/prise_lea.mp3).
export const BW = {
  voAt: 3, // décalage de la voix (frames)
  endAt: 400, // début de l'end card (le rush passe au noir à 13,5 s)
  total: 525, // voix finie à ~15,6 s + tenue 1,5 s
};

// Noms produits, un par plan (pas de prix).
const PRODUCTS: {from: number; to: number; cat: string; name: string}[] = [
  {from: 6, to: 72, cat: 'Casque cross', name: 'Arai MX-V Evo'},
  {from: 76, to: 151, cat: 'Bottes cross', name: 'Sidi Crossfire 3 SRS'},
  {from: 155, to: 227, cat: 'Casque cross', name: 'Bell Moto-10 MIPS'},
  {from: 267, to: 298, cat: 'Échappement 4 temps', name: 'Échappement HGS'},
  {from: 300, to: 340, cat: 'Bottes cross', name: 'Alpinestars Tech 10 Diva Pink'},
  {from: 342, to: 398, cat: 'Moteur · YZ 125 en 144', name: 'Kit cylindre complet Athena Race'},
];

const X = 72; // colonne de texte (marge gauche, dans la safe zone)

// Bloc qui entre (masque) et sort (fondu + léger glissement) sur [from, to].
const useInOut = (f: number, from: number, to: number) => {
  const pin = rv(f, from, 12);
  const pout = lerp(f, [to - 6, to], [1, 0]);
  return {pin, op: pout, visible: f >= from - 1 && f <= to};
};

const ProductTag: React.FC<{f: number; p: (typeof PRODUCTS)[number]}> = ({f, p}) => {
  const {pin, op, visible} = useInOut(f, p.from, p.to);
  if (!visible) return null;
  const card = rv(f, p.from, 12);
  return (
    <div style={{position: 'absolute', left: X, top: 1390, maxWidth: W - 2 * X, opacity: op}}>
      <div style={{
        padding: '16px 28px 14px 24px', background: 'rgba(11,11,12,0.72)', backdropFilter: 'blur(8px)', borderLeft: `4px solid ${COLORS.yellow}`,
        clipPath: `inset(0 ${(1 - card) * 100}% 0 0)`,
      }}>
        <Label p={rv(f, p.from + 3, 12)} size={21} color={COLORS.yellow}>{p.cat.toUpperCase()}</Label>
        <div style={{fontFamily: FONTS.title, fontSize: 54, lineHeight: 1.1, color: COLORS.white, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4, whiteSpace: 'nowrap'}}>
          <MaskWord p={pin}>{p.name}</MaskWord>
        </div>
      </div>
    </div>
  );
};

// Messages offre, synchronisés sur la voix.
const Offer: React.FC<{f: number}> = ({f}) => {
  const big = (from: number, to: number, children: React.ReactNode, top = 1000) => {
    const {op, visible} = useInOut(f, from, to);
    if (!visible) return null;
    return <div style={{position: 'absolute', left: X, right: X, top, opacity: op}}>{children}</div>;
  };
  return (
    <>
      {/* « Black Week chez FX Motors ! » */}
      {big(2, 56, (
        <>
          <Label p={rv(f, 4, 14)} size={26}>DU 23 AU 29 NOVEMBRE</Label>
          <div style={{fontFamily: FONTS.title, fontSize: 176, lineHeight: 0.98, color: COLORS.white, textTransform: 'uppercase', marginTop: 10}}>
            <MaskWord p={rv(f, 2, 14)}>Black</MaskWord>{' '}
            <MaskWord p={rv(f, 6, 14)} style={{color: COLORS.yellow}}>Week</MaskWord>
          </div>
        </>
      ), 1110)}
      {/* « Moins quinze pour cent sur tout le site dès quatre-vingt-dix-neuf euros d'achat » */}
      {big(57, 156, (
        <>
          <Label p={rv(f, 59, 14)} size={26}>BLACK WEEK</Label>
          <div style={{display: 'flex', alignItems: 'flex-end', gap: 28, marginTop: 4}}>
            <div style={{fontFamily: FONTS.title, fontSize: 230, lineHeight: 1, color: COLORS.yellow}}>
              <MaskWord p={rv(f, 57, 14)}>-15 %</MaskWord>
            </div>
            <div style={{paddingBottom: 30}}>
              <div style={{fontFamily: FONTS.title, fontSize: 64, lineHeight: 1.02, color: COLORS.white, textTransform: 'uppercase'}}>
                <MaskWord p={rv(f, 63, 14)}>Sur tout</MaskWord>
                <br />
                <MaskWord p={rv(f, 66, 14)}>le site</MaskWord>
              </div>
            </div>
          </div>
          <Hairline p={rv(f, 115, 16)} color={COLORS.line} style={{width: W - 2 * X, marginTop: 6}} />
          <div style={{fontFamily: FONTS.info, fontWeight: 600, fontSize: 40, color: COLORS.white, marginTop: 18}}>
            <MaskWord p={rv(f, 117, 14)}>Dès 99 € d'achat</MaskWord>
          </div>
        </>
      ), 1010)}
      {/* « avec le code BLACK FX quinze » */}
      {big(159, 224, (
        <>
          <Label p={rv(f, 160, 14)} size={26}>CODE BLACK WEEK</Label>
          <div style={{fontFamily: FONTS.title, fontSize: 150, lineHeight: 1.02, color: COLORS.white, marginTop: 8}}>
            <MaskWord p={rv(f, 159, 14)}>BLACKFX15</MaskWord>
          </div>
          <div style={{fontFamily: FONTS.info, fontWeight: 500, fontSize: 34, color: COLORS.white, opacity: 0.85, marginTop: 8}}>
            <MaskWord p={rv(f, 166, 14)}>À saisir au panier</MaskWord>
          </div>
        </>
      ), 1110)}
      {/* « Casque Araï, casque Bell, silencieux HGS, bottes Tech 10… tout y passe » : récap sur le plan carton */}
      {(() => {
        const {op, visible} = useInOut(f, 226, 266);
        if (!visible) return null;
        const words = ['Arai.', 'Bell.', 'HGS.', 'Tech 10.'];
        return (
          <div style={{position: 'absolute', left: X, top: 700, opacity: op}}>
            {words.map((w, i) => (
              <div key={w} style={{fontFamily: FONTS.title, fontSize: 150, lineHeight: 1.04, color: i === words.length - 1 ? COLORS.yellow : COLORS.white, textTransform: 'uppercase'}}>
                <MaskWord p={rv(f, 226 + i * 6, 10)}>{w}</MaskWord>
              </div>
            ))}
          </div>
        );
      })()}
      {/* « Et la livraison est offerte » */}
      {big(338, 398, (
        <>
          <Label p={rv(f, 340, 14)} size={26}>DÈS 99 € D'ACHAT</Label>
          <div style={{fontFamily: FONTS.title, fontSize: 120, lineHeight: 1.0, color: COLORS.white, textTransform: 'uppercase', marginTop: 8}}>
            <MaskWord p={rv(f, 338, 14)}>Livraison</MaskWord>
            <br />
            <MaskWord p={rv(f, 343, 14)} style={{color: COLORS.yellow}}>offerte</MaskWord>
          </div>
        </>
      ), 1080)}
    </>
  );
};

// Fondu sombre léger, seulement derrière les textes du bas.
const BottomShade: React.FC<{f: number}> = ({f}) => {
  const strong = Math.max(lerp(f, [222, 230], [0, 1]) * lerp(f, [262, 270], [1, 0]), 0);
  return (
    <>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(11,11,12,0) 44%, rgba(11,11,12,0.5) 62%, rgba(11,11,12,0.8) 100%)', pointerEvents: 'none'}} />
      <AbsoluteFill style={{background: 'rgba(11,11,12,0.45)', opacity: strong, pointerEvents: 'none'}} />
    </>
  );
};

const TopLogo: React.FC<{f: number}> = ({f}) => {
  const p = rv(f, 0, 14);
  const out = lerp(f, [BW.endAt - 8, BW.endAt], [1, 0]);
  return (
    <div style={{position: 'absolute', top: SAFE.top, width: '100%', display: 'flex', justifyContent: 'center', opacity: p * out}}>
      <Img src={staticFile('img/fxmotors.png')} style={{width: 170, filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.35))'}} />
    </div>
  );
};

// End card : « C'est jusqu'au vingt-neuf novembre, fonce ! »
const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const logo = rv(f, 10, 16);
  const row = (at: number) => rv(f, at, 14);
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 90% 60% at 50% 48%, ${COLORS.graphite} 0%, ${COLORS.ink} 100%)`, alignItems: 'center'}}>
      <div style={{position: 'absolute', top: SAFE.top, width: '100%', display: 'flex', justifyContent: 'center', opacity: logo, transform: `translateY(${(1 - logo) * 24}px)`}}>
        <Img src={staticFile('img/fxmotors.png')} style={{width: FX_LOGO_W}} />
      </div>
      <div style={{position: 'absolute', top: 600, left: X, right: X, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
        <Label p={row(16)} size={28}>BLACK WEEK · JUSQU'AU 29.11</Label>
        <div style={{fontFamily: FONTS.title, fontSize: 270, lineHeight: 1, color: COLORS.yellow, marginTop: 14}}>
          <MaskWord p={row(18)}>-15 %</MaskWord>
        </div>
        <div style={{fontFamily: FONTS.title, fontSize: 84, lineHeight: 1.02, color: COLORS.white, textTransform: 'uppercase'}}>
          <MaskWord p={row(24)}>Sur tout le site</MaskWord>
        </div>
        <div style={{fontFamily: FONTS.info, fontWeight: 600, fontSize: 40, color: COLORS.white, marginTop: 14}}>
          <MaskWord p={row(30)}>Dès 99 € d'achat</MaskWord>
        </div>
        <Hairline p={row(36)} color={COLORS.line} origin="center" style={{width: 700, marginTop: 44}} />
        <div style={{display: 'flex', width: 700, marginTop: 34, justifyContent: 'space-between', alignItems: 'flex-start'}}>
          <div style={{textAlign: 'left', opacity: row(40)}}>
            <Label p={row(40)} size={20} color={COLORS.grey}>CODE</Label>
            <div style={{fontFamily: FONTS.title, fontSize: 64, lineHeight: 1.1, color: COLORS.white}}>BLACKFX15</div>
          </div>
          <div style={{width: 2, alignSelf: 'stretch', background: COLORS.line, opacity: row(44)}} />
          <div style={{textAlign: 'right', opacity: row(46)}}>
            <Label p={row(46)} size={20} color={COLORS.grey}>LIVRAISON</Label>
            <div style={{fontFamily: FONTS.title, fontSize: 64, lineHeight: 1.1, color: COLORS.white, textTransform: 'uppercase'}}>Offerte</div>
            <div style={{fontFamily: FONTS.info, fontWeight: 500, fontSize: 24, color: COLORS.grey}}>dès 99 €</div>
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', top: 1430, width: '100%', textAlign: 'center', fontFamily: FONTS.info, fontWeight: 600, fontSize: 30, letterSpacing: 8, color: COLORS.white, opacity: row(56)}}>
        FXMOTORS.FR
      </div>
      <OilLiquid progress={1 - lerp(f, [0, 16], [0, 1], ease.inOut)} frame={f} id="bwend" />
    </AbsoluteFill>
  );
};

export const BlackWeek: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: COLORS.ink}}>
      <Sequence durationInFrames={BW.endAt}>
        <AbsoluteFill>
          <OffthreadVideo muted src={staticFile('work/blackweek.mp4')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </AbsoluteFill>
        <BottomShade f={f} />
        <Offer f={f} />
        {PRODUCTS.map((p) => (
          <ProductTag key={p.name} f={f} p={p} />
        ))}
        <TopLogo f={f} />
        <OilLiquid progress={lerp(f, [BW.endAt - 12, BW.endAt], [0, 1], ease.inOut)} frame={f} id="bwout" />
      </Sequence>
      <Sequence from={BW.endAt}>
        <EndCard />
      </Sequence>
      <Sequence from={BW.voAt}>
        <Audio src={staticFile('audio/vo_bw.mp3')} volume={1} />
      </Sequence>
      <Sequence from={BW.endAt - 12} durationInFrames={30}>
        <Audio src={staticFile('sfx/whoosh.wav')} volume={0.35} />
      </Sequence>
      <AbsoluteFill style={{background: '#000', opacity: lerp(f, [BW.total - 18, BW.total - 1], [0, 1]), pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
