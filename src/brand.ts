// Système de design et timing (réutilisable d'un produit à l'autre). Le contenu produit est dans product.ts.
// DRAFT = true : rendu allégé (grain réduit, flou de fond moindre).
export const DRAFT = false;
// Calque safe zones (contrôle uniquement, jamais dans un export).
export const SHOW_SAFE = false;

export const FPS = 30;
export const W = 1080;
export const H = 1920;

export const SAFE = {top: 270, bottom: 400, side: 64, textMaxY: 1520};

// Largeur du logo FX MOTORS, identique sur l'ouverture et l'end card.
export const FX_LOGO_W = 260;
export const MOTOREX_LOGO_W = 330;
export const FX_LOGO_H = Math.round((FX_LOGO_W * 412) / 1024); // ratio du PNG 1024 × 412

// Direction épurée : encre / graphite / blanc cassé, jaune FX en accent uniquement.
export const COLORS = {
  ink: '#0B0B0C',
  graphite: '#18191B',
  white: '#F3F1EC',
  grey: '#9A9A98',
  line: 'rgba(243,241,236,0.28)',
  yellow: '#FFE500',
  black: '#000000',
};

export const FONTS = {
  title: "'Anton', 'Bebas Neue', Impact, sans-serif",
  info: "'Inter', Arial, sans-serif",
};

// Calé sur la musique (100 BPM, 1 temps = 18 frames, grosse frappe tous les 8 temps = 144 f).
// Total = 780 f = 26 s (fin tenue 1,5 s après la dernière phrase). Voir beats.json.
export const BPM = 100;
export const BEAT = 18;
export const MUSIC_OFFSET = 37; // frames coupées au début du morceau : 1re frappe sur la frame 0
export const DUR = {
  hook: 72,
  pack: 72,
  deal: 144,
  price: 144,
  proof: 144,
  end: 204,
};

// Contenu produit (textes, prix, plans, visuels) : voir src/product.ts.
export * from './product';

export const fmtPrice = (v: number) => v.toFixed(2).replace('.', ',');
