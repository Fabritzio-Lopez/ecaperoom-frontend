import React, { useState } from 'react';
import Timer from './Timer';
import { User, RotateCcw, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { soundFX } from '../utils/audio';

export default function Navbar({
  playerName,
  gameState,
  elapsedSeconds,
  isTimerRunning,
  lives,
  onResetGame,
  onOpenAdmin,
}) {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleToggleSound = () => {
    const isNowOn = soundFX.toggleSound();
    setSoundEnabled(isNowOn);
    if (isNowOn) {
      soundFX.playDialClick();
    }
  };

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
              Proyecto Jóvenes Creadores
            </p>
          </div>
        </div>

        {/* Indicadores de Progreso, Vidas, Sonido y Usuario */}
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* Contador de vidas en el Navbar */}
          {gameState === 'playing' && (
            <div
              className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-full shadow-inner"
              title={`Te quedan ${lives} vidas`}
            >
              {[1, 2, 3].map((h) => (
                <span
                  key={h}
                  className={`text-xs md:text-sm transition-all ${
                    h <= lives
                      ? 'scale-100 drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]'
                      : 'opacity-30 grayscale'
                  }`}
                >
                  {h <= lives ? '❤️' : '🖤'}
                </span>
              ))}
            </div>
          )}

          {/* Botón de Sonido Efectos Escape Room */}
          <button
            onClick={handleToggleSound}
            title={soundEnabled ? 'Silenciar Efectos de Sonido' : 'Activar Sonidos de Escape Room'}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-amber-400 transition"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Botón de Acceso al Panel de Administrador */}
          <button
            onClick={onOpenAdmin}
            title="Panel de Administrador (Credenciales requeridas)"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-amber-400 transition"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </button>

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
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-rose-400 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
