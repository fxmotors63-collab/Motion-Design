import React from 'react';
import {staticFile} from 'remotion';
import {ASSETS, COLORS, DRAFT} from '../brand';

// Primitives 3D isométriques en CSS (projection orthographique : pas de perspective).
// Le sol est le plan XY du conteneur IsoStage ; Z = hauteur.

export const IsoStage: React.FC<{rotZ?: number; tilt?: number; scale?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  rotZ = -45, tilt = 58, scale = 1, children, style,
}) => (
  <div style={{position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, transformStyle: 'preserve-3d', transform: `scale(${scale}) rotateX(${tilt}deg) rotateZ(${rotZ}deg)`, ...style}}>
    {children}
  </div>
);

type Faces = {top?: React.CSSProperties; front?: React.CSSProperties; side?: React.CSSProperties; back?: React.CSSProperties; left?: React.CSSProperties};

// Boîte posée au sol en (x, y, z) de taille w × d × h. front = face +Y, side = face +X.
export const IsoBox: React.FC<{x: number; y: number; z?: number; w: number; d: number; h: number; faces: Faces; children?: React.ReactNode}> = ({
  x, y, z = 0, w, d, h, faces, children,
}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: d, transformStyle: 'preserve-3d', transform: `translateZ(${z}px)`}}>
    <div style={{position: 'absolute', inset: 0, transform: `translateZ(${h}px)`, ...faces.top}} />
    <div style={{position: 'absolute', left: 0, top: d - h, width: w, height: h, transformOrigin: 'bottom', transform: 'rotateX(-90deg)', ...faces.front}} />
    <div style={{position: 'absolute', left: 0, top: -h, width: w, height: h, transformOrigin: 'bottom', transform: 'rotateX(-90deg)', ...(faces.back ?? faces.side)}} />
    <div style={{position: 'absolute', left: w, top: 0, width: h, height: d, transformOrigin: 'left', transform: 'rotateY(-90deg)', ...faces.side}} />
    <div style={{position: 'absolute', left: 0, top: 0, width: h, height: d, transformOrigin: 'left', transform: 'rotateY(-90deg)', ...(faces.left ?? faces.side)}} />
    {children}
  </div>
);

const plastic = (shade: number): React.CSSProperties => ({
  background: `linear-gradient(90deg, hsl(220 4% ${shade}%) 0%, hsl(220 4% ${shade + 12}%) 45%, hsl(220 4% ${shade - 4}%) 100%)`,
});
const ribs: React.CSSProperties = {background: 'repeating-linear-gradient(90deg, #17A497 0 5px, #0C7D72 5px 9px)'};
const capTop: React.CSSProperties = {background: 'radial-gradient(circle at 40% 40%, #3CCABB 0%, #1AA698 55%, #0E8A7E 100%)'};

// Bidon 1 L réel : face avant = photo réelle (silhouette cintrée + étiquette), flancs à facettes en X,
// épaule, col court, bouchon octogonal cannelé.
const BW = 140;
const BD = 84;
const BH = 310;
const facets = (shade: number): React.CSSProperties => ({
  background: [
    'linear-gradient(to top right, transparent calc(50% - 2px), rgba(0,0,0,0.35) 50%, transparent calc(50% + 2px))',
    'linear-gradient(to top left, transparent calc(50% - 2px), rgba(0,0,0,0.35) 50%, transparent calc(50% + 2px))',
    `linear-gradient(90deg, hsl(220 4% ${shade - 6}%) 0%, hsl(220 4% ${shade + 8}%) 50%, hsl(220 4% ${shade - 6}%) 100%)`,
  ].join(','),
});

export const IsoBottle: React.FC<{x: number; y: number; z?: number; glow?: number}> = ({x, y, z = 0, glow = 0}) => {
  const front: React.CSSProperties = {
    backgroundImage: `url(${staticFile(ASSETS.productLabel)})`,
    backgroundSize: '104% 119%',
    backgroundPosition: '40% 100%',
  };
  return (
    <>
      {/* halo lumineux au sol (5e bidon) */}
      {glow > 0 && (
        <div style={{position: 'absolute', left: x - 90, top: y - 90, width: BW + 180, height: BD + 180, borderRadius: '50%', transform: 'translateZ(0.5px)',
          background: `radial-gradient(closest-side, rgba(255,229,0,${0.38 * glow}), rgba(255,229,0,${0.1 * glow}) 60%, transparent)`}} />
      )}
      {/* ombre portée au sol */}
      <div style={{position: 'absolute', left: x - 10, top: y - 6, width: BW + 70, height: BD + 50, background: 'radial-gradient(closest-side, rgba(0,0,0,0.55), transparent)', transform: `translateZ(1px) scale(${Math.max(0.3, 1 - z / 900)})`, opacity: Math.max(0, 1 - z / 700)}} />
      <IsoBox x={x} y={y} z={z} w={BW} d={BD} h={BH} faces={{top: plastic(62), front, side: facets(46), left: facets(56)}} />
      {/* épaule, col */}
      <IsoBox x={x + 6} y={y + 5} z={z + BH} w={BW - 12} d={BD - 10} h={14} faces={{top: plastic(66), front: plastic(58), side: plastic(46), left: plastic(52)}} />
      <IsoBox x={x + 36} y={y + 14} z={z + BH + 14} w={68} d={56} h={12} faces={{top: plastic(70), front: plastic(60), side: plastic(46), left: plastic(54)}} />
      {/* bouchon octogonal cannelé (deux prismes croisés à 45°) */}
      {[0, 45].map((rot) => (
        <div key={rot} style={{position: 'absolute', left: x + 39, top: y + 11, width: 62, height: 62, transformStyle: 'preserve-3d', transform: `translateZ(${z + BH + 26}px) rotateZ(${rot}deg)`}}>
          <IsoBox x={0} y={0} w={62} d={62} h={40} faces={{top: capTop, front: ribs, side: ribs, left: ribs}} />
        </div>
      ))}
    </>
  );
};

// Grille fine au sol.
export const IsoGrid: React.FC<{x: number; y: number; w: number; d: number; step?: number; opacity?: number}> = ({x, y, w, d, step = 60, opacity = 1}) => (
  <div style={{
    position: 'absolute', left: x, top: y, width: w, height: d, opacity,
    backgroundImage: `linear-gradient(${COLORS.line} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.line} 1px, transparent 1px)`,
    backgroundSize: `${step}px ${step}px`,
    WebkitMaskImage: 'radial-gradient(closest-side, #000 55%, transparent)',
    maskImage: 'radial-gradient(closest-side, #000 55%, transparent)',
  }} />
);
