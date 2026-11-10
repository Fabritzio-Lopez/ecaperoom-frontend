import React, { useState } from 'react';
import { Play, TrendingUp, Users, Target, Sparkles, Trophy, ShieldCheck, Heart, Lock } from 'lucide-react';
import LeaderboardTable from './LeaderboardTable';

export default function WelcomeScreen({ onStartGame, onOpenAdmin }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Por favor, ingresa tu nombre o alias de agente.');
      return;
    }
    if (trimmed.length < 2) {
      setError('El nombre debe tener al menos 2 caracteres.');
      return;
    }
    setError('');
    onStartGame(trimmed);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Tarjeta de Encabezado Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-8 md:p-12 shadow-2xl backdrop-blur-xl mb-8">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            Proyecto "Jóvenes Creadores" • ODS 8
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-2xl mb-4">
            Misión Bóveda: <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-400">
              Del Negocio Informal al Trabajo Digno
            </span>
          </h1>

          <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed mb-4">
            El Sistema de Formalización Laboral se encuentra bajo un bloqueo de seguridad. Debes superar <strong>7 Bóvedas de Seguridad</strong> para liberar los protocolos de empleo decente y crecimiento sostenible.
          </p>

          {/* Advertencia de las 3 Vidas */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-rose-500/40 text-xs font-mono text-rose-300 mb-8 shadow-inner">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>Regla de Supervivencia: Tienes exactamente <strong>3 VIDAS</strong>. A la 3ª equivocación, el sistema se bloquea.</span>
          </div>

          {/* Formulario de Registro */}
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl"
          >
            <label
              htmlFor="playerName"
              className="block text-left text-xs font-bold text-slate-300 uppercase tracking-wider mb-2"
            >
              Identificación del Agente:
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="playerName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Alex Economista, Val2030..."
                maxLength={30}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                autoFocus
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Play className="w-4 h-4 fill-white" />
                Iniciar
              </button>
            </div>
            {error && (
              <p className="text-rose-400 text-xs text-left mt-2 font-medium">
                {error}
              </p>
            )}
            <p className="text-[11px] text-slate-500 text-left mt-3">
              ⏱️ El cronómetro comenzará inmediatamente al pulsar Iniciar.
            </p>
          </form>
        </div>
      </div>

      {/* SECCIÓN LEADERBOARD: Agentes que ya respondieron y superaron el Escape Room */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-base md:text-lg font-bold text-white tracking-wide">
              Salón de la Fama: Agentes que ya Escaparon
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              ● En Vivo con Supabase
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-400 mb-4 px-1">
          Tiempos oficiales registrados en la base de datos. Solo el Administrador puede depurar o gestionar los registros.
        </p>
        <LeaderboardTable onOpenAdmin={onOpenAdmin} />
      </div>

      {/* Grid de 3 Fases del Escape Room (Actualizado a las 7 Bóvedas) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur hover:border-slate-700 transition">
          <div className="w-12 h-12 rounded-xl bg-rose-950/80 border border-rose-500/30 flex items-center justify-center mb-4 text-rose-400">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">
            Bóvedas 1 a 3: Fundamentos ODS 8
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Descifra los pilares clave del trabajo decente, los derechos de los trabajadores y la igualdad de oportunidades mediante terminales de opción múltiple.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur hover:border-slate-700 transition">
          <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">
            Bóvedas 4 y 5: Verdadero o Falso
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Evalúa la Meta 8.5 de la Agenda 2030 y el impacto del desempleo juvenil a través de dos botones tácticos. ¡Un solo error te costará una vida!
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur hover:border-slate-700 transition">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center mb-4 text-cyan-400">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">
            Bóvedas 6 y 7: Jóvenes Creadores
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Identifica el proyecto del grupo y la realidad de informalidad laboral según estadísticas oficiales de la OIT para abrir la cámara de victoria final.
          </p>
        </div>
      </div>

      {/* Botón de Acceso al Panel de Administrador */}
      <div className="text-center pt-2">
        <button
          onClick={onOpenAdmin}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-slate-400 hover:text-amber-400 text-xs font-mono transition shadow-lg"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Acceso Exclusivo • Panel de Administrador</span>
        </button>
      </div>
    </div>
  );
}
