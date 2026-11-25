import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {COLORS, FONTS, FX_LOGO_W, SAFE, W} from './brand';
import {Hairline, Label, MaskWord} from './components/fx';
import {OilLiquid} from './components/OilLiquid';
import {ease, lerp, rv} from './lib/anim';

// Story Black Week FX MOTORS, ton « découverte » UGC : voix Léa (assets/audio/vo/prise_lea_v3_decouverte.mp3)
// qui fait le tour de la prépa commandes, sur le montage d'origine laissé tel quel ; end card à 13,5 s.
// La prise est redécoupée phrase par phrase (public/audio/vo_bw.wav) pour tomber sur le bon plan :
// prépa commandes 0 (Arai) · des bottes 3,1 (Sidi) · encore un casque 5,15 (Bell) · regardez ce qui part 7,45 (carton) ·
// un échappement 8,88 (HGS) · Tech dix roses 9,88 (Tech 10) · vous vous êtes fait plaisir 11,85 (Athena) · Black Week… 13,62 (end card).
// Repères voix (s) : prépa commandes 0,6 · « regardez ce qui part » 3,2 · casque Araï 4,77 · des bottes 6,0 ·
// encore un casque 6,7 · un échappement 8,13 · Tech dix roses 9,09 · « vous vous êtes fait plaisir » 11,13 ·
// « c'est la Black Week » 12,96 · -15 % 14,65 · sur tout le site 15,84 · dès 99 € 16,62 · code 17,71 ·
// livraison offerte 18,94 · « Profitez-en vite » 21,15 · fin 21,99.
export const BW = {
  endAt: 405, // end card à 13,5 s : fin du montage d'origine (laissé tel quel)
  total: 720, // voix finie à 22,7 s + tenue 1,3 s
};

// Musique : ElevenLabs Music (musique_el.mp3, 23 s, se termine avec la vidéo) ; musique d'origine du rush : musique_bw.wav (0.037 / 0.1).
export const MUSIC = {file: 'audio/musique_el.mp3', under: 0.09, after: 0.3};

// Plans : [début, durée] sur la timeline, image source de départ, vitesse (source consommée = dur × rate).
// Montage d'origine du rush, laissé tel quel (ordre, rythme, vitesse 1).
const SHOTS = [{at: 0, dur: 405, src: 0, rate: 1}];

