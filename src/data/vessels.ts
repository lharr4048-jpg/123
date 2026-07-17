// Schematic coordinate system (not to scale, stylized for a game/quiz, not diagnostic use):
//   x: patient left(+) / right(-)   y: superior(+) / inferior(-)   z: anterior(+) / posterior(-)

export type VesselType = 'artery' | 'vein';
export type VesselSubtype = 'systemic-arterial' | 'systemic-venous' | 'portal-venous';
export type Side = 'right' | 'left' | 'midline';
export type Point = [number, number, number];

export interface RawVessel {
  id: string;
  name: string;
  type: VesselType;
  subtype: VesselSubtype;
  side: Side;
  region: string;
  path: Point[];
  radius: number;
  parentId: string | null;
  supplies: string;
  note: string;
}

export interface Vessel extends RawVessel {
  childrenIds: string[];
}

const mirror = (path: Point[]): Point[] => path.map(([x, y, z]) => [-x, y, z]);

const lr = (
  idBase: string,
  nameBase: string,
  rightPath: Point[],
  common: Omit<RawVessel, 'id' | 'name' | 'path' | 'side'>,
  overrides?: { right?: Partial<RawVessel>; left?: Partial<RawVessel> },
): RawVessel[] => [
  {
    ...common,
    id: `right${idBase}`,
    name: `Right ${nameBase}`,
    side: 'right',
    path: rightPath,
    ...(overrides?.right ?? {}),
  },
  {
    ...common,
    id: `left${idBase}`,
    name: `Left ${nameBase}`,
    side: 'left',
    path: mirror(rightPath),
    ...(overrides?.left ?? {}),
  },
];

const ARTERY_COLOR = '#e5484d';
const VEIN_COLOR = '#4d94e5';
const PORTAL_COLOR = '#a25de0';

const arterial = { type: 'artery' as const, subtype: 'systemic-arterial' as const, radius: 0.12 };
const venous = { type: 'vein' as const, subtype: 'systemic-venous' as const, radius: 0.13 };
const portal = { type: 'vein' as const, subtype: 'portal-venous' as const, radius: 0.13 };

