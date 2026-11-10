import React from 'react';
import Timer from './Timer';
import { ShieldCheck, User, RotateCcw } from 'lucide-react';

export default function Navbar({
  playerName,
  gameState,
  elapsedSeconds,
  isTimerRunning,
  onResetGame,
}) {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Identidad de Marca ODS 8 */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-700 to-rose-900 border border-rose-500/40 flex items-center justify-center shadow-lg shadow-rose-900/30">
            <span className="font-extrabold text-white text-lg tracking-tight">8</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-white text-base md:text-lg tracking-wide">
                ESCAPE ROOM <span className="text-emerald-400">ODS 8</span>
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300">
                Trabajo Decente
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Misión de Reactivación Económica Sostenible
            </p>
          </div>
        </div>

        {/* Indicadores de Progreso y Usuario */}
        <div className="flex items-center space-x-3">
          {playerName && (
            <div className="hidden md:flex items-center space-x-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full text-xs text-slate-300">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Agente:</span>
              <span className="font-semibold text-white">{playerName}</span>
            </div>
          )}

          {/* Cronómetro en vivo */}
          {gameState !== 'welcome' && (
            <Timer seconds={elapsedSeconds} isRunning={isTimerRunning} />
          )}

          {/* Botón de reinicio si ya empezó la partida */}
          {gameState !== 'welcome' && (
            <button
              onClick={onResetGame}
              title="Reiniciar partida"
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-rose-400 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
