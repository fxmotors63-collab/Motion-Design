import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {COLORS, FONTS, FX_LOGO_W, SAFE, W} from './brand';
import {Hairline, Label, MaskWord} from './components/fx';
import {OilLiquid} from './components/OilLiquid';
import {ease, lerp, rv} from './lib/anim';

// Story Black Week FX MOTORS : rush unique (son d'origine coupé) + voix UGC Léa (assets/audio/vo/prise_lea_v2.mp3)
// qui cite chaque produit pendant qu'il est à l'écran, puis l'offre sur l'end card.
// Chaque plan du rush est recalé sur la phrase qui le nomme (ralenti léger ou coupe, jamais de zoom).
// Repères voix (s) : Black Week 0 · Arai 0,88 · Sidi 2,94 · Bell 6,33 · « et c'est pas fini » 8,19 · HGS 9,55 ·
// Tech 10 10,65 · Athena 12,37 · -15 % 14,59 · dès 99 € 16,61 · code 17,71 · livraison 19,46 · fin 20,66.
export const BW = {
  endAt: 435, // end card (14,5 s), juste avant « Moins quinze pour cent »
  total: 666, // voix finie à 20,66 s + tenue 1,5 s
};

// Plans : [début, durée] sur la timeline, image source de départ, vitesse (source consommée = dur × rate).
const SHOTS = [
  {at: 0, dur: 87, src: 0, rate: 0.83}, // Arai (2 plans du rush)
  {at: 87, dur: 101, src: 72, rate: 0.78}, // Sidi
  {at: 188, dur: 56, src: 151, rate: 1}, // Bell
  {at: 244, dur: 41, src: 227, rate: 0.93}, // carton
  {at: 285, dur: 33, src: 265, rate: 1}, // HGS
  {at: 318, dur: 52, src: 298, rate: 0.81}, // Tech 10
  {at: 370, dur: 65, src: 340, rate: 0.97}, // Athena
];

// Étiquettes produits (pas de prix), affichées quand la voix nomme le produit.
const PRODUCTS: {from: number; to: number; cat: string; name: string}[] = [
  {from: 26, to: 87, cat: 'Casque cross', name: 'Arai MX-V Evo'},
  {from: 89, to: 188, cat: 'Bottes cross', name: 'Sidi Crossfire 3 SRS'},
  {from: 190, to: 244, cat: 'Casque cross', name: 'Bell Moto-10 MIPS'},
  {from: 287, to: 318, cat: 'Échappement 4 temps', name: 'Échappement HGS'},
  {from: 320, to: 370, cat: 'Bottes cross', name: 'Alpinestars Tech 10 Diva Pink'},
  {from: 372, to: 435, cat: 'Moteur · YZ 125 en 144', name: 'Kit cylindre complet Athena Race'},
];

const X = 72; // colonne de texte (marge gauche, dans la safe zone)

// Entrée (masque) / sortie (fondu) d'un bloc sur [from, to].
const inOut = (f: number, from: number, to: number) => ({
  pin: rv(f, from, 12),
  op: lerp(f, [to - 6, to], [1, 0]),
  visible: f >= from - 1 && f <= to,
});

