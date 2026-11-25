import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, spring, staticFile, useVideoConfig} from 'remotion';
import {COLORS, FONTS, H, SAFE, SHOW_SAFE, W} from '../brand';

// Rush toujours muet (double sécurité : fichiers de travail déjà sans piste audio).
export const Rush: React.FC<{name: string; startFrom?: number; scale?: number; dim?: number; x?: number; y?: number}> = ({
  name,
  startFrom = 0,
  scale = 1,
  dim = 0,
  x = 0,
  y = 0,
}) => (
  <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#000'}}>
    <OffthreadVideo
      muted
      src={staticFile(`work/${name}.mp4`)}
      startFrom={startFrom}
      style={{width: '100%', height: '100%', objectFit: 'cover', transform: `translate(${x}px, ${y}px) scale(${scale})`, filter: 'contrast(1.06) saturate(0.92)'}}
    />
    {dim > 0 && <AbsoluteFill style={{backgroundColor: `rgba(0,0,0,${dim})`}} />}
  </AbsoluteFill>
);

export const usePop = (frame: number, at: number, damping = 11) => {
  const {fps} = useVideoConfig();
  return spring({frame: frame - at, fps, config: {damping, stiffness: 220, mass: 0.7}});
};

export const Title: React.FC<{children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties}> = ({
  children,
  size,
  color = COLORS.white,
  style,
}) => (
  <div style={{fontFamily: FONTS.title, fontSize: size, lineHeight: 1.02, color, textTransform: 'uppercase', letterSpacing: size * 0.005, textShadow: '0 2px 18px rgba(0,0,0,0.55)', ...style}}>
    {children}
  </div>
);

export const SafeZones: React.FC = () =>
  SHOW_SAFE ? (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', top: 0, left: 0, width: W, height: SAFE.top, background: 'rgba(0,160,255,0.22)', borderBottom: '3px dashed #0af'}} />
      <div style={{position: 'absolute', bottom: 0, left: 0, width: W, height: SAFE.bottom, background: 'rgba(0,160,255,0.22)', borderTop: '3px dashed #0af'}} />
      <div style={{position: 'absolute', top: SAFE.textMaxY, left: 0, width: W, borderTop: '3px dotted #ff0'}} />
      <div style={{position: 'absolute', top: 0, left: SAFE.side, height: H, borderLeft: '3px dashed #0af'}} />
      <div style={{position: 'absolute', top: 0, right: SAFE.side, height: H, borderRight: '3px dashed #0af'}} />
    </AbsoluteFill>
  ) : null;

// Enchaînement de plans courts, coupes franches, cadre complet (pas de zoom par défaut). from/dur en frames.
export type Shot = {name: string; from: number; dur: number; x?: number; s0?: number; s1?: number};
export const ShotList: React.FC<{shots: Shot[]; frame: number; dim?: number}> = ({shots, frame, dim = 0}) => {
  const {durationInFrames} = useVideoConfig();
  let at = 0;
  return (
    <>
      {shots.map((s, i) => {
        const start = at;
        const dur = s.dur || Math.max(1, durationInFrames - start);
        at += dur;
        const local = frame - start;
        const sc = (s.s0 ?? 1) + ((s.s1 ?? 1) - (s.s0 ?? 1)) * Math.min(1, Math.max(0, local / dur));
        return (
          <Sequence key={i} from={start} durationInFrames={dur}>
            <Rush name={s.name} startFrom={s.from} scale={sc} x={s.x ?? 0} dim={dim} />
          </Sequence>
        );
      })}
    </>
  );
};
