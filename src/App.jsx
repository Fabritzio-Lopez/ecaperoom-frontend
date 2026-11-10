import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import WelcomeScreen from './components/WelcomeScreen';
import Level1Numeric from './components/Level1Numeric';
import Level2Word from './components/Level2Word';
import Level3Sum from './components/Level3Sum';
import VictoryScreen from './components/VictoryScreen';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState('welcome'); // 'welcome' | 'level1' | 'level2' | 'level3' | 'victory'
  const [playerName, setPlayerName] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Manejador del cronómetro
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

  // Iniciar partida
  const handleStartGame = (name) => {
    setPlayerName(name);
    setElapsedSeconds(0);
    setIsTimerRunning(true);
    setGameState('level1');
  };

  // Pasar de Nivel 1 a Nivel 2
  const handleCompleteLevel1 = () => {
    setGameState('level2');
  };

  // Pasar de Nivel 2 a Nivel 3
  const handleCompleteLevel2 = () => {
    setGameState('level3');
  };

  // Completar el Escape Room (Victoria)
  const handleCompleteLevel3 = () => {
    setIsTimerRunning(false);
    setGameState('victory');
  };

  // Reiniciar juego
  const handleResetGame = () => {
    setIsTimerRunning(false);
    setElapsedSeconds(0);
    setGameState('welcome');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between text-slate-100">
      {/* Barra de navegación superior */}
      <Navbar
        playerName={playerName}
        gameState={gameState}
        elapsedSeconds={elapsedSeconds}
        isTimerRunning={isTimerRunning}
        onResetGame={handleResetGame}
      />

      {/* Barra de Progreso de Niveles (Solo visible durante el juego) */}
      {gameState !== 'welcome' && gameState !== 'victory' && (
        <div className="w-full bg-slate-950/50 border-b border-slate-900 py-2.5">
          <div className="max-w-2xl mx-auto px-4 flex items-center justify-between">
            {/* Nivel 1 */}
            <div className="flex items-center space-x-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                  gameState === 'level1'
                    ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20'
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                }`}
              >
                {gameState !== 'level1' ? '✓' : '1'}
              </span>
              <span
                className={`text-xs font-semibold ${
                  gameState === 'level1' ? 'text-white' : 'text-slate-500'
                }`}
              >
                Cerrojo Numérico
              </span>
            </div>

            <div className="w-8 h-[2px] bg-slate-800" />

            {/* Nivel 2 */}
            <div className="flex items-center space-x-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                  gameState === 'level2'
                    ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/20'
                    : gameState === 'level3'
                    ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/40'
                    : 'bg-slate-900 text-slate-600 border border-slate-800'
                }`}
              >
                {gameState === 'level3' ? '✓' : '2'}
              </span>
              <span
                className={`text-xs font-semibold ${
                  gameState === 'level2' ? 'text-white' : 'text-slate-500'
                }`}
              >
                Cerrojo de Palabra
              </span>
            </div>

            <div className="w-8 h-[2px] bg-slate-800" />

            {/* Nivel 3 */}
            <div className="flex items-center space-x-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                  gameState === 'level3'
                    ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20'
                    : 'bg-slate-900 text-slate-600 border border-slate-800'
                }`}
              >
                3
              </span>
              <span
                className={`text-xs font-semibold ${
                  gameState === 'level3' ? 'text-white' : 'text-slate-500'
                }`}
              >
                Cerrojo de Suma
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Contenido Dinámico según el estado del juego */}
      <main className="flex-1 flex flex-col justify-center">
        {gameState === 'welcome' && (
          <WelcomeScreen onStartGame={handleStartGame} />
        )}

        {gameState === 'level1' && (
          <Level1Numeric onComplete={handleCompleteLevel1} />
        )}

        {gameState === 'level2' && (
          <Level2Word onComplete={handleCompleteLevel2} />
        )}

        {gameState === 'level3' && (
          <Level3Sum onComplete={handleCompleteLevel3} />
        )}

        {gameState === 'victory' && (
          <VictoryScreen
            playerName={playerName}
            totalSeconds={elapsedSeconds}
            onPlayAgain={handleResetGame}
          />
        )}
      </main>

      {/* Footer Informativo */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Escape Room Web © {new Date().getFullYear()} • Iniciativa de concientización ODS 8
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
