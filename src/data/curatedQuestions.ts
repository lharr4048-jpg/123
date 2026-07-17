// Hand-authored second/third-order questions sourced from Kandarpa et al.,
// Handbook of Interventional Radiologic Procedures (4th ed.) — collateral
// pathways, procedural anatomy pitfalls, and named clinical syndromes that
// go beyond the auto-generated identify/proximal/distal/supplies templates.
import type { Question } from './questions';

export interface CuratedQuestion {
  vesselId: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const CURATED_QUESTIONS: CuratedQuestion[] = [
  {
    vesselId: 'bronchialArtery',
    prompt: 'During bronchial artery embolization for massive hemoptysis, injecting proximal to which artery risks spinal cord infarction?',
    options: ['Artery of Adamkiewicz', 'Anterior tibial artery', 'Marginal artery of Drummond', 'Artery of Percheron'],
    correctIndex: 0,
    explanation: 'The Artery of Adamkiewicz (great radicular artery) usually arises from a left intercostal or lumbar artery between T8 and L4 and can share an origin near bronchial/intercostal branches — inadvertent embolization there can cause transverse myelitis.',
  },
  {
    vesselId: 'celiacTrunk',
    prompt: 'Chronic extrinsic compression of the celiac trunk by a fibrous band of the diaphragmatic crura, causing postprandial abdominal pain, is called:',
    options: ['May-Thurner syndrome', 'Median arcuate ligament syndrome', 'Nutcracker syndrome', 'SMA (Wilkie) syndrome'],
    correctIndex: 1,
    explanation: 'Median arcuate ligament syndrome often makes selective hepatic catheterization with a Cobra-shaped catheter difficult, favoring a reverse-curve (e.g., Simmons) catheter instead.',
  },
  {
    vesselId: 'commonHepaticArtery',
    prompt: 'During hepatic chemoembolization, catheterizing distal to which small branch is critical to avoid inadvertent gallbladder ischemia?',
    options: ['Cystic artery', 'Left gastric artery', 'Splenic artery', 'Right renal artery'],
    correctIndex: 0,
    explanation: 'The cystic artery typically arises from the right hepatic artery; embolizing proximal to it risks gallbladder necrosis, so its origin is carefully identified before treatment.',
  },
  {
    vesselId: 'superiorMesentericArtery',
    prompt: 'If the IMA is sacrificed during aortic aneurysm repair, colonic perfusion is usually preserved by retrograde flow from the SMA through which collateral network?',
    options: ['Vasa recta', 'Marginal artery of Drummond (and arc of Riolan)', 'Pancreaticoduodenal arcade', 'Gastroepiploic arcade'],
    correctIndex: 1,
    explanation: 'The marginal artery of Drummond (with the more central arc of Riolan as a variant) connects the middle colic branch of the SMA to the left colic branch of the IMA, a key collateral in mesenteric ischemia and EVAR planning.',
  },
  {
    vesselId: 'inferiorMesentericArtery',
    prompt: 'After IMA occlusion or sacrifice, the internal iliac artery can supply the rectosigmoid retrograde through which collateral vessels?',
    options: ['Uterine arteries', 'Hemorrhoidal (rectal) arteries', 'Iliolumbar arteries', 'Obturator arteries'],
    correctIndex: 1,
    explanation: 'SMA/IMA territory can connect to the internal iliac artery via hemorrhoidal (rectal) and vesicular branches — an important collateral pathway when the IMA is chronically occluded or deliberately sacrificed.',
  },
  {
    vesselId: 'uterineArtery',
    prompt: 'Before uterine fibroid embolization, aortography is often performed to screen for collateral fibroid supply from which artery, since missing it risks incomplete treatment?',
    options: ['Ovarian artery', 'Inferior mesenteric artery', 'Obturator artery', 'Deep circumflex iliac artery'],
    correctIndex: 0,
    explanation: 'Ovarian artery collateral supply to fibroids is well described; when significant, the ovarian artery may need to be selectively catheterized (e.g., with a Mikaelsson catheter) and embolized in addition to the uterine arteries.',
  },
  {
    vesselId: 'rightSubclavianArtery',
    prompt: 'Severe stenosis of the subclavian artery proximal to a branch can reverse flow down that branch during arm exertion, causing vertebrobasilar symptoms — this is:',
    options: ['Subclavian steal syndrome', 'Takayasu arteritis', 'Thoracic outlet syndrome', 'Paget-Schroetter syndrome'],
    correctIndex: 0,
    explanation: 'In subclavian steal, a proximal subclavian stenosis/occlusion causes retrograde flow down the ipsilateral vertebral artery to supply the arm, stealing from the posterior cerebral circulation — treatable with angioplasty/stenting.',
  },
  {
    vesselId: 'inferiorVenaCava',
    prompt: 'A standard IVC filter is positioned with its apex just below which structure, to minimize "dead space" above the filter if it occludes?',
    options: ['The hepatic veins', 'The lowest renal vein', 'The common iliac vein confluence', 'The diaphragm'],
    correctIndex: 1,
    explanation: 'Filters are typically deployed just below the lowest renal vein orifice; anatomic variants (duplicated IVC, circumaortic or retroaortic left renal vein) must be identified beforehand since they change the safe landing zone.',
  },
  {
    vesselId: 'leftRenalVein',
    prompt: 'A retroaortic or circumaortic left renal vein is a variant that most changes procedural planning for which intervention?',
    options: ['Uterine fibroid embolization', 'IVC filter placement', 'TIPS', 'Prostatic artery embolization'],
    correctIndex: 1,
    explanation: 'Because the left renal vein normally crosses anterior to the aorta just below the SMA origin, retroaortic or circumaortic variants change where an IVC filter can safely land relative to renal venous drainage.',
  },
  {
    vesselId: 'rightHepaticVein',
    prompt: 'The classic TIPS puncture tract runs from which hepatic vein into which portal vein branch?',
    options: ['Left hepatic vein into the left portal vein', 'Right hepatic vein into the right portal vein', 'Middle hepatic vein into the main portal vein', 'Right hepatic vein into the splenic vein'],
    correctIndex: 1,
    explanation: 'A needle is classically passed from the right hepatic vein, through the liver parenchyma, into the right portal vein; portal vein bifurcation anatomy is checked beforehand since variants raise the risk of extrahepatic portal vein perforation.',
  },
  {
    vesselId: 'leftGonadalVein',
    prompt: 'Why are left-sided varicoceles far more common than right-sided ones?',
    options: [
      'The left gonadal vein drains directly into the IVC at high pressure',
      'The left gonadal vein drains into the left renal vein at a right angle, a higher-pressure/higher-resistance pathway',
      'The right gonadal vein is longer and more tortuous',
      'The left testicle has a larger arterial supply',
    ],
    correctIndex: 1,
    explanation: 'The left gonadal vein joins the left renal vein at roughly a right angle (versus the right gonadal vein draining obliquely and directly into the IVC), predisposing the left side to venous congestion and varicocele.',
  },
  {
    vesselId: 'rightGonadalVein',
    prompt: "How does the right gonadal vein's drainage differ from the left, and why does it matter for embolization planning?",
    options: [
      'It drains into the right renal vein, same as the left',
      'It drains directly into the IVC, usually at an oblique angle, making catheterization slightly different from the left side',
      'It drains into the azygos vein',
      'It has no venous valves, unlike the left',
    ],
    correctIndex: 1,
    explanation: 'Unlike the left gonadal vein (which drains into the left renal vein), the right gonadal vein usually drains directly into the IVC — an asymmetry that is classic exam material and relevant to varicocele/pelvic congestion embolization.',
  },
  {
    vesselId: 'leftCommonIliacVein',
    prompt: 'In May-Thurner syndrome, the left common iliac vein is chronically compressed against the spine by which structure?',
    options: ['The right common iliac artery', 'The right common iliac vein', 'The inferior mesenteric artery', 'The psoas muscle'],
    correctIndex: 0,
    explanation: 'The right common iliac artery crosses anterior to the left common iliac vein and can compress it against the lumbar spine, predisposing to left-sided iliofemoral DVT — treated with venous angioplasty/stenting.',
  },
  {
    vesselId: 'rightInternalIliacArtery',
    prompt: 'After aortoiliac occlusion, lumbar arteries can maintain leg perfusion by supplying the internal iliac artery through which named branches?',
    options: ['Iliolumbar and superior gluteal arteries', 'Obturator and pudendal arteries', 'Uterine and vaginal arteries', 'Deep circumflex iliac arteries'],
    correctIndex: 0,
    explanation: 'One of the classic collateral pathways around an aortoiliac occlusion runs from lumbar arteries to the internal iliac artery via the iliolumbar and superior gluteal branches (another runs to the external iliac via the deep circumflex iliac or inferior epigastric arteries).',
  },
  {
    vesselId: 'rightSFA',
    prompt: 'When the superficial femoral artery is chronically occluded, the leg is most classically kept viable by collateral flow through:',
    options: ['The great saphenous vein', 'The profunda femoris (deep femoral) artery to the popliteal artery', 'The internal iliac artery directly', 'The inferior epigastric artery'],
    correctIndex: 1,
    explanation: 'Profunda femoris-to-popliteal collaterals are the classic pathway that preserves distal limb perfusion around an SFA occlusion — this is why the profunda is sometimes called the "artery of the second chance" in limb salvage.',
  },
];

export function curatedQuestionsFor(vesselId: string): CuratedQuestion[] {
  return CURATED_QUESTIONS.filter((q) => q.vesselId === vesselId);
}

export function toQuestion(cq: CuratedQuestion): Question {
  return {
    kind: 'clinical',
    vesselId: cq.vesselId,
    prompt: cq.prompt,
    options: cq.options,
    correctIndex: cq.correctIndex,
    explanation: cq.explanation,
  };
}
