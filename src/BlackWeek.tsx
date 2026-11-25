import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {COLORS, FONTS, FX_LOGO_W, SAFE, W} from './brand';
import {Hairline, Label, MaskWord} from './components/fx';
import {OilLiquid} from './components/OilLiquid';
import {ease, lerp, rv} from './lib/anim';

// Story Black Week FX MOTORS, ton « découverte » UGC : voix Léa (assets/audio/vo/prise_lea_v4_sidi.mp3)
// qui fait le tour de la prépa commandes ; plans remontés dans l'ordre de ce qu'elle cite (ralenti léger, jamais de zoom).
// Repères voix (s) : prépa commandes 0,6 · « regardez ce qui part » 3,18 · casque Araï 4,77 · une paire de Sidi 6,0 ·
// encore un casque 7,33 · un échappement 8,37 · Tech dix roses 9,49 · « vous vous êtes fait plaisir » 11,58 ·
// « c'est la Black Week » 13,41 · -15 % 15,15 · sur tout le site 16,32 · dès 99 € 17,09 · code 18,18 ·
// livraison offerte 19,38 · « Profitez-en vite » 21,57 · fin 22,41.
export const BW = {
  endAt: 452, // end card (15,07 s), sur « moins quinze pour cent »
  total: 711, // voix finie à 22,41 s + tenue 1,3 s
};

// Musique : ElevenLabs Music (musique_el.mp3, 23 s, se termine avec la vidéo) ; musique d'origine du rush : musique_bw.wav (0.037 / 0.1).
export const MUSIC = {file: 'audio/musique_el.mp3', under: 0.09, after: 0.3};

// Plans : [début, durée] sur la timeline, image source de départ, vitesse (source consommée = dur × rate).
const SHOTS = [
  {at: 0, dur: 60, src: 340, rate: 0.68}, // Athena (cylindre) : « petit tour à la prépa commandes »
  {at: 60, dur: 32, src: 381, rate: 0.75}, // Athena (boîte) : « chez FX Motors »
  {at: 92, dur: 51, src: 227, rate: 0.75}, // carton : « regardez ce qui part aujourd'hui »
  {at: 143, dur: 37, src: 0, rate: 1}, // Arai plan large : « un casque Araï »
  {at: 180, dur: 40, src: 72, rate: 1}, // Sidi : « une paire de Sidi »
  {at: 220, dur: 31, src: 151, rate: 1}, // Bell : « encore un casque »
  {at: 251, dur: 34, src: 265, rate: 0.97}, // HGS : « un échappement »
  {at: 285, dur: 62, src: 298, rate: 0.68}, // Tech 10 : « et oh, des Tech dix roses ! »
  {at: 347, dur: 55, src: 37, rate: 0.64}, // Arai gros plan : « franchement, vous vous êtes fait plaisir »
  {at: 402, dur: 50, src: 116, rate: 0.7}, // Sidi 2e plan : « normal, c'est la Black Week »
];

