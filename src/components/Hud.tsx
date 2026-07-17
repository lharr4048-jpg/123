import type { Mode } from '../game/useGameEngine';

interface HudProps {
  mode: Mode;
  score: number;
  round: number;
  streak: number;
  bestStreak: number;
  onModeChange: (mode: Mode) => void;
  onReset: () => void;
}

export default function Hud({ mode, score, round, streak, bestStreak, onModeChange, onReset }: HudProps) {
  return (
    <header className="hud">
      <div className="hud-title">
        <span className="hud-title-main">IR Vascular Anatomy</span>
        <span className="hud-title-sub">Interventional Radiology Atlas &amp; Quiz</span>
      </div>

      <div className="hud-mode">
        <button className={`mode-btn${mode === 'quiz' ? ' active' : ''}`} onClick={() => onModeChange('quiz')}>
          Quiz Mode
        </button>
        <button className={`mode-btn${mode === 'explore' ? ' active' : ''}`} onClick={() => onModeChange('explore')}>
          Explore Mode
        </button>
      </div>

      {mode === 'quiz' ? (
        <div className="hud-stats">
          <div className="stat">
            <span className="stat-value">{score}</span>
            <span className="stat-label">Score</span>
          </div>
          <div className="stat">
            <span className="stat-value">{round}</span>
            <span className="stat-label">Round</span>
          </div>
          <div className="stat">
            <span className="stat-value">{streak}</span>
            <span className="stat-label">Streak</span>
          </div>
          <div className="stat">
            <span className="stat-value">{bestStreak}</span>
            <span className="stat-label">Best</span>
          </div>
          <button className="btn btn-ghost" onClick={onReset}>
            Restart
          </button>
        </div>
      ) : (
        <div className="hud-legend">
          <span className="legend-item">
            <span className="swatch swatch-artery" /> Artery
          </span>
          <span className="legend-item">
            <span className="swatch swatch-vein" /> Systemic vein
          </span>
          <span className="legend-item">
            <span className="swatch swatch-portal" /> Portal vein
          </span>
        </div>
      )}
    </header>
  );
}
