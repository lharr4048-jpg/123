import { useCallback, useMemo, useState } from 'react';
import { VESSELS, VESSELS_BY_ID, type Vessel } from '../data/vessels';
import { generateQuestion, type Question } from '../data/questions';

export type Mode = 'quiz' | 'explore';

interface GameState {
  mode: Mode;
  currentVessel: Vessel;
  question: Question | null;
  selectedIndex: number | null;
  answered: boolean;
  score: number;
  streak: number;
  bestStreak: number;
  round: number;
  recentIds: string[];
}

function pickVessel(exclude: string[]): Vessel {
  const pool = VESSELS.filter((v) => !exclude.includes(v.id));
  const candidates = pool.length > 0 ? pool : VESSELS;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function useGameEngine() {
  const [state, setState] = useState<GameState>(() => {
    const first = pickVessel([]);
    return {
      mode: 'quiz',
      currentVessel: first,
      question: generateQuestion(first, VESSELS, VESSELS_BY_ID),
      selectedIndex: null,
      answered: false,
      score: 0,
      streak: 0,
      bestStreak: 0,
      round: 1,
      recentIds: [first.id],
    };
  });

  const selectVessel = useCallback((vessel: Vessel) => {
    setState((s) => ({
      ...s,
      currentVessel: vessel,
      question: s.mode === 'quiz' ? generateQuestion(vessel, VESSELS, VESSELS_BY_ID) : null,
      selectedIndex: null,
      answered: false,
    }));
  }, []);

  const next = useCallback(() => {
    setState((s) => {
      const recent = [s.currentVessel.id, ...s.recentIds].slice(0, 6);
      const vessel = pickVessel(recent);
      return {
        ...s,
        currentVessel: vessel,
        question: s.mode === 'quiz' ? generateQuestion(vessel, VESSELS, VESSELS_BY_ID) : null,
        selectedIndex: null,
        answered: false,
        round: s.round + 1,
        recentIds: [vessel.id, ...recent].slice(0, 6),
      };
    });
  }, []);

  const answer = useCallback((index: number) => {
    setState((s) => {
      if (s.answered || !s.question) return s;
      const correct = index === s.question.correctIndex;
      const streak = correct ? s.streak + 1 : 0;
      return {
        ...s,
        selectedIndex: index,
        answered: true,
        score: correct ? s.score + 1 : s.score,
        streak,
        bestStreak: Math.max(s.bestStreak, streak),
      };
    });
  }, []);

  const setMode = useCallback((mode: Mode) => {
    setState((s) => ({
      ...s,
      mode,
      question: mode === 'quiz' ? generateQuestion(s.currentVessel, VESSELS, VESSELS_BY_ID) : null,
      selectedIndex: null,
      answered: false,
    }));
  }, []);

  const reset = useCallback(() => {
    const first = pickVessel([]);
    setState({
      mode: 'quiz',
      currentVessel: first,
      question: generateQuestion(first, VESSELS, VESSELS_BY_ID),
      selectedIndex: null,
      answered: false,
      score: 0,
      streak: 0,
      bestStreak: 0,
      round: 1,
      recentIds: [first.id],
    });
  }, []);

  return useMemo(
    () => ({ ...state, selectVessel, next, answer, setMode, reset }),
    [state, selectVessel, next, answer, setMode, reset],
  );
}