const ProductTag: React.FC<{f: number; p: (typeof PRODUCTS)[number]}> = ({f, p}) => {
  const {pin, op, visible} = inOut(f, p.from, p.to);
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

// Titres sur la vidéo : « Black Week ! » puis « et c'est pas fini : » sur le plan carton.
const Titles: React.FC<{f: number}> = ({f}) => {
  const hook = inOut(f, 0, 84);
  const fini = inOut(f, 244, 284);
  return (
    <>
      {hook.visible && (
        <div style={{position: 'absolute', left: X, top: 1110, opacity: hook.op}}>
          <Label p={rv(f, 4, 14)} size={26}>DU 23 AU 29 NOVEMBRE</Label>
          <div style={{fontFamily: FONTS.title, fontSize: 176, lineHeight: 0.98, color: COLORS.white, textTransform: 'uppercase', marginTop: 10}}>
            <MaskWord p={rv(f, 0, 12)}>Black</MaskWord>{' '}
            <MaskWord p={rv(f, 5, 12)} style={{color: COLORS.yellow}}>Week</MaskWord>
          </div>
        </div>
      )}
      {fini.visible && (
        <div style={{position: 'absolute', left: X, top: 760, opacity: fini.op}}>
          {["Et c'est", 'pas fini.'].map((w, i) => (
            <div key={w} style={{fontFamily: FONTS.title, fontSize: 170, lineHeight: 1.02, color: i === 1 ? COLORS.yellow : COLORS.white, textTransform: 'uppercase'}}>
              <MaskWord p={rv(f, 244 + i * 9, 12)}>{w}</MaskWord>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

// Fondu sombre léger, derrière les textes du bas (plus marqué sur le plan carton, sans produit).
const Shade: React.FC<{f: number}> = ({f}) => {
  const carton = lerp(f, [240, 248], [0, 1]) * lerp(f, [280, 288], [1, 0]);
  return (
    <>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(11,11,12,0) 44%, rgba(11,11,12,0.5) 62%, rgba(11,11,12,0.8) 100%)', pointerEvents: 'none'}} />
      <AbsoluteFill style={{background: 'rgba(11,11,12,0.45)', opacity: carton, pointerEvents: 'none'}} />
    </>
  );
};

// Logo FX MOTORS en petit, centré en haut, + rappel de l'offre (vidéo souvent vue sans le son).
const TopBar: React.FC<{f: number}> = ({f}) => {
  const p = rv(f, 0, 14);
  const out = lerp(f, [BW.endAt - 8, BW.endAt], [1, 0]);
  const offer = rv(f, 88, 14);
  return (
    <div style={{position: 'absolute', top: SAFE.top, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: out}}>
      <Img src={staticFile('img/fxmotors.png')} style={{width: 170, opacity: p, filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.35))'}} />
      <div style={{
        opacity: offer, padding: '9px 18px 8px', background: 'rgba(11,11,12,0.62)', backdropFilter: 'blur(6px)',
        fontFamily: FONTS.info, fontWeight: 600, fontSize: 21, letterSpacing: 4, color: COLORS.white, whiteSpace: 'nowrap',
      }}>
        BLACK WEEK · <span style={{color: COLORS.yellow}}>-15 %</span> DÈS 99 € · LIVRAISON OFFERTE
      </div>
    </div>
  );
};

// End card, révélée au rythme de la voix (frames locales) :
// « Moins quinze pour cent sur tout le site » 4 · « dès 99 € » 64 · « code BLACK FX quinze » 98 · « livraison offerte » 150.
const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const r = (at: number) => rv(f, at, 14);
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 90% 60% at 50% 48%, ${COLORS.graphite} 0%, ${COLORS.ink} 100%)`}}>
      <div style={{position: 'absolute', top: SAFE.top, width: '100%', display: 'flex', justifyContent: 'center', opacity: r(8), transform: `translateY(${(1 - r(8)) * 24}px)`}}>
        <Img src={staticFile('img/fxmotors.png')} style={{width: FX_LOGO_W}} />
      </div>
      <div style={{position: 'absolute', top: 590, left: X, right: X, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
        <Label p={r(2)} size={28}>BLACK WEEK · JUSQU'AU 29.11</Label>
        <div style={{fontFamily: FONTS.title, fontSize: 270, lineHeight: 1, color: COLORS.yellow, marginTop: 14}}>
          <MaskWord p={r(4)}>-15 %</MaskWord>
        </div>
        <div style={{fontFamily: FONTS.title, fontSize: 84, lineHeight: 1.02, color: COLORS.white, textTransform: 'uppercase'}}>
          <MaskWord p={r(24)}>Sur tout le site</MaskWord>
        </div>
        <div style={{fontFamily: FONTS.info, fontWeight: 600, fontSize: 40, color: COLORS.white, marginTop: 14}}>
          <MaskWord p={r(62)}>Dès 99 € d'achat</MaskWord>
        </div>
        <Hairline p={r(90)} color={COLORS.line} origin="center" style={{width: 700, marginTop: 44}} />
        <div style={{display: 'flex', width: 700, marginTop: 34, justifyContent: 'space-between', alignItems: 'flex-start'}}>
          <div style={{textAlign: 'left', opacity: r(98), transform: `translateY(${(1 - r(98)) * 16}px)`}}>
            <Label p={r(98)} size={20} color={COLORS.grey}>CODE</Label>
            <div style={{fontFamily: FONTS.title, fontSize: 64, lineHeight: 1.1, color: COLORS.white}}>BLACKFX15</div>
          </div>
          <div style={{width: 2, alignSelf: 'stretch', background: COLORS.line, opacity: r(120)}} />
          <div style={{textAlign: 'right', opacity: r(150), transform: `translateY(${(1 - r(150)) * 16}px)`}}>
            <Label p={r(150)} size={20} color={COLORS.grey}>LIVRAISON</Label>
            <div style={{fontFamily: FONTS.title, fontSize: 64, lineHeight: 1.1, color: COLORS.white, textTransform: 'uppercase'}}>Offerte</div>
            <div style={{fontFamily: FONTS.info, fontWeight: 500, fontSize: 24, color: COLORS.grey}}>dès 99 €</div>
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', top: 1430, width: '100%', textAlign: 'center', fontFamily: FONTS.info, fontWeight: 600, fontSize: 30, letterSpacing: 8, color: COLORS.white, opacity: r(176)}}>
        FXMOTORS.FR
      </div>
      <OilLiquid progress={1 - lerp(f, [0, 14], [0, 1], ease.inOut)} frame={f} id="bwend" />
    </AbsoluteFill>
  );
};

export const BlackWeek: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: COLORS.ink}}>
      {SHOTS.map((s) => (
        <Sequence key={s.at} from={s.at} durationInFrames={s.dur}>
          <AbsoluteFill>
            <OffthreadVideo muted src={staticFile('work/blackweek.mp4')} startFrom={s.src} playbackRate={s.rate} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          </AbsoluteFill>
        </Sequence>
      ))}
      <Sequence durationInFrames={BW.endAt}>
        <Shade f={f} />
        <Titles f={f} />
        {PRODUCTS.map((p) => (
          <ProductTag key={p.name} f={f} p={p} />
        ))}
        <TopBar f={f} />
        <OilLiquid progress={lerp(f, [BW.endAt - 12, BW.endAt], [0, 1], ease.inOut)} frame={f} id="bwout" />
      </Sequence>
      <Sequence from={BW.endAt}>
        <EndCard />
      </Sequence>
      <Audio src={staticFile('audio/vo_bw.mp3')} volume={1} />
      <Sequence from={BW.endAt - 12} durationInFrames={30}>
        <Audio src={staticFile('sfx/whoosh.wav')} volume={0.3} />
      </Sequence>
      <AbsoluteFill style={{background: '#000', opacity: lerp(f, [BW.total - 18, BW.total - 1], [0, 1]), pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
