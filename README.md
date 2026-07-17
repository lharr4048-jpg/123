# IR Vascular Anatomy — Atlas & Quiz

An interactive 3D game for learning interventional-radiology-relevant vascular anatomy. A translucent, rim-lit 3D human body (a real sculpted base mesh, not primitives) hosts ~75 major arteries and veins rendered as 3D tubes. Each round, one vessel animates — scaling up, glowing, and popping outward from the body — while a multiple-choice panel on the side asks you to identify it, trace its proximal/distal connections, name what it supplies/drains, or answer a curated clinical-relevance question.

## Modes

- **Quiz Mode** — random vessel + auto-generated multiple-choice question (identify / proximal connection / distal connection / supplies-drains / clinical relevance), with score, streak, and an explanation after each answer. Every vessel always has a first-order identify question available; vessels with curated content also mix in richer second/third-order clinical questions.
- **Explore Mode** — click any vessel directly in the 3D scene to pop it out and read its info card, no quiz pressure.

## Coverage

Aortic arch and branches, carotid/subclavian/axillary/radial/ulnar arteries, cephalic/basilic/IJ/subclavian/brachiocephalic veins, celiac trunk (hepatic/splenic/left gastric), SMA/IMA, renal and gonadal vessels, portal venous system (portal/splenic/SMV) and hepatic veins, iliac vessels, uterine/prostatic arteries, common femoral/SFA/popliteal, great saphenous vein, IVC/SVC, and more — chosen for relevance to common IR procedures (TIPS, UFE/PAE, mesenteric ischemia, renal intervention, dialysis access, venous ablation, IVC filters, embolization, angioplasty/stenting access).

The curated clinical questions (`src/data/curatedQuestions.ts`) are sourced from Kandarpa et al., *Handbook of Interventional Radiologic Procedures* (4th ed.) — collateral pathways (marginal artery of Drummond, pancreaticoduodenal arcade, lumbar-to-iliolumbar collaterals), named syndromes (median arcuate ligament, subclavian steal, May-Thurner), and procedural anatomy pitfalls (cystic artery/gallbladder ischemia, Artery of Adamkiewicz/spinal cord infarct, IVC filter renal vein variants, TIPS hepatic-to-portal vein tract).

> The 3D body model (`public/models/FinalBaseMesh.obj`) and vessel paths are stylized for gameplay clarity, not a medical-grade or textbook-precision anatomical model.

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
- `src/data/curatedQuestions.ts` — hand-authored second/third-order clinical questions
- `src/game/useGameEngine.ts` — quiz/explore game state
- `src/components/Scene.tsx`, `VesselMesh.tsx`, `BodyModel.tsx` — 3D rendering
- `src/components/QuestionPanel.tsx`, `Hud.tsx` — UI
