import {Easing, interpolate} from 'remotion';

export const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const ease = {
  expoOut: Easing.bezier(0.16, 1, 0.3, 1),
  expoIn: Easing.bezier(0.7, 0, 0.84, 0),
  inOut: Easing.bezier(0.83, 0, 0.17, 1),
  backOut: Easing.bezier(0.34, 1.56, 0.64, 1),
  // recul (anticipation) puis dépassement
  anticip: Easing.bezier(0.6, -0.45, 0.35, 1.45),
};

export const lerp = (f: number, input: number[], output: number[], easing?: (t: number) => number) =>
  interpolate(f, input, output, {...cl, easing});

export const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

// Décroissance exponentielle à partir de `at`.
export const decay = (f: number, at: number, len: number) => (f < at ? 0 : Math.exp(-(f - at) / len));

// Tremblement caméra déterministe, amplitude `amp`.
export const shake = (f: number, amp: number, seed = 0) => ({
  x: (rand(Math.floor(f) + seed) - 0.5) * 2 * amp,
  y: (rand(Math.floor(f) + seed + 991) - 0.5) * 2 * amp,
  r: (rand(Math.floor(f) + seed + 37) - 0.5) * amp * 0.08,
});

// Progression 0→1 d'une révélation (expo out).
export const rv = (f: number, at: number, dur = 12) => lerp(f, [at, at + dur], [0, 1], ease.expoOut);