// Étiquettes produits (pas de prix), affichées quand la voix nomme le produit.
const PRODUCTS: {from: number; to: number; cat: string; name: string}[] = [
  {from: 6, to: 72, cat: 'Casque cross', name: 'Arai MX-V Evo'},
  {from: 76, to: 151, cat: 'Bottes cross', name: 'Sidi Crossfire 3 SRS'},
  {from: 155, to: 227, cat: 'Casque cross', name: 'Bell Moto-10 MIPS'},
  {from: 267, to: 298, cat: 'Échappement 4 temps', name: 'Échappement HGS'},
  {from: 300, to: 340, cat: 'Bottes cross', name: 'Alpinestars Tech 10 Diva Pink'},
  {from: 342, to: 402, cat: 'Moteur · YZ 125 en 144', name: 'Kit cylindre complet Athena Race'},
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
      {block(16, 70, 'EN COULISSES CHEZ FX MOTORS', 'Prépa', 'commandes', 1020)}
      {block(355, 402, 'VOS COMMANDES DU JOUR', 'Vous vous êtes', 'fait plaisir', 1080, 110)}
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
  const offer = rv(f, 76, 14);
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
// « c'est la Black Week » 0 · « moins quinze pour cent » 35 · « sur tout le site » 70 · « dès 99 € » 94 · « code BLACK FX quinze » 126 · « livraison offerte » 163 · « Profitez-en vite » 230.
const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const r = (at: number) => rv(f, at, 14);
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 90% 60% at 50% 48%, ${COLORS.graphite} 0%, ${COLORS.ink} 100%)`}}>
      <div style={{position: 'absolute', top: SAFE.top, width: '100%', display: 'flex', justifyContent: 'center', opacity: r(8), transform: `translateY(${(1 - r(8)) * 24}px)`}}>
        <Img src={staticFile('img/fxmotors.png')} style={{width: FX_LOGO_W}} />
      </div>
      <div style={{position: 'absolute', top: 480, left: X, right: X, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
        <Label p={r(18)} size={26}>DU 23 AU 29 NOVEMBRE</Label>
        <div style={{fontFamily: FONTS.title, fontSize: 110, lineHeight: 1.02, color: COLORS.white, textTransform: 'uppercase', marginTop: 8}}>
          <MaskWord p={r(20)}>Black</MaskWord> <MaskWord p={r(25)} style={{color: COLORS.yellow}}>Week</MaskWord>
        </div>
        <div style={{fontFamily: FONTS.title, fontSize: 270, lineHeight: 1, color: COLORS.yellow, marginTop: 14}}>
          <MaskWord p={r(53)}>-15 %</MaskWord>
        </div>
        <div style={{fontFamily: FONTS.title, fontSize: 84, lineHeight: 1.02, color: COLORS.white, textTransform: 'uppercase'}}>
          <MaskWord p={r(88)}>Sur tout le site</MaskWord>
        </div>
        <div style={{fontFamily: FONTS.info, fontWeight: 600, fontSize: 40, color: COLORS.white, marginTop: 14}}>
          <MaskWord p={r(113)}>Dès 99 € d'achat</MaskWord>
        </div>
        <Hairline p={r(138)} color={COLORS.line} origin="center" style={{width: 700, marginTop: 44}} />
        <div style={{display: 'flex', width: 700, marginTop: 34, justifyContent: 'space-between', alignItems: 'flex-start'}}>
          <div style={{textAlign: 'left', opacity: r(146), transform: `translateY(${(1 - r(146)) * 16}px)`}}>
            <Label p={r(146)} size={20} color={COLORS.grey}>CODE</Label>
            <div style={{fontFamily: FONTS.title, fontSize: 64, lineHeight: 1.1, color: COLORS.white}}>BLACKFX15</div>
          </div>
          <div style={{width: 2, alignSelf: 'stretch', background: COLORS.line, opacity: r(164)}} />
          <div style={{textAlign: 'right', opacity: r(183), transform: `translateY(${(1 - r(183)) * 16}px)`}}>
            <Label p={r(183)} size={20} color={COLORS.grey}>LIVRAISON</Label>
            <div style={{fontFamily: FONTS.title, fontSize: 64, lineHeight: 1.1, color: COLORS.white, textTransform: 'uppercase'}}>Offerte</div>
            <div style={{fontFamily: FONTS.info, fontWeight: 500, fontSize: 24, color: COLORS.grey}}>dès 99 €</div>
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', top: 1430, width: '100%', textAlign: 'center', fontFamily: FONTS.info, fontWeight: 600, fontSize: 30, letterSpacing: 8, color: COLORS.white, opacity: r(220)}}>
        FXMOTORS.FR
      </div>
      <div style={{position: 'absolute', top: 1330, width: '100%', textAlign: 'center', fontFamily: FONTS.title, fontSize: 72, lineHeight: 1, color: COLORS.yellow, textTransform: 'uppercase'}}>
        <MaskWord p={r(248)}>Profitez-en vite</MaskWord>
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
      <Audio src={staticFile('audio/vo_bw.wav')} volume={1} />
      {/* Musique basse sous la voix, remonte après la dernière phrase. */}
      <Audio src={staticFile(MUSIC.file)} volume={(fr) => lerp(fr, [0, 4], [0, 1]) * lerp(fr, [681, 693], [MUSIC.under, MUSIC.after])} />
      <Sequence from={BW.endAt - 12} durationInFrames={30}>
        <Audio src={staticFile('sfx/whoosh.wav')} volume={0.3} />
      </Sequence>
      <AbsoluteFill style={{background: '#000', opacity: lerp(f, [BW.total - 18, BW.total - 1], [0, 1]), pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