// ---------------------------------------------------------------------------
// Midline great vessels
// ---------------------------------------------------------------------------
const midline: RawVessel[] = [
  {
    id: 'ascendingAorta',
    name: 'Ascending Aorta',
    ...arterial,
    side: 'midline',
    region: 'thorax',
    radius: 0.32,
    path: [
      [0, 3.3, 0.75],
      [0, 3.9, 0.7],
      [0, 4.45, 0.45],
    ],
    parentId: null,
    supplies: 'Coronary arteries (heart muscle) via the coronary ostia',
    note: 'Arises from the left ventricle; gives off the left and right coronary arteries just above the aortic valve.',
  },
  {
    id: 'aorticArch',
    name: 'Aortic Arch',
    ...arterial,
    side: 'midline',
    region: 'thorax',
    radius: 0.3,
    path: [
      [0, 4.45, 0.45],
      [0, 4.75, 0.05],
      [0, 4.35, -0.45],
    ],
    parentId: 'ascendingAorta',
    supplies: 'Gives rise to the brachiocephalic trunk, left common carotid, and left subclavian arteries',
    note: 'Classic "3-vessel" arch — the order of takeoff (brachiocephalic, left CCA, left subclavian) is a common board/anatomy question.',
  },
  {
    id: 'descendingThoracicAorta',
    name: 'Descending Thoracic Aorta',
    ...arterial,
    side: 'midline',
    region: 'thorax',
    radius: 0.26,
    path: [
      [0, 4.35, -0.45],
      [0, 3.0, -0.3],
      [0, 1.1, -0.15],
    ],
    parentId: 'aorticArch',
    supplies: 'Intercostal arteries and bronchial arteries',
    note: 'Continues as the abdominal aorta after passing through the diaphragmatic hiatus (T12).',
  },
  {
    id: 'bronchialArtery',
    name: 'Bronchial Artery',
    ...arterial,
    side: 'midline',
    region: 'thorax',
    radius: 0.05,
    path: [
      [0, 2.3, -0.2],
      [0.35, 2.6, 0.2],
      [0.6, 2.75, 0.35],
    ],
    parentId: 'descendingThoracicAorta',
    supplies: 'Lung parenchyma and airway (bronchial) walls, not gas exchange tissue',
    note: 'Key embolization target in massive hemoptysis (bronchial artery embolization).',
  },
  {
    id: 'abdominalAorta',
    name: 'Abdominal Aorta',
    ...arterial,
    side: 'midline',
    region: 'abdomen',
    radius: 0.24,
    path: [
      [0, 1.1, -0.15],
      [0, -0.5, -0.1],
      [0, -1.8, -0.05],
      [0, -3.0, 0],
    ],
    parentId: 'descendingThoracicAorta',
    supplies: 'Celiac trunk, SMA, IMA, renal, gonadal and lumbar arteries; terminates as the common iliac arteries',
    note: 'The classic site of abdominal aortic aneurysm (AAA), commonly repaired with EVAR.',
  },
  {
    id: 'superiorVenaCava',
    name: 'Superior Vena Cava (SVC)',
    ...venous,
    side: 'midline',
    region: 'thorax',
    radius: 0.28,
    path: [
      [0, 4.95, 0.15],
      [0, 4.2, 0.3],
      [0, 3.55, 0.35],
    ],
    parentId: null,
    supplies: 'Drains venous blood from head, neck, and both upper limbs into the right atrium',
    note: 'SVC syndrome (obstruction, often from malignancy or central lines) is treated with IR venoplasty/stenting.',
  },
  {
    id: 'inferiorVenaCava',
    name: 'Inferior Vena Cava (IVC)',
    ...venous,
    side: 'midline',
    region: 'abdomen',
    radius: 0.3,
    path: [
      [0, -3.0, -0.35],
      [0, -1.2, -0.3],
      [0, 0.5, -0.25],
      [0, 2.3, -0.15],
      [0, 3.55, 0.1],
    ],
    parentId: null,
    supplies: 'Returns blood from the lower body, pelvis, and abdominal viscera (via hepatic/renal/gonadal veins) to the right atrium',
    note: 'Common site for IVC filter placement to prevent pulmonary embolism from lower-extremity DVT.',
  },
  {
    id: 'celiacTrunk',
    name: 'Celiac Trunk',
    ...arterial,
    side: 'midline',
    region: 'abdomen',
    radius: 0.16,
    path: [
      [0, 0.85, -0.05],
      [0, 0.95, 0.45],
    ],
    parentId: 'abdominalAorta',
    supplies: 'Foregut structures: stomach, liver, spleen, proximal duodenum, pancreas',
    note: 'First major branch of the abdominal aorta; trifurcates into the common hepatic, splenic, and left gastric arteries.',
  },
  {
    id: 'commonHepaticArtery',
    name: 'Common Hepatic Artery',
    ...arterial,
    side: 'midline',
    region: 'abdomen',
    radius: 0.1,
    path: [
      [0, 0.95, 0.45],
      [0.65, 0.95, 0.6],
      [1.0, 1.25, 0.7],
    ],
    parentId: 'celiacTrunk',
    supplies: 'Liver (via proper hepatic branches), pylorus, and proximal duodenum (via gastroduodenal artery)',
    note: 'Continues as the proper hepatic artery after giving off the gastroduodenal artery — a key landmark in TACE/Y-90 mapping.',
  },
  {
    id: 'splenicArtery',
    name: 'Splenic Artery',
    ...arterial,
    side: 'midline',
    region: 'abdomen',
    radius: 0.11,
    path: [
      [0, 0.95, 0.45],
      [-0.9, 0.85, 0.15],
      [-1.6, 0.75, -0.1],
      [-2.05, 0.95, -0.35],
    ],
    parentId: 'celiacTrunk',
    supplies: 'Spleen, pancreas (via pancreatic branches), and stomach fundus (via short gastric arteries)',
    note: 'Classically tortuous; a frequent target for splenic artery embolization in trauma.',
  },
  {
    id: 'leftGastricArtery',
    name: 'Left Gastric Artery',
    ...arterial,
    side: 'midline',
    region: 'abdomen',
    radius: 0.06,
    path: [
      [0, 0.95, 0.45],
      [-0.3, 1.35, 0.55],
      [-0.55, 1.7, 0.6],
    ],
    parentId: 'celiacTrunk',
    supplies: 'Lesser curvature of the stomach and distal esophagus',
    note: 'Smallest of the celiac trunk branches; important in upper GI bleed embolization.',
  },
  {
    id: 'superiorMesentericArtery',
    name: 'Superior Mesenteric Artery (SMA)',
    ...arterial,
    side: 'midline',
    region: 'abdomen',
    radius: 0.14,
    path: [
      [0, 0.35, -0.05],
      [0, -0.6, 0.5],
      [0.15, -1.7, 0.65],
    ],
    parentId: 'abdominalAorta',
    supplies: 'Midgut: distal duodenum through proximal 2/3 of the transverse colon',
    note: 'Occlusion causes acute mesenteric ischemia — a time-critical IR thrombectomy/thrombolysis target.',
  },
  {
    id: 'rightRenalArtery',
    name: 'Right Renal Artery',
    ...arterial,
    side: 'right',
    region: 'abdomen',
    radius: 0.11,
    path: [
      [0, -0.05, -0.05],
      [1.1, -0.15, -0.35],
      [1.85, -0.2, -0.65],
    ],
    parentId: 'abdominalAorta',
    supplies: 'Right kidney',
    note: 'Runs posterior to the IVC en route to the right kidney (slightly longer course than the left renal artery).',
  },
  {
    id: 'leftRenalArtery',
    name: 'Left Renal Artery',
    ...arterial,
    side: 'left',
    region: 'abdomen',
    radius: 0.11,
    path: [
      [0, -0.05, -0.05],
      [-1.1, -0.15, -0.35],
      [-1.85, -0.2, -0.65],
    ],
    parentId: 'abdominalAorta',
    supplies: 'Left kidney',
    note: 'Common target for renal artery stenosis angioplasty/stenting and renal denervation procedures.',
  },
  {
    id: 'inferiorMesentericArtery',
    name: 'Inferior Mesenteric Artery (IMA)',
    ...arterial,
    side: 'midline',
    region: 'abdomen',
    radius: 0.08,
    path: [
      [0, -2.1, -0.05],
      [-0.5, -2.7, 0.35],
      [-0.7, -3.3, 0.5],
    ],
    parentId: 'abdominalAorta',
    supplies: 'Hindgut: distal 1/3 of the transverse colon through the upper rectum',
    note: 'Often sacrificed during EVAR without ischemia if collaterals (marginal artery of Drummond) are intact.',
  },
  {
    id: 'portalVein',
    name: 'Portal Vein',
    ...portal,
    side: 'midline',
    region: 'abdomen',
    radius: 0.16,
    path: [
      [0, -0.35, 0.55],
      [0.35, 0.4, 0.65],
      [0.7, 1.15, 0.75],
    ],
    parentId: null,
    supplies: 'Delivers nutrient-rich, deoxygenated blood from the GI tract and spleen to the liver',
    note: 'Formed by the confluence of the splenic vein and SMV; the target vessel accessed in TIPS procedures.',
  },
  {
    id: 'splenicVein',
    name: 'Splenic Vein',
    ...portal,
    side: 'midline',
    region: 'abdomen',
    radius: 0.12,
    path: [
      [-2.05, 0.85, -0.45],
      [-1.1, 0.4, 0.0],
      [0, -0.35, 0.55],
    ],
    parentId: 'portalVein',
    supplies: 'Drains the spleen and pancreas into the portal vein',
    note: 'Runs posterior to the pancreas; splenic vein thrombosis can cause isolated (sinistral) gastric varices.',
  },
  {
    id: 'superiorMesentericVein',
    name: 'Superior Mesenteric Vein (SMV)',
    ...portal,
    side: 'midline',
    region: 'abdomen',
    radius: 0.12,
    path: [
      [0.3, -1.7, 0.55],
      [0.2, -0.9, 0.55],
      [0, -0.35, 0.55],
    ],
    parentId: 'portalVein',
    supplies: 'Drains the midgut (small bowel, right/transverse colon) into the portal vein',
    note: 'Runs alongside the SMA; joins the splenic vein posterior to the pancreatic neck to form the portal vein.',
  },
  {
    id: 'rightHepaticVein',
    name: 'Right Hepatic Vein',
    ...venous,
    side: 'right',
    region: 'abdomen',
    radius: 0.1,
    path: [
      [1.3, 1.9, 0.5],
      [0.6, 2.15, 0.15],
      [0, 2.4, -0.1],
    ],
    parentId: 'inferiorVenaCava',
    supplies: 'Drains the right hepatic lobe directly into the IVC',
    note: 'One of the 3 hepatic veins used as landmarks for Couinaud liver segmentation; catheterized in TIPS.',
  },
  {
    id: 'middleHepaticVein',
    name: 'Middle Hepatic Vein',
    ...venous,
    side: 'midline',
    region: 'abdomen',
    radius: 0.09,
    path: [
      [0.4, 2.0, 0.55],
      [0.2, 2.2, 0.2],
      [0, 2.4, -0.1],
    ],
    parentId: 'inferiorVenaCava',
    supplies: 'Drains segments of the liver between the right and left lobes into the IVC',
    note: 'Runs in the main portal fissure, between the right and left hepatic lobes.',
  },
  {
    id: 'leftHepaticVein',
    name: 'Left Hepatic Vein',
    ...venous,
    side: 'left',
    region: 'abdomen',
    radius: 0.09,
    path: [
      [-0.4, 1.95, 0.5],
      [-0.2, 2.2, 0.15],
      [0, 2.4, -0.1],
    ],
    parentId: 'inferiorVenaCava',
    supplies: 'Drains the left hepatic lobe into the IVC',
    note: 'The TIPS tract typically connects a hepatic vein to a nearby portal vein branch through the liver parenchyma.',
  },
];

