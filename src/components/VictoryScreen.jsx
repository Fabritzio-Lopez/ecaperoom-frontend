import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, RotateCcw, Clock, Sparkles, AlertCircle, Heart } from 'lucide-react';
import { submitScore } from '../services/api';
import { formatTime } from './Timer';
import LeaderboardTable from './LeaderboardTable';

export default function VictoryScreen({
  playerName,
  totalSeconds,
  answersLog = [],
  livesRemaining = 3,
  onPlayAgain,
  onOpenAdmin,
}) {
  const [submissionStatus, setSubmissionStatus] = useState('pending'); // 'pending' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const hasSubmitted = useRef(false);

  useEffect(() => {
    // 1. Lanzar efecto de confeti de celebración
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#A21942', '#10B981', '#0EA5E9', '#F59E0B'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#A21942', '#10B981', '#0EA5E9', '#F59E0B'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // 2. Registrar el puntaje y respuestas en Supabase
    if (!hasSubmitted.current) {
      hasSubmitted.current = true;
      (async () => {
        try {
          const res = await submitScore(playerName, totalSeconds, answersLog, livesRemaining);
          if (res.success) {
            setSubmissionStatus('success');
          } else {
            setSubmissionStatus('error');
            setErrorMessage(res.message || 'Error al guardar puntaje en la base de datos.');
          }
        } catch (err) {
          setSubmissionStatus('error');
          setErrorMessage('Error de red al enviar el puntaje.');
        }
      })();
    }
  }, [playerName, totalSeconds, answersLog, livesRemaining]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Tarjeta de Celebración y Reconocimiento */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 p-8 md:p-12 shadow-2xl backdrop-blur-xl mb-8 text-center">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            ¡7 Bóvedas Desbloqueadas con Éxito!
          </div>

          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-700 p-1 flex items-center justify-center shadow-2xl shadow-emerald-500/30 mb-6">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <Award className="w-12 h-12 text-emerald-400 animate-pulse" />
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
            ¡Felicitaciones, Agente <span className="text-emerald-400">{playerName}</span>!
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto mb-6">
            Has superado las 7 bóvedas y liberado con éxito el proyecto <strong>"Jóvenes Creadores: Del Negocio Informal al Trabajo Digno" (ODS 8)</strong>.
          </p>

          {/* Estadísticas de la Partida */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md mb-6">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block font-mono">
                  Tiempo Total:
                </span>
                <span className="text-xl font-mono font-bold text-white">
                  {formatTime(totalSeconds)}{' '}
                  <span className="text-xs font-normal text-slate-400">
                    ({totalSeconds}s)
                  </span>
                </span>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/30 text-rose-400">
                <Heart className="w-5 h-5 fill-rose-500" />
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block font-mono">
                  Vidas Conservadas:
                </span>
                <span className="text-sm font-bold text-rose-300">
                  {livesRemaining} de 3 Vidas
                </span>
              </div>
            </div>
          </div>

          {/* Estado de sincronización con Supabase */}
          <div className="mb-6">
            {submissionStatus === 'pending' && (
              <div className="inline-flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800 font-mono">
                <div className="w-3.5 h-3.5 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
                Registrando marca y respuestas en Supabase...
              </div>
            )}
            {submissionStatus === 'success' && (
              <div className="inline-flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/80 px-3 py-1.5 rounded-full border border-emerald-500/40 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ¡Tu marca ha sido guardada en la base de datos de Supabase!
              </div>
            )}
            {submissionStatus === 'error' && (
              <div className="inline-flex items-center gap-2 text-xs text-rose-300 bg-rose-950/80 px-3 py-1.5 rounded-full border border-rose-500/40 font-mono">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                {errorMessage}
              </div>
            )}
          </div>

          {/* Botón de Jugar de Nuevo */}
          <button
            onClick={onPlayAgain}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <RotateCcw className="w-4 h-4" />
            Jugar de Nuevo
          </button>
        </div>
      </div>

      {/* Tabla de Clasificación en Vivo */}
      <LeaderboardTable currentPlayerName={playerName} onOpenAdmin={onOpenAdmin} />
    </div>
  );
}
