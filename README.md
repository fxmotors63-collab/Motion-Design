# Story FX MOTORS · Motorex Cross Power 2T (pack 4 + 1)

Vidéo Story 9:16 (1080×1920, 30 fps, 26 s) réalisée avec Remotion (React + TypeScript).

## Livrables (`output/`)
- `fxmotors_motorex_crosspower_story.mp4` : version principale (hook bidon en main).
- `fxmotors_motorex_crosspower_story_hookB.mp4` : version B pour A/B test (ouvre sur la miniature, accroche « 15,96 € LE LITRE. OUI, DE LA MOTOREX. »). Fin identique.

## Refaire la même vidéo pour un autre produit
1. Remplir le brief (`BRIEF.md` de la skill montage-video-3d-iso) et déposer rushes, photo produit, logos, musique.
2. Dans Claude Code : « Utilise la skill montage-video-3d-iso » (process complet et préférences validées :
   `.claude/skills/montage-video-3d-iso/SKILL.md`).

## Modifier les textes et les prix
Contenu produit : **`src/product.ts`** (seul fichier à réécrire pour un nouveau produit) :
- `PRICES` : prix au litre, prix du pack, prix public, remise, économie (les compteurs animés lisent `perL`, `perLOld`, `packNum`, `packOldNum`).
- `TXT` : tous les textes à l'écran (hook A et B, pack, offre, prix, fiche technique, end card, CTA).
- `SHOTS` : plans vidéo de chaque scène (rush, frame de départ, durée) ; `ASSETS` : photo produit, miniature, logos.

Système de design et timing : **`src/brand.ts`** :
- `COLORS`, `FONTS`, `DUR` (durées des scènes en frames, calées sur la musique : 1 temps = 18 frames), `FX_LOGO_W` / `MOTOREX_LOGO_W` (taille des logos).
- `SHOW_SAFE = true` affiche le calque des safe zones pour contrôle (à remettre à `false` avant export).

⚠ Si un texte change, la voix off ne change pas automatiquement : voir « Voix off ».

## Relancer le rendu
```bash
npm install
./tools/prep_rushes.sh              # une seule fois : rushes HD sans audio dans work/hd/
./tools/render_final.sh         # A + B, son normalisé -14 LUFS
./tools/render_final.sh A       # ou une seule version
```
Aperçu interactif : `npm run studio`. Brouillon rapide : `npm run v1` (540×960).

## Audio
- Le son d'origine des rushes n'est jamais utilisé (fichiers de travail encodés avec `-an` + `muted` dans Remotion).
- Musique : `assets/audio/music_suspense.mp3`, démarrée sur sa 1re frappe (`MUSIC_OFFSET`), repères dans `beats.json`, baisse automatique sous la voix.
- Voix off : prises ElevenLabs dans `assets/audio/vo/`, placées phrase par phrase d'après `assets/audio/vo/plan.json`, assemblées par `python3 -I tools/build_vo.py` (`… b` pour la version B).
- Nouvelle musique : `python3 -I tools/analyze_music.py assets/audio/<fichier>.mp3` (BPM, frappes, `MUSIC_OFFSET`).
- Planche contact de contrôle : `./tools/contact_sheet.sh <video> [intervalle_s]`.

## Structure
- `src/Main.tsx` : assemblage des scènes, musique, voix, fondu de fin. Compositions `Main` (A) et `MainB` (B) dans `src/Root.tsx`.
- `src/seq/` : Hook, Pack, Deal (offre 3D isométrique), Price, Proof (fiche technique), EndCard.
- `src/components/` : `OilLiquid` (vague d'huile), `PriceCounter` (odomètre), `Iso` (bidons 3D), `Thumbnail` (miniature), `fx` (filets, masques, grain…).