// ---------------------------------------------------------------------------
// Head / neck & upper limb (right authored, left mirrored)
// ---------------------------------------------------------------------------
const brachiocephalicArtery: RawVessel = {
  id: 'brachiocephalicArtery',
  name: 'Brachiocephalic (Innominate) Artery',
  ...arterial,
  side: 'right',
  region: 'thorax',
  radius: 0.18,
  path: [
    [0, 4.55, 0.35],
    [0.55, 4.95, 0.25],
    [0.95, 5.3, 0.15],
  ],
  parentId: 'aorticArch',
  supplies: 'Splits into the right common carotid and right subclavian arteries',
  note: 'The first and largest branch of the aortic arch; only present on the right (no "left brachiocephalic artery" exists).',
};

const [rightCommonCarotid, leftCommonCarotid] = lr(
  'CommonCarotid',
  'Common Carotid Artery',
  [
    [0.95, 5.3, 0.15],
    [0.9, 6.1, 0.3],
    [0.85, 6.9, 0.45],
  ],
  { ...arterial, region: 'head-neck', radius: 0.11, parentId: 'brachiocephalicArtery', supplies: 'Brain and face (via internal/external carotid branches)', note: 'Bifurcates into internal and external carotid arteries near the angle of the mandible — a key carotid stenting landmark.' },
  { left: { parentId: 'aorticArch', note: 'Arises directly from the aortic arch (unlike the right, which branches off the brachiocephalic trunk).' } },
);

