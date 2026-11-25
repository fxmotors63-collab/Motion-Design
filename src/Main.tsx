import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, Sequence, Series, staticFile, useCurrentFrame} from 'remotion';
import {DUR, FPS, MUSIC_OFFSET} from './brand';
import VO_SEGMENTS from './vo_segments.json';
import VO_SEGMENTS_B from './vo_segments_b.json';
import {Grain, Vignette} from './components/fx';
import {SafeZones} from './components/ui';
import {lerp} from './lib/anim';
import {Deal} from './seq/Deal';
import {EndCard} from './seq/EndCard';
import {Hook, Variant} from './seq/Hook';
import {Price} from './seq/Price';
import {Proof} from './seq/Proof';
import {Pack} from './seq/Pack';

export const SEQUENCES = [
  {id: 'Hook', comp: Hook, dur: DUR.hook},
  {id: 'Pack', comp: Pack, dur: DUR.pack},
  {id: 'Deal', comp: Deal, dur: DUR.deal},
  {id: 'Price', comp: Price, dur: DUR.price},
  {id: 'Proof', comp: Proof, dur: DUR.proof},
  {id: 'EndCard', comp: EndCard, dur: DUR.end},
];

export const TOTAL = SEQUENCES.reduce((s, x) => s + x.dur, 0);

// Finitions globales : vignettage + grain (au-dessus des séquences), calque safe zones si activé.
const FONT_CSS = [
  ['Anton', 400, 'anton-latin-400-normal'],
  ['Inter', 400, 'inter-latin-400-normal'],
  ['Inter', 500, 'inter-latin-500-normal'],
  ['Inter', 600, 'inter-latin-600-normal'],
  ['Inter', 700, 'inter-latin-700-normal'],
  ['Inter', 800, 'inter-latin-800-normal'],
  ['Inter', 900, 'inter-latin-900-normal'],
]
  .map(([fam, w, file]) => `@font-face{font-family:'${fam}';font-weight:${w};font-display:block;src:url(${staticFile(`fonts/${file}.woff2`)}) format('woff2');}`)
  .join('');

// Polices locales : attente au niveau du composant (un delayRender au niveau module bloquait certains onglets).
const useFonts = () => {
  const [handle] = useState(() => delayRender('fonts', {timeoutInMilliseconds: 20000}));
  useEffect(() => {
    let done = false;
    const finish = () => {
      if (!done) {
        done = true;
        continueRender(handle);
      }
    };
    Promise.all(['400 40px Anton', '400 40px Inter', '500 40px Inter', '600 40px Inter'].map((f) => document.fonts.load(f)))
      .catch(() => undefined)
      .then(finish);
    const t = setTimeout(finish, 5000);
    return () => clearTimeout(t);
  }, [handle]);
};

export const WithSafe: React.FC<{children: React.ReactNode}> = ({children}) => {
  const f = useCurrentFrame();
  useFonts();
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <style>{FONT_CSS}</style>
      {children}
      <Vignette strength={0.45} />
      <Grain frame={f} />
      <SafeZones />
    </AbsoluteFill>
  );
};

// Musique : 1re grosse frappe calée sur la frame 0, fondu de sortie sur l'end card.
// Voix off ElevenLabs (Théo), une phrase par scène : [début s, durée s]. La musique baisse sous la voix.
const duck = (segs: number[][], f: number) =>
  segs.reduce((m, [at, dur]) => {
    const a = at * FPS;
    const b = (at + dur) * FPS;
    return Math.max(m, lerp(f, [a - 6, a], [0, 1]) * lerp(f, [b, b + 10], [1, 0]));
  }, 0);

const Soundtrack: React.FC<{variant: Variant}> = ({variant}) => {
  const segs = variant === 'B' ? VO_SEGMENTS_B : VO_SEGMENTS;
  return (
    <>
      <Audio src={staticFile('audio/music_suspense.mp3')} startFrom={MUSIC_OFFSET} volume={(fr) => 0.62 * (1 - 0.6 * duck(segs, fr)) * lerp(fr, [TOTAL - 45, TOTAL], [1, 0])} />
      <Audio src={staticFile(variant === 'B' ? 'audio/vo_track_b.wav' : 'audio/vo_track.wav')} volume={1} />
    </>
  );
};

// Fondu au noir de fin (image), le son s'éteint en même temps (voir Soundtrack).
const FadeOut: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{background: '#000', opacity: lerp(f, [TOTAL - 27, TOTAL - 1], [0, 1]), pointerEvents: 'none'}} />;
};

// variant 'A' = version principale (hook bidon en main) ; 'B' = ouverture sur la miniature (A/B test).
export const Main: React.FC<{variant?: Variant}> = ({variant = 'A'}) => (
  <WithSafe>
    <Series>
      {SEQUENCES.map(({id, comp: C, dur}) => (
        <Series.Sequence key={id} durationInFrames={dur}>
          {id === 'Hook' ? <Hook variant={variant} /> : <C />}
        </Series.Sequence>
      ))}
    </Series>
    <FadeOut />
    <Soundtrack variant={variant} />
  </WithSafe>
);
