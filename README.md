# Respira

A calm, minimal breathing app with five guided exercises. Soft colors, a gently rippling shape that grows as you breathe in and shrinks as you breathe out, and optional sound cues.

## Exercises

| Exercise | Pattern | Guide | Default |
|----------|---------|-------|---------|
| Cyclic sighing | In 2 s · top-up in 1 s · out 6 s | Growing circle with an extra "top-up" swell | 5 min |
| 4-7-8 breathing | In 4 s · hold 7 s · out 8 s | Circle plus a dot travelling around a triangle | 4 cycles |
| Resonance breathing | In 5 s · out 6 s (≈ 5.5 breaths/min) | Smooth growing and shrinking circle | 10 min |
| Box breathing | In 4 · hold 4 · out 4 · hold 4 s | Circle plus a dot travelling around a square | 4 min |
| Belly breathing | Your own slow pace | Timer only | 3 min |

Breathing patterns always finish a whole cycle, so a session never ends mid-breath.

## How to use

- Pick an exercise, choose a duration, then **tap the circle** to start.
- Tap again to pause; **Restart** appears while paused.
- The faint halo marks the size of a full breath; the thin outer ring fills once per phase.
- 🔔 turns sound cues on or off (off by default): a singing bowl for breathe in (higher) and out (lower), a soft tap for holds.
- The screen stays on during a session, and the session pauses if you leave the app.
- With "reduce motion" switched on in the phone settings, the shape stops rippling and changing color.

## Install on Android

Open the GitHub Pages address in Chrome, then tap **⋮ → Install app**. Respira then works fully offline.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure and the info sheet |
| `styles.css` | Colors (light "morning mist", dark "night sky") and layout |
| `app.js` | Exercises, animation, timing and sound cues |
| `manifest.webmanifest` | App name, colors and icons for "Install app" |
| `sw.js` | Offline support |
| `icons/` | App icons (SVG source + 192 / 512 px PNG) |

After changing any file, bump `VERSION` in `sw.js` (e.g. `'v1'` → `'v2'`) so installed copies update.

## Safety

Stop if you feel dizzy or light-headed. Skip breath holds if you are pregnant or have a heart or lung condition. Respira is not a substitute for medical advice.

## Credits

Made by gionzana. If you enjoy it, you can [buy me a coffee](https://buymeacoffee.com/gionzana) ☕