const [rightSubclavianArtery, leftSubclavianArtery] = lr(
  'SubclavianArtery',
  'Subclavian Artery',
  [
    [0.95, 5.3, 0.15],
    [1.51, 5.34, -0.17],
    [2.06, 5.37, -0.49],
  ],
  { ...arterial, region: 'head-neck', radius: 0.13, parentId: 'brachiocephalicArtery', supplies: 'Upper limb (continues as axillary/brachial artery); also gives off the vertebral artery to the brain', note: 'Gives rise to the vertebral artery, a major posterior circulation supply to the brain.' },
  { left: { parentId: 'aorticArch', note: 'Arises directly from the aortic arch as the third great vessel.' } },
);

const [rightAxillaryBrachialArtery, leftAxillaryBrachialArtery] = lr(
  'AxillaryBrachialArtery',
  'Axillary / Brachial Artery',
  [
    [2.06, 5.37, -0.49],
    [3.14, 3.6, -0.61],
    [4.03, 2.15, -0.7],
  ],
  { ...arterial, region: 'upper-limb', radius: 0.09, parentId: 'rightSubclavianArtery', supplies: 'Continuation of the subclavian artery, supplying the entire arm', note: 'Common surgical/large-bore access site (brachial access) when femoral or radial access is unavailable.' },
  { left: { parentId: 'leftSubclavianArtery' } },
);

const [rightRadialArtery, leftRadialArtery] = lr(
  'RadialArtery',
  'Radial Artery',
  [
    [4.03, 2.15, -0.7],
    [4.5, 1.03, -0.62],
    [4.97, -0.1, -0.54],
    [5.28, -1.32, -0.26],
  ],
  { ...arterial, region: 'upper-limb', radius: 0.045, parentId: 'rightAxillaryBrachialArtery', supplies: 'Lateral forearm and hand (contributes to the palmar arches)', note: 'The primary access site for transradial cardiac and IR procedures — lower bleeding risk than femoral access.' },
  { left: { parentId: 'leftAxillaryBrachialArtery' } },
);

const [rightUlnarArtery, leftUlnarArtery] = lr(
  'UlnarArtery',
  'Ulnar Artery',
  [
    [4.03, 2.15, -0.7],
    [4.35, 1.0, -0.78],
    [4.75, -0.1, -0.68],
    [5.05, -1.32, -0.42],
  ],
  { ...arterial, region: 'upper-limb', radius: 0.045, parentId: 'rightAxillaryBrachialArtery', supplies: 'Medial forearm and hand (contributes to the palmar arches)', note: 'A normal Allen test confirms ulnar collateral flow before radial artery access/closure.' },
  { left: { parentId: 'leftAxillaryBrachialArtery' } },
);