// Étiquettes produits (pas de prix), affichées quand la voix nomme le produit.
const PRODUCTS: {from: number; to: number; cat: string; name: string}[] = [
  {from: 26, to: 92, cat: 'Moteur · YZ 125 en 144', name: 'Kit cylindre complet Athena Race'},
  {from: 146, to: 180, cat: 'Casque cross', name: 'Arai MX-V Evo'},
  {from: 183, to: 220, cat: 'Bottes cross', name: 'Sidi Crossfire 3 SRS'},
  {from: 223, to: 251, cat: 'Casque cross', name: 'Bell Moto-10 MIPS'},
  {from: 253, to: 285, cat: 'Échappement 4 temps', name: 'Échappement HGS'},
  {from: 288, to: 347, cat: 'Bottes cross', name: 'Alpinestars Tech 10 Diva Pink'},
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

// Titres sur la vidéo : « Prépa commandes » à l'ouverture, « Vous vous êtes fait plaisir » et « Black Week ».
const Titles: React.FC<{f: number}> = ({f}) => {
  const block = (from: number, to: number, label: string, l1: string, l2: string, top: number, size = 150) => {
    const t = inOut(f, from, to);
    if (!t.visible) return null;
    return (
      <div style={{position: 'absolute', left: X, right: X, top, opacity: t.op}}>
        <Label p={rv(f, from + 4, 14)} size={26}>{label}</Label>
        <div style={{fontFamily: FONTS.title, fontSize: size, lineHeight: 1.0, color: COLORS.white, textTransform: 'uppercase', marginTop: 10}}>
          <MaskWord p={rv(f, from, 12)}>{l1}</MaskWord>
          <br />
          <MaskWord p={rv(f, from + 6, 12)} style={{color: COLORS.yellow}}>{l2}</MaskWord>
        </div>
      </div>
    );
  };
  return (
    <>
      {block(16, 90, 'EN COULISSES CHEZ FX MOTORS', 'Prépa', 'commandes', 1020)}
      {block(350, 400, 'VOS COMMANDES DU JOUR', 'Vous vous êtes', 'fait plaisir', 1080, 110)}
      {block(404, 449, 'DU 23 AU 29 NOVEMBRE', 'Black', 'Week', 1010, 170)}
    </>
  );
};

// Fondu sombre léger, derrière les textes du bas (plus marqué sur le plan carton, sans produit).
const Shade: React.FC<{f: number}> = ({f}) => {
  const carton = 0;
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
  const offer = rv(f, 143, 14);
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
// « Moins quinze pour cent » 3 · « sur tout le site » 38 · « dès 99 € » 63 · « code BLACK FX quinze » 96 · « livraison offerte » 133 · « Profitez-en vite » 198.
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
          <MaskWord p={r(36)}>Sur tout le site</MaskWord>
        </div>
        <div style={{fontFamily: FONTS.info, fontWeight: 600, fontSize: 40, color: COLORS.white, marginTop: 14}}>
          <MaskWord p={r(61)}>Dès 99 € d'achat</MaskWord>
        </div>
        <Hairline p={r(90)} color={COLORS.line} origin="center" style={{width: 700, marginTop: 44}} />
        <div style={{display: 'flex', width: 700, marginTop: 34, justifyContent: 'space-between', alignItems: 'flex-start'}}>
          <div style={{textAlign: 'left', opacity: r(94), transform: `translateY(${(1 - r(94)) * 16}px)`}}>
            <Label p={r(94)} size={20} color={COLORS.grey}>CODE</Label>
            <div style={{fontFamily: FONTS.title, fontSize: 64, lineHeight: 1.1, color: COLORS.white}}>BLACKFX15</div>
          </div>
          <div style={{width: 2, alignSelf: 'stretch', background: COLORS.line, opacity: r(112)}} />
          <div style={{textAlign: 'right', opacity: r(131), transform: `translateY(${(1 - r(131)) * 16}px)`}}>
            <Label p={r(131)} size={20} color={COLORS.grey}>LIVRAISON</Label>
            <div style={{fontFamily: FONTS.title, fontSize: 64, lineHeight: 1.1, color: COLORS.white, textTransform: 'uppercase'}}>Offerte</div>
            <div style={{fontFamily: FONTS.info, fontWeight: 500, fontSize: 24, color: COLORS.grey}}>dès 99 €</div>
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', top: 1430, width: '100%', textAlign: 'center', fontFamily: FONTS.info, fontWeight: 600, fontSize: 30, letterSpacing: 8, color: COLORS.white, opacity: r(170)}}>
        FXMOTORS.FR
      </div>
      <div style={{position: 'absolute', top: 1330, width: '100%', textAlign: 'center', fontFamily: FONTS.title, fontSize: 72, lineHeight: 1, color: COLORS.yellow, textTransform: 'uppercase'}}>
        <MaskWord p={r(196)}>Profitez-en vite</MaskWord>
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
      {/* Musique basse sous la voix, remonte après la dernière phrase. */}
      <Audio src={staticFile(MUSIC.file)} volume={(fr) => lerp(fr, [0, 4], [0, 1]) * lerp(fr, [672, 684], [MUSIC.under, MUSIC.after])} />
      <Sequence from={BW.endAt - 12} durationInFrames={30}>
        <Audio src={staticFile('sfx/whoosh.wav')} volume={0.3} />
      </Sequence>
      <AbsoluteFill style={{background: '#000', opacity: lerp(f, [BW.total - 18, BW.total - 1], [0, 1]), pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
