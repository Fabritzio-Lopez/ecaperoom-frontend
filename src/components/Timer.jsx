import React from 'react';
import { Timer as TimerIcon } from 'lucide-react';

/**
 * Formatea segundos a formato MM:SS
 */
export function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export default function Timer({ seconds, isRunning }) {
  return (
    <div className="flex items-center space-x-2 bg-slate-900/90 border border-emerald-500/30 px-3.5 py-1.5 rounded-full shadow-lg backdrop-blur">
      <TimerIcon
        className={`w-4 h-4 text-emerald-400 ${
          isRunning ? 'animate-spin' : ''
        }`}
        style={{ animationDuration: '4s' }}
      />
      <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
        Tiempo:
      </span>
      <span className="font-mono text-emerald-400 font-bold text-sm tracking-wider">
        {formatTime(seconds)}
      </span>
    </div>
  );
}