const [rightInternalJugularVein, leftInternalJugularVein] = lr(
  'InternalJugularVein',
  'Internal Jugular Vein (IJ)',
  [
    [0.95, 6.9, 0.25],
    [1.0, 6.1, 0.15],
    [1.0, 5.35, 0.05],
  ],
  { ...venous, region: 'head-neck', radius: 0.14, parentId: null, supplies: 'Drains the brain, face, and neck into the brachiocephalic vein', note: 'The preferred, ultrasound-guided site for central venous catheter placement.' },
);

const [rightSubclavianVein, leftSubclavianVein] = lr(
  'SubclavianVein',
  'Subclavian Vein',
  [
    [2.06, 5.32, -0.39],
    [1.56, 5.31, -0.17],
    [1.05, 5.3, 0.05],
  ],
  { ...venous, region: 'head-neck', radius: 0.13, parentId: null, supplies: 'Continuation of the axillary vein, draining the upper limb into the brachiocephalic vein', note: 'Common site for port-a-cath and dialysis catheter placement, though associated with a higher central stenosis risk than the IJ.' },
);

const [rightBrachiocephalicVein, leftBrachiocephalicVein] = lr(
  'BrachiocephalicVein',
  'Brachiocephalic Vein',
  [
    [1.0, 5.32, 0.1],
    [0.5, 5.1, 0.15],
    [0, 4.95, 0.15],
  ],
  { ...venous, region: 'thorax', radius: 0.18, parentId: 'superiorVenaCava', supplies: 'Formed by the union of the internal jugular and subclavian veins; drains into the SVC', note: 'The left brachiocephalic vein is notably longer, crossing the midline anterior to the arch branches to join the right side and form the SVC.' },
);

const [rightAxillaryBrachialVein, leftAxillaryBrachialVein] = lr(
  'AxillaryBrachialVein',
  'Axillary / Brachial Vein',
  [
    [2.06, 5.32, -0.39],
    [3.14, 3.6, -0.51],
    [4.03, 2.2, -0.6],
  ],
  { ...venous, region: 'upper-limb', radius: 0.09, parentId: 'rightSubclavianVein', supplies: 'Deep venous drainage of the arm, continuing as the subclavian vein', note: 'Deep vein of the arm; paired with the brachial artery.' },
);

const [rightCephalicVein, leftCephalicVein] = lr(
  'CephalicVein',
  'Cephalic Vein',
  [
    [5.35, -1.3, -0.05],
    [5.1, 0.9, -0.2],
    [4.25, 3.0, -0.3],
    [2.6, 4.95, -0.15],
  ],
  { ...venous, region: 'upper-limb', radius: 0.05, parentId: 'rightSubclavianVein', supplies: 'Superficial lateral forearm/arm, draining into the axillary/subclavian vein via the deltopectoral groove', note: 'Frequently used to create a dialysis access fistula (e.g., radiocephalic "Brescia-Cimino" fistula) — a core IR fistulogram vessel.' },
);

const [rightBasilicVein, leftBasilicVein] = lr(
  'BasilicVein',
  'Basilic Vein',
  [
    [4.75, -1.3, -0.35],
    [4.55, 1.1, -0.45],
    [4.15, 2.95, -0.55],
  ],
  { ...venous, region: 'upper-limb', radius: 0.05, parentId: 'rightAxillaryBrachialVein', supplies: 'Superficial medial forearm/arm, joining the brachial veins to form the axillary vein', note: 'The preferred vein for PICC line insertion due to its straight, large-caliber course.' },
);

// ---------------------------------------------------------------------------
// Pelvis & lower limb (right authored, left mirrored)
// ---------------------------------------------------------------------------
const [rightCommonIliacArtery, leftCommonIliacArtery] = lr(
  'CommonIliacArtery',
  'Common Iliac Artery',
  [
    [0, -3.0, 0],
    [0.55, -3.5, 0.0],
    [0.95, -3.95, -0.05],
  ],
  { ...arterial, region: 'pelvis', radius: 0.15, parentId: 'abdominalAorta', supplies: 'Splits into the internal and external iliac arteries', note: 'Formed by the terminal bifurcation of the abdominal aorta (~L4).' },
);

