# IR Vascular Anatomy — Atlas & Quiz

An interactive 3D game for learning interventional-radiology-relevant vascular anatomy. A schematic, translucent human body hosts ~75 major arteries and veins (rendered as 3D tubes). Each round, one vessel animates — scaling up, glowing, and popping outward from the body — while a multiple-choice panel on the side asks you to identify it, trace its proximal/distal connections, or name what it supplies/drains.

## Modes

- **Quiz Mode** — random vessel + auto-generated multiple-choice question (identify / proximal connection / distal connection / supplies-drains), with score, streak, and an explanation (often including the IR-specific clinical relevance) after each answer.
- **Explore Mode** — click any vessel directly in the 3D scene to pop it out and read its info card, no quiz pressure.

## Coverage

Aortic arch and branches, carotid/subclavian/axillary/radial/ulnar arteries, cephalic/basilic/IJ/subclavian/brachiocephalic veins, celiac trunk (hepatic/splenic/left gastric), SMA/IMA, renal and gonadal vessels, portal venous system (portal/splenic/SMV) and hepatic veins, iliac vessels, uterine/prostatic arteries, common femoral/SFA/popliteal, great saphenous vein, IVC/SVC, and more — chosen for relevance to common IR procedures (TIPS, UFE/PAE, mesenteric ischemia, renal intervention, dialysis access, venous ablation, IVC filters, embolization, angioplasty/stenting access).

> The 3D body and vessel paths are stylized/schematic for gameplay clarity, not a medical-grade anatomical model.

## Run it

```bash
npm install
npm run dev
```

## Stack

React + TypeScript + Vite, [Three.js](https://threejs.org/) via [`@react-three/fiber`](https://docs.pmnd.rs/react-three-fiber) and [`@react-three/drei`](https://github.com/pmndrs/drei).

## Project structure

- `src/data/vessels.ts` — vessel definitions (3D paths, type, proximal/distal graph, clinical notes)
- `src/data/questions.ts` — multiple-choice question generator
- `src/game/useGameEngine.ts` — quiz/explore game state
- `src/components/Scene.tsx`, `VesselMesh.tsx`, `BodyModel.tsx` — 3D rendering
- `src/components/QuestionPanel.tsx`, `Hud.tsx` — UI
