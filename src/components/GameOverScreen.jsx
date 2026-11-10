import React, { useEffect } from 'react';
import { AlertTriangle, RotateCcw, Skull, ShieldAlert } from 'lucide-react';
import { soundFX } from '../utils/audio';

export default function GameOverScreen({ failedAtLevel, onRetry }) {
  useEffect(() => {
    soundFX.playGameOver();
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 text-center animate-scaleIn">
      <div className="relative overflow-hidden rounded-3xl border-4 border-rose-600 bg-gradient-to-b from-rose-950/90 via-slate-950 to-neutral-950 p-8 md:p-12 shadow-2xl shadow-rose-950/80 backdrop-blur-xl">
        {/* Luces estroboscópicas de alarma */}
        <div className="absolute top-0 inset-x-0 h-2 bg-[repeating-linear-gradient(45deg,#e11d48,#e11d48_10px,#000_10px,#000_20px)] opacity-80" />

        {/* Ícono de alarma / bloqueo */}
        <div className="w-24 h-24 mx-auto rounded-3xl bg-rose-600/20 border-2 border-rose-500 flex items-center justify-center text-rose-500 mb-6 shadow-lg shadow-rose-600/30 animate-pulse">
          <Skull className="w-12 h-12" />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-950 border border-rose-500 text-rose-300 text-xs font-mono font-bold uppercase tracking-wider mb-4">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          Alarma de Intrusión Activada • 0 Vidas
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase mb-3">
          ¡Bóveda Bloqueada!
        </h1>

        <p className="text-slate-300 text-sm md:text-base max-w-md mx-auto mb-6">
          Has cometido <strong>3 equivocaciones</strong> y el protocolo de seguridad cerró herméticamente las compuertas de la bóveda.
        </p>

        {/* Estadísticas de la partida fallida */}
        <div className="bg-slate-950/80 border border-rose-900/60 rounded-2xl p-4 max-w-xs mx-auto mb-8 font-mono text-xs text-slate-400">
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span>Progreso Alcanzado:</span>
            <span className="text-rose-400 font-bold">Bóveda {failedAtLevel} de 7</span>
          </div>
          <div className="flex justify-between py-1 pt-2">
            <span>Vidas Restantes:</span>
            <span className="text-rose-500 font-bold">0 / 3 (💔 💔 💔)</span>
          </div>
        </div>

        {/* Botón de reintento */}
        <button
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-rose-950/60 transition transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <RotateCcw className="w-5 h-5" />
          Reintentar Misión con 3 Vidas
        </button>
      </div>
    </div>
  );
}