const [rightExternalIliacArtery, leftExternalIliacArtery] = lr(
  'ExternalIliacArtery',
  'External Iliac Artery',
  [
    [0.95, -3.95, -0.05],
    [1.05, -4.35, 0.15],
    [1.1, -4.65, 0.35],
  ],
  { ...arterial, region: 'pelvis', radius: 0.13, parentId: 'rightCommonIliacArtery', supplies: 'Continues as the common femoral artery, supplying the lower limb', note: 'Gives off no major pelvic branches; a pure conduit to the leg (unlike the internal iliac).' },
);

const [rightInternalIliacArtery, leftInternalIliacArtery] = lr(
  'InternalIliacArtery',
  'Internal Iliac (Hypogastric) Artery',
  [
    [0.95, -3.95, -0.05],
    [1.5, -4.25, -0.35],
    [1.75, -4.5, -0.55],
  ],
  { ...arterial, region: 'pelvis', radius: 0.1, parentId: 'rightCommonIliacArtery', supplies: 'Pelvic viscera, gluteal region, and perineum (uterine/prostatic, vesical, rectal, gluteal branches)', note: 'The workhorse vessel for pelvic embolization: postpartum hemorrhage, trauma, UFE, and PAE all originate here.' },
);

const uterineArtery: RawVessel = {
  id: 'uterineArtery',
  name: 'Uterine Artery',
  ...arterial,
  side: 'midline',
  region: 'pelvis',
  radius: 0.06,
  path: [
    [1.75, -4.5, -0.55],
    [0.9, -4.75, -0.25],
    [0.25, -4.85, 0.05],
  ],
  parentId: 'rightInternalIliacArtery',
  supplies: 'Uterus, and via anastomoses, the ovaries',
  note: 'The target vessel (bilateral) in Uterine Fibroid Embolization (UFE) for symptomatic fibroids.',
};

const prostaticArtery: RawVessel = {
  id: 'prostaticArtery',
  name: 'Prostatic Artery',
  ...arterial,
  side: 'midline',
  region: 'pelvis',
  radius: 0.045,
  path: [
    [1.75, -4.5, -0.55],
    [0.85, -4.95, -0.35],
    [0.2, -5.1, -0.15],
  ],
  parentId: 'leftInternalIliacArtery',
  supplies: 'Prostate gland',
  note: 'The target vessel (bilateral) in Prostatic Artery Embolization (PAE) for benign prostatic hyperplasia (BPH).',
};

const [rightCommonFemoralArtery, leftCommonFemoralArtery] = lr(
  'CommonFemoralArtery',
  'Common Femoral Artery (CFA)',
  [
    [1.1, -4.65, 0.35],
    [1.2, -5.1, 0.3],
  ],
  { ...arterial, region: 'lower-limb', radius: 0.12, parentId: 'rightExternalIliacArtery', supplies: 'Splits into the superficial femoral and profunda femoris arteries', note: 'The most common arterial access site in IR/cardiology — punctured over the femoral head under fluoroscopic or ultrasound guidance.' },
);

const [rightSFA, leftSFA] = lr(
  'SFA',
  'Superficial Femoral Artery (SFA)',
  [
    [1.2, -5.1, 0.3],
    [1.25, -6.2, 0.15],
    [1.2, -7.0, 0.1],
  ],
  { ...arterial, region: 'lower-limb', radius: 0.09, parentId: 'rightCommonFemoralArtery', supplies: 'Continues into the thigh, becoming the popliteal artery at the adductor hiatus', note: 'A frequent site of atherosclerotic peripheral arterial disease, treated with angioplasty/stenting or atherectomy.' },
);

const [rightPoplitealArtery, leftPoplitealArtery] = lr(
  'PoplitealArtery',
  'Popliteal Artery',
  [
    [1.2, -7.0, 0.1],
    [1.15, -7.6, -0.05],
    [1.15, -8.0, -0.1],
  ],
  { ...arterial, region: 'lower-limb', radius: 0.07, parentId: 'rightSFA', supplies: 'Splits into the anterior tibial and tibioperoneal trunk, supplying the lower leg and foot', note: 'Runs through the popliteal fossa behind the knee; entrapment syndrome can affect young athletes.' },
);

const [rightCommonIliacVein, leftCommonIliacVein] = lr(
  'CommonIliacVein',
  'Common Iliac Vein',
  [
    [0.95, -4.0, -0.15],
    [0.5, -3.5, -0.25],
    [0, -3.05, -0.3],
  ],
  { ...venous, region: 'pelvis', radius: 0.16, parentId: 'inferiorVenaCava', supplies: 'Formed by the external and internal iliac veins; drains into the IVC', note: 'The left common iliac vein can be compressed by the overlying right common iliac artery — May-Thurner syndrome, a classic IR venous stenting indication.' },
);

