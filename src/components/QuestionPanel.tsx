import type { Vessel } from '../data/vessels';
import type { Question } from '../data/questions';
import type { Mode } from '../game/useGameEngine';

interface QuestionPanelProps {
  mode: Mode;
  vessel: Vessel;
  question: Question | null;
  selectedIndex: number | null;
  answered: boolean;
  onAnswer: (index: number) => void;
  onNext: () => void;
}

const KIND_LABEL: Record<string, string> = {
  identify: 'Identify',
  proximal: 'Proximal connection',
  distal: 'Distal connection',
  supplies: 'Territory',
  clinical: 'Clinical / IR relevance',
};

export default function QuestionPanel({ mode, vessel, question, selectedIndex, answered, onAnswer, onNext }: QuestionPanelProps) {
  if (mode === 'explore') {
    return (
      <div className="panel">
        <div className="panel-badge" data-type={vessel.type}>
          {vessel.type === 'artery' ? 'Artery' : 'Vein'}
        </div>
        <h2 className="vessel-name">{vessel.name}</h2>
        <dl className="info-list">
          <dt>Supplies / drains</dt>
          <dd>{vessel.supplies}</dd>
          <dt>Region</dt>
          <dd className="capitalize">{vessel.region.replace('-', ' ')}</dd>
        </dl>
        <p className="explanation">{vessel.note}</p>
        <button className="btn btn-primary" onClick={onNext}>
          Explore another vessel →
        </button>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="panel">
      <div className="panel-badge" data-kind={question.kind}>
        {KIND_LABEL[question.kind]}
      </div>
      <p className="prompt">{question.prompt}</p>
      <div className="options">
        {question.options.map((opt, i) => {
          let state = '';
          if (answered) {
            if (i === question.correctIndex) state = 'correct';
            else if (i === selectedIndex) state = 'incorrect';
          } else if (i === selectedIndex) {
            state = 'selected';
          }
          return (
            <button
              key={`${i}-${opt}`}
              className={`option${state ? ` option-${state}` : ''}`}
              onClick={() => !answered && onAnswer(i)}
              disabled={answered}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className="feedback">
          <p className={selectedIndex === question.correctIndex ? 'feedback-correct' : 'feedback-incorrect'}>
            {selectedIndex === question.correctIndex ? 'Correct!' : 'Not quite.'}
          </p>
          <p className="explanation">{question.explanation}</p>
          <button className="btn btn-primary" onClick={onNext}>
            Next vessel →
          </button>
        </div>
      )}
    </div>
  );
}
