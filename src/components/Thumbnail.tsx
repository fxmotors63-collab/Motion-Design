import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {ASSETS, DRAFT} from '../brand';

// Miniature réutilisée telle quelle : contenue sans déformation, fond = elle-même floutée/assombrie.
export const Thumbnail: React.FC<{scale?: number; src?: string}> = ({scale = 1, src = ASSETS.miniature}) => (
  <AbsoluteFill style={{backgroundColor: '#000', overflow: 'hidden'}}>
    <Img
      src={staticFile(src)}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        filter: `blur(${DRAFT ? 30 : 50}px) brightness(0.45)`,
        transform: 'scale(1.15)',
      }}
    />
    <Img
      src={staticFile(src)}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        transform: `scale(${scale})`,
      }}
    />
  </AbsoluteFill>
);