const [rightExternalIliacVein, leftExternalIliacVein] = lr(
  'ExternalIliacVein',
  'External Iliac Vein',
  [
    [1.05, -4.4, 0.1],
    [1.0, -4.2, -0.05],
    [0.95, -4.0, -0.15],
  ],
  { ...venous, region: 'pelvis', radius: 0.14, parentId: 'rightCommonIliacVein', supplies: 'Continuation of the femoral vein, draining the lower limb', note: 'Continues as the common iliac vein proximally and the femoral vein distally.' },
);

const [rightInternalIliacVein, leftInternalIliacVein] = lr(
  'InternalIliacVein',
  'Internal Iliac (Hypogastric) Vein',
  [
    [1.7, -4.45, -0.5],
    [1.3, -4.2, -0.35],
    [0.95, -4.0, -0.15],
  ],
  { ...venous, region: 'pelvis', radius: 0.11, parentId: 'rightCommonIliacVein', supplies: 'Drains the pelvic viscera, gluteal region, and perineum', note: 'Venous counterpart to the internal iliac artery; relevant in pelvic congestion syndrome embolization.' },
);

const [rightFemoralVein, leftFemoralVein] = lr(
  'FemoralVein',
  'Femoral Vein',
  [
    [1.25, -6.9, 0.05],
    [1.15, -5.9, 0.2],
    [1.05, -4.7, 0.15],
  ],
  { ...venous, region: 'lower-limb', radius: 0.11, parentId: 'rightExternalIliacVein', supplies: 'Deep venous drainage of the thigh, continuing as the external iliac vein', note: 'A common site of lower-extremity deep vein thrombosis (DVT) and an alternate large-bore venous access site.' },
);

const [rightPoplitealVein, leftPoplitealVein] = lr(
  'PoplitealVein',
  'Popliteal Vein',
  [
    [1.15, -8.0, -0.15],
    [1.15, -7.6, -0.1],
    [1.2, -7.0, 0.0],
  ],
  { ...venous, region: 'lower-limb', radius: 0.08, parentId: 'rightFemoralVein', supplies: 'Deep venous drainage of the lower leg, continuing as the femoral vein', note: 'Continuous with the femoral vein above the adductor hiatus; a frequent DVT location assessed on lower-extremity ultrasound.' },
);

const [rightGreatSaphenousVein, leftGreatSaphenousVein] = lr(
  'GreatSaphenousVein',
  'Great Saphenous Vein (GSV)',
  [
    [0.85, -8.7, 0.55],
    [1.1, -7.0, 0.6],
    [1.35, -5.6, 0.6],
    [1.3, -4.75, 0.45],
  ],
  { ...venous, region: 'lower-limb', radius: 0.05, parentId: 'rightFemoralVein', supplies: 'Superficial venous drainage of the medial leg and thigh, draining into the femoral vein at the saphenofemoral junction', note: 'The longest vein in the body and the classic target of endovenous laser/radiofrequency ablation for varicose veins/reflux.' },
);

// ---------------------------------------------------------------------------
// Renal-associated gonadal vessels (classic teaching pair: L vs R drainage)
// ---------------------------------------------------------------------------
const [rightGonadalArtery, leftGonadalArtery] = lr(
  'GonadalArtery',
  'Gonadal Artery',
  [
    [0, -1.2, -0.05],
    [0.6, -2.6, 0.15],
    [0.6, -4.0, 0.15],
  ],
  { ...arterial, region: 'abdomen', radius: 0.03, parentId: 'abdominalAorta', supplies: 'Testis (testicular artery) or ovary (ovarian artery)', note: 'Arises directly from the abdominal aorta just below the renal arteries — a long retroperitoneal course to the gonad.' },
);

const rightRenalVein: RawVessel = {
  id: 'rightRenalVein',
  name: 'Right Renal Vein',
  ...venous,
  side: 'right',
  region: 'abdomen',
  radius: 0.11,
  path: [
    [1.85, -0.1, -0.55],
    [0, 0.0, -0.3],
  ],
  parentId: 'inferiorVenaCava',
  supplies: 'Drains the right kidney into the IVC',
  note: 'Short and drains directly and almost horizontally into the IVC (unlike the longer left renal vein).',
};

