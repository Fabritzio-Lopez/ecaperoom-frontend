import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import WelcomeScreen from './components/WelcomeScreen';
import QuestionRoom from './components/QuestionRoom';
import GameOverScreen from './components/GameOverScreen';
import VictoryScreen from './components/VictoryScreen';
import AdminPanel from './components/AdminPanel';
import { QUESTIONS } from './data/questions';
import { ShieldCheck, Check } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState('welcome'); // 'welcome' | 'playing' | 'gameover' | 'victory'
  const [currentLevel, setCurrentLevel] = useState(1); // 1 a 7
  const [lives, setLives] = useState(3); // 3 vidas máximas
  const [playerName, setPlayerName] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [answersLog, setAnswersLog] = useState([]); // Historial de respuestas por cada bóveda
  const [isAdminOpen, setIsAdminOpen] = useState(false); // Modal del panel de administrador

  // Manejador del cronómetro en vivo
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Iniciar partida desde la pantalla de bienvenida
  const handleStartGame = (name) => {
    setPlayerName(name);
    setElapsedSeconds(0);
    setLives(3);
    setCurrentLevel(1);
    setAnswersLog([]);
    setIsTimerRunning(true);
    setGameState('playing');
  };

  // Manejar respuesta acertada
  const handleCorrectAnswer = (answerKey) => {
    const currentQ = QUESTIONS[currentLevel - 1];
    setAnswersLog((prev) => [
      ...prev,
      {
        questionId: currentLevel,
        question: currentQ ? currentQ.question : `Bóveda ${currentLevel}`,
        answer: answerKey,
        isCorrect: true,
      },
    ]);

    if (currentLevel < QUESTIONS.length) {
      setCurrentLevel((prev) => prev + 1);
    } else {
      // Completó las 7 bóvedas -> Victoria
      setIsTimerRunning(false);
      setGameState('victory');
    }
  };

  // Manejar equivocación (pierde 1 vida)
  const handleWrongAnswer = (answerKey) => {
    const currentQ = QUESTIONS[currentLevel - 1];
    setAnswersLog((prev) => [
      ...prev,
      {
        questionId: currentLevel,
        question: currentQ ? currentQ.question : `Bóveda ${currentLevel}`,
        answer: answerKey,
        isCorrect: false,
      },
    ]);

    setLives((prevLives) => {
      const nextLives = prevLives - 1;
      if (nextLives <= 0) {
        setIsTimerRunning(false);
        setGameState('gameover');
      }
      return nextLives;
    });
  };

  // Reintentar tras Game Over
  const handleRetryAfterGameOver = () => {
    setLives(3);
    setCurrentLevel(1);
    setAnswersLog([]);
    setElapsedSeconds(0);
    setIsTimerRunning(true);
    setGameState('playing');
  };

  // Reiniciar juego completo al inicio
  const handleResetGame = () => {
    setIsTimerRunning(false);
    setElapsedSeconds(0);
    setLives(3);
    setCurrentLevel(1);
    setAnswersLog([]);
    setGameState('welcome');
  };

  const currentQuestionData = QUESTIONS[currentLevel - 1];

  return (
    <div className="min-h-screen flex flex-col justify-between text-slate-100">
      {/* Barra de navegación superior */}
      <Navbar
        playerName={playerName}
        gameState={gameState}
        elapsedSeconds={elapsedSeconds}
        isTimerRunning={isTimerRunning}
        lives={lives}
        onResetGame={handleResetGame}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Barra de Progreso de las 7 Bóvedas (Visible durante el juego) */}
      {gameState === 'playing' && (
        <div className="w-full bg-slate-950/60 border-b border-slate-900 py-3">
          <div className="max-w-2xl mx-auto px-4 flex items-center justify-between gap-1">
            {QUESTIONS.map((q, idx) => {
              const levelNum = idx + 1;
              const isPast = currentLevel > levelNum;
              const isCurrent = currentLevel === levelNum;

              return (
                <React.Fragment key={q.id}>
                  {/* Nodo de nivel */}
                  <div className="flex flex-col items-center">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                        isPast
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : isCurrent
                          ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/30 scale-110 shadow-lg shadow-cyan-500/40'
                          : 'bg-slate-900 text-slate-600 border border-slate-800'
                      }`}
                    >
                      {isPast ? <Check className="w-4 h-4 stroke-[3]" /> : levelNum}
                    </span>
                    <span
                      className={`text-[10px] font-mono mt-1 hidden sm:block ${
                        isCurrent
                          ? 'text-cyan-400 font-bold'
                          : isPast
                          ? 'text-emerald-400'
                          : 'text-slate-600'
                      }`}
                    >
                      B{levelNum}
                    </span>
                  </div>

                  {/* Conector entre nodos */}
                  {levelNum < QUESTIONS.length && (
                    <div
                      className={`flex-1 h-[2px] transition-all ${
                        isPast ? 'bg-emerald-500' : 'bg-slate-800'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Contenido Dinámico según el estado del juego */}
      <main className="flex-1 flex flex-col justify-center">
        {gameState === 'welcome' && (
          <WelcomeScreen
            onStartGame={handleStartGame}
            onOpenAdmin={() => setIsAdminOpen(true)}
          />
        )}

        {gameState === 'playing' && currentQuestionData && (
          <QuestionRoom
            questionData={currentQuestionData}
            currentLevel={currentLevel}
            totalLevels={QUESTIONS.length}
            lives={lives}
            onCorrectAnswer={handleCorrectAnswer}
            onWrongAnswer={handleWrongAnswer}
          />
        )}

        {gameState === 'gameover' && (
          <GameOverScreen
            failedAtLevel={currentLevel}
            onRetry={handleRetryAfterGameOver}
          />
        )}

        {gameState === 'victory' && (
          <VictoryScreen
            playerName={playerName}
            totalSeconds={elapsedSeconds}
            answersLog={answersLog}
            livesRemaining={lives}
            onPlayAgain={handleResetGame}
            onOpenAdmin={() => setIsAdminOpen(true)}
          />
        )}
      </main>

      {/* Modal de Control de Administrador */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* Footer Informativo */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Escape Room Web © {new Date().getFullYear()} • "Jóvenes Creadores: Del Negocio Informal al Trabajo Digno" (ODS 8)
          </span>
          <div className="flex items-center space-x-3 text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> PostgreSQL en Supabase
            </span>
            <span>•</span>
            <span>Express + React (Vite) + Tailwind CSS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
