import Scene from './components/Scene';
import QuestionPanel from './components/QuestionPanel';
import Hud from './components/Hud';
import { useGameEngine } from './game/useGameEngine';
import './App.css';

function App() {
  const game = useGameEngine();

  return (
    <div className="app">
      <Hud
        mode={game.mode}
        score={game.score}
        round={game.round}
        streak={game.streak}
        bestStreak={game.bestStreak}
        onModeChange={game.setMode}
        onReset={game.reset}
      />
      <main className="stage">
        <div className="canvas-wrap">
          <Scene currentVessel={game.currentVessel} onSelect={game.selectVessel} />
          <div className="canvas-hint">Drag to rotate &middot; scroll to zoom{game.mode === 'explore' ? ' · click any vessel' : ''}</div>
        </div>
        <aside className="sidebar">
          <QuestionPanel
            mode={game.mode}
            vessel={game.currentVessel}
            question={game.question}
            selectedIndex={game.selectedIndex}
            answered={game.answered}
            onAnswer={game.answer}
            onNext={game.next}
          />
        </aside>
      </main>
    </div>
  );
}

export default App;
