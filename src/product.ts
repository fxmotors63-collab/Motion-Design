// ============================================================
// PRODUIT : seul fichier à modifier pour une nouvelle vidéo.
// Textes, prix, plans vidéo (rushes dans public/work/), visuels.
// Le système de design et le timing sont dans brand.ts.
// ============================================================
import type {Shot} from './components/ui';

export const PRICES = {
  perL: 15.96,
  perLOld: 19.95,
  pack: '79,80 €',
  packNum: 79.8,
  packOldNum: 99.75,
  packOld: '99,75 €',
  discount: '-20 %',
  saving: '19,95 €',
};

export const TXT = {
  hook: ['PACK HUILE MOTOREX', 'CROSS POWER 2T', '4 + 1 GRATUIT.'],
  hookSub: '-20 % sur chaque litre.',
  // Version B (A/B test) : ouvre sur la miniature, accroche prix.
  hookB: ['15,96 € LE LITRE.', 'OUI, DE LA MOTOREX.'],
  hookBSub: 'Pack 4 + 1 · Cross Power 2T',
  packLabel: 'LE PACK',
  pack: ['5 BIDONS.', '5 LITRES.'],
  packSub: 'Motorex Cross Power 2T · 1 L',
  dealLabel: 'L’OFFRE PACK',
  deal: ['4 ACHETÉS.', 'LE 5ᵉ OFFERT.'],
  dealPaid: '4 ACHETÉS',
  dealFree: '+ 1 L OFFERT',
  priceLabel: 'PRIX AU LITRE',
  priceClaim: 'LE MEILLEUR PRIX DU WEB',
  priceRows: [
    ['PACK 5 × 1 L', PRICES.pack],
    ['PRIX PUBLIC CONSEILLÉ', PRICES.packOld],
    ['ÉCONOMIE', `${PRICES.saving} · ${PRICES.discount}`],
  ] as [string, string][],
  proofLabel: 'FICHE TECHNIQUE',
  proofTitle: ['DÉVELOPPÉE AVEC', 'LES TEAMS OFFICIELS.'],
  proof: ['100 % synthèse', 'JASO FD', 'API TC', 'Low Smoke', 'Qualité compétition'],
  stock: 'EN STOCK · EXPÉDIÉ SOUS 24 H',
  cta: 'LIEN DU PACK',
  endPackLabel: 'PACK 5 × 1 L',
  url: 'fxmotors.fr',
};

// Visuels (dans public/img/). label = photo détourée/recadrée du produit (face avant des volumes 3D).
export const ASSETS = {
  productLabel: 'img/bidon_crop.jpg',
  miniature: 'img/miniature.jpg', // utilisée par la version B du hook
  logoShop: 'img/fxmotors.png',
  logoBrand: 'img/motorex.png',
};

// Plans vidéo par scène : name = fichier public/work/<name>.mp4 (sans audio), from = frame de départ dans le rush,
// dur = durée en frames (dur: 0 = remplit le reste de la scène). Un plan ne doit jamais revenir deux fois.
export const SHOTS: Record<'hook' | 'pack' | 'proof' | 'end', Shot[]> = {
  hook: [
    {name: 'IMG_5055', from: 255, dur: 36},
    {name: 'IMG_5058', from: 0, dur: 0},
  ],
  pack: [{name: 'IMG_5051_fast', from: 0, dur: 0}],
  proof: [
    {name: 'IMG_5055', from: 165, dur: 36},
    {name: 'IMG_5059', from: 105, dur: 36},
    {name: 'IMG_5052', from: 75, dur: 36},
    {name: 'IMG_5054', from: 105, dur: 0},
  ],
  end: [{name: 'IMG_5058', from: 36, dur: 0}],
};
