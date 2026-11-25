import React, {useId} from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {COLORS, DRAFT, FONTS} from '../brand';
import {ease, lerp} from '../lib/anim';

const sid = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '');

// Flou de mouvement directionnel (SVG feGaussianBlur anisotrope), piloté par la vitesse.
export const DirBlur: React.FC<{x: number; y: number; style?: React.CSSProperties; children: React.ReactNode}> = ({x, y, style, children}) => {
  const id = 'mb' + sid(useId());
  const sx = Math.min(80, Math.abs(x));
  const sy = Math.min(80, Math.abs(y));
  const on = sx > 0.4 || sy > 0.4;
  return (
    <>
      {on && (
        <svg width={0} height={0} style={{position: 'absolute'}}>
          <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={`${sx} ${sy}`} />
          </filter>
        </svg>
      )}
      <div style={{...style, filter: on ? `url(#${id})` : style?.filter}}>{children}</div>
    </>
  );
};

// Grain : 8 textures toujours montées (préchargées), une seule visible. Pas d'<Img> → aucun delayRender.
export const Grain: React.FC<{frame: number; opacity?: number}> = ({frame, opacity = 0.09}) => {
  const k = Math.floor(frame / 2) % 8;
  return (
    <AbsoluteFill style={{mixBlendMode: 'overlay', opacity: DRAFT ? opacity * 0.6 : opacity, pointerEvents: 'none'}}>
      {Array.from({length: 8}).map((_, i) => (
        <AbsoluteFill key={i} style={{backgroundImage: `url(${staticFile(`fx/grain_${i + 1}.png`)})`, backgroundSize: '100% 100%', opacity: i === k ? 1 : 0}} />
      ))}
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.5}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 80% 65% at 50% 45%, transparent 55%, rgba(0,0,0,${strength}) 100%)`, pointerEvents: 'none'}} />
);

// Bande lumineuse diagonale qui balaie (reflet).
export const Sheen: React.FC<{frame: number; at: number; dur?: number; opacity?: number; width?: number}> = ({frame, at, dur = 18, opacity = 0.5, width = 220}) => {
  const p = (frame - at) / dur;
  if (p < 0 || p > 1) return null;
  const x = lerp(p, [0, 1], [-60, 160], ease.inOut);
  return (
    <AbsoluteFill style={{
      mixBlendMode: 'soft-light', opacity, pointerEvents: 'none',
      background: `linear-gradient(105deg, transparent calc(${x}% - ${width}px), rgba(255,255,255,1) ${x}%, transparent calc(${x}% + ${width}px))`,
    }} />
  );
};

// Révélation par masque : le contenu monte depuis une ligne de coupe.
export const MaskWord: React.FC<{p: number; children: React.ReactNode; style?: React.CSSProperties}> = ({p, children, style}) => (
  <span style={{display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingTop: '0.2em', marginTop: '-0.2em', paddingBottom: '0.06em', ...style}}>
    <span style={{display: 'inline-block', transform: `translateY(${(1 - p) * 110}%)`}}>{children}</span>
  </span>
);

// Filet fin qui se trace.
export const Hairline: React.FC<{p: number; color?: string; thickness?: number; origin?: 'left' | 'right' | 'center'; style?: React.CSSProperties}> = ({
  p, color = COLORS.line, thickness = 2, origin = 'left', style,
}) => <div style={{height: thickness, background: color, transform: `scaleX(${p})`, transformOrigin: origin, ...style}} />;

// Sur-titre en petites capitales espacées.
export const Label: React.FC<{p: number; children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties}> = ({
  p, children, color = COLORS.yellow, size = 26, style,
}) => (
  <div style={{fontFamily: FONTS.info, fontWeight: 600, fontSize: size, letterSpacing: lerp(p, [0, 1], [size * 0.6, size * 0.28]), color, opacity: p, ...style}}>
    {children}
  </div>
);