const leftRenalVein: RawVessel = {
  id: 'leftRenalVein',
  name: 'Left Renal Vein',
  ...venous,
  side: 'left',
  region: 'abdomen',
  radius: 0.11,
  path: [
    [-1.85, -0.1, -0.55],
    [-0.9, 0.05, -0.35],
    [0, 0.1, -0.25],
  ],
  parentId: 'inferiorVenaCava',
  supplies: 'Drains the left kidney (and the left gonadal and left adrenal veins) into the IVC',
  note: 'Longer than the right, crossing anterior to the aorta ("nutcracker" compression here causes nutcracker syndrome); also receives the left gonadal vein.',
};

const rightGonadalVein: RawVessel = {
  id: 'rightGonadalVein',
  name: 'Right Gonadal Vein',
  ...venous,
  side: 'right',
  region: 'abdomen',
  radius: 0.035,
  path: [
    [0.6, -4.0, 0.15],
    [0.55, -2.4, 0.05],
    [0.3, -0.8, -0.15],
  ],
  parentId: 'inferiorVenaCava',
  supplies: 'Testis (testicular vein) or ovary (ovarian vein)',
  note: 'Drains directly into the IVC — a key asymmetry vs. the left side, relevant to varicocele/pelvic congestion embolization planning.',
};

const leftGonadalVein: RawVessel = {
  id: 'leftGonadalVein',
  name: 'Left Gonadal Vein',
  ...venous,
  side: 'left',
  region: 'abdomen',
  radius: 0.035,
  path: [
    [-0.6, -4.0, 0.15],
    [-0.55, -2.4, 0.05],
    [-0.85, -0.15, -0.2],
  ],
  parentId: 'leftRenalVein',
  supplies: 'Testis (testicular vein) or ovary (ovarian vein)',
  note: 'Drains into the left renal vein (not the IVC directly) — its longer, higher-pressure course explains why left-sided varicoceles are far more common.',
};

// ---------------------------------------------------------------------------
export const RAW_VESSELS: RawVessel[] = [
  ...midline,
  brachiocephalicArtery,
  rightCommonCarotid,
  leftCommonCarotid,
  rightSubclavianArtery,
  leftSubclavianArtery,
  rightAxillaryBrachialArtery,
  leftAxillaryBrachialArtery,
  rightRadialArtery,
  leftRadialArtery,
  rightUlnarArtery,
  leftUlnarArtery,
  rightInternalJugularVein,
  leftInternalJugularVein,
  rightSubclavianVein,
  leftSubclavianVein,
  rightBrachiocephalicVein,
  leftBrachiocephalicVein,
  rightAxillaryBrachialVein,
  leftAxillaryBrachialVein,
  rightCephalicVein,
  leftCephalicVein,
  rightBasilicVein,
  leftBasilicVein,
  rightCommonIliacArtery,
  leftCommonIliacArtery,
  rightExternalIliacArtery,
  leftExternalIliacArtery,
  rightInternalIliacArtery,
  leftInternalIliacArtery,
  uterineArtery,
  prostaticArtery,
  rightCommonFemoralArtery,
  leftCommonFemoralArtery,
  rightSFA,
  leftSFA,
  rightPoplitealArtery,
  leftPoplitealArtery,
  rightCommonIliacVein,
  leftCommonIliacVein,
  rightExternalIliacVein,
  leftExternalIliacVein,
  rightInternalIliacVein,
  leftInternalIliacVein,
  rightFemoralVein,
  leftFemoralVein,
  rightPoplitealVein,
  leftPoplitealVein,
  rightGreatSaphenousVein,
  leftGreatSaphenousVein,
  rightGonadalArtery,
  leftGonadalArtery,
  rightRenalVein,
  leftRenalVein,
  rightGonadalVein,
  leftGonadalVein,
];

export function buildVesselGraph(raw: RawVessel[]): { vessels: Vessel[]; byId: Map<string, Vessel> } {
  const byId = new Map<string, Vessel>();
  for (const v of raw) byId.set(v.id, { ...v, childrenIds: [] });
  for (const v of byId.values()) {
    if (v.parentId && byId.has(v.parentId)) {
      byId.get(v.parentId)!.childrenIds.push(v.id);
    }
  }
  return { vessels: [...byId.values()], byId };
}

export const { vessels: VESSELS, byId: VESSELS_BY_ID } = buildVesselGraph(RAW_VESSELS);

export function colorForVessel(v: Pick<RawVessel, 'subtype'>): string {
  if (v.subtype === 'portal-venous') return PORTAL_COLOR;
  if (v.subtype === 'systemic-venous') return VEIN_COLOR;
  return ARTERY_COLOR;
}
