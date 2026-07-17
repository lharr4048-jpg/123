import type { Vessel } from './vessels';

export type QuestionKind = 'identify' | 'proximal' | 'distal' | 'supplies';

export interface Question {
  kind: QuestionKind;
  vesselId: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sample<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

function buildOptions(correct: string, distractorPool: string[], count = 4): { options: string[]; correctIndex: number } {
  // Dedupe first: paired left/right vessels often share identical supplies
  // text, and offering the same string as two separate options is both a
  // React key collision and a broken quiz question.
  const pool = [...new Set(distractorPool)].filter((d) => d !== correct);
  const distractors = sample(pool, Math.min(count - 1, pool.length));
  const options = shuffle([correct, ...distractors]);
  return { options, correctIndex: options.indexOf(correct) };
}

// Distractors of the same vessel type are always anatomically plausible; we
// prefer ones from the same body region so the wrong answers are genuinely
// tempting rather than trivially out of place (e.g. don't offer a forearm
// vein as a distractor for a pelvic vein question unless we have to).
function regionalNamePool(pivot: Vessel, allVessels: Vessel[]): string[] {
  const sameType = allVessels.filter((v) => v.type === pivot.type && v.id !== pivot.id);
  const sameRegion = sameType.filter((v) => v.region === pivot.region);
  return (sameRegion.length >= 3 ? sameRegion : sameType).map((v) => v.name);
}

function availableKinds(vessel: Vessel): QuestionKind[] {
  const kinds: QuestionKind[] = ['identify', 'supplies'];
  if (vessel.parentId) kinds.push('proximal');
  if (vessel.childrenIds.length > 0) kinds.push('distal');
  return kinds;
}

export function generateQuestion(vessel: Vessel, allVessels: Vessel[], byId: Map<string, Vessel>): Question {
  const kinds = availableKinds(vessel);
  const kind = kinds[Math.floor(Math.random() * kinds.length)];
  const isVein = vessel.type === 'vein';

  switch (kind) {
    case 'identify': {
      const { options, correctIndex } = buildOptions(vessel.name, regionalNamePool(vessel, allVessels));
      return {
        kind,
        vesselId: vessel.id,
        prompt: `The highlighted ${vessel.type} is popping out of the model. What is it called?`,
        options,
        correctIndex,
        explanation: vessel.note,
      };
    }
    case 'proximal': {
      const parent = byId.get(vessel.parentId!)!;
      const { options, correctIndex } = buildOptions(parent.name, regionalNamePool(parent, allVessels));
      return {
        kind,
        vesselId: vessel.id,
        prompt: isVein
          ? `The ${vessel.name} is highlighted. Which vessel does it connect to proximally (i.e. what does it drain into, moving toward the heart)?`
          : `The ${vessel.name} is highlighted. Which vessel does it connect to proximally (i.e. what does it arise from)?`,
        options,
        correctIndex,
        explanation: isVein
          ? `The ${vessel.name} drains into the ${parent.name}. ${vessel.note}`
          : `The ${vessel.name} arises from the ${parent.name}. ${vessel.note}`,
      };
    }
    case 'distal': {
      const childId = vessel.childrenIds[Math.floor(Math.random() * vessel.childrenIds.length)];
      const child = byId.get(childId)!;
      const { options, correctIndex } = buildOptions(child.name, regionalNamePool(child, allVessels));
      const multi = vessel.childrenIds.length > 1;
      return {
        kind,
        vesselId: vessel.id,
        prompt: isVein
          ? `The ${vessel.name} is highlighted. Which of these ${multi ? 'tributaries drains into it' : 'is the vessel that drains into it'}?`
          : `The ${vessel.name} is highlighted. Which of these is ${multi ? 'one of the vessels' : 'the vessel'} it gives rise to (distally)?`,
        options,
        correctIndex,
        explanation: isVein
          ? `The ${child.name} drains into the ${vessel.name}${multi ? ' (among other tributaries)' : ''}. ${vessel.note}`
          : `The ${vessel.name} gives rise to the ${child.name}${multi ? ' (among other branches)' : ''}. ${vessel.note}`,
      };
    }
    case 'supplies':
    default: {
      const sameType = allVessels.filter((v) => v.type === vessel.type && v.id !== vessel.id);
      const suppliesPool = sameType.map((v) => v.supplies);
      const { options, correctIndex } = buildOptions(vessel.supplies, suppliesPool);
      return {
        kind: 'supplies',
        vesselId: vessel.id,
        prompt: `The ${vessel.name} is highlighted. What does it primarily supply or drain?`,
        options,
        correctIndex,
        explanation: vessel.note,
      };
    }
  }
}
