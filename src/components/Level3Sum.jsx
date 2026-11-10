import React, { useState } from 'react';
import { Lock, Unlock, Key, HelpCircle, CheckCircle2, AlertCircle, Lightbulb, BookOpen, HeartHandshake, Coins, Plus } from 'lucide-react';
import { verifyPuzzle } from '../services/api';

export default function Level3Sum({ onComplete }) {
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setLoading(true);
    setMessage(null);

    const res = await verifyPuzzle(3, answer);
    setLoading(false);

    if (res.success) {
      setUnlocked(true);
      setMessage({ type: 'success', text: res.message });
      setTimeout(() => {
        onComplete();
      }, 2000);
    } else {
      setMessage({ type: 'error', text: res.message || 'Suma incorrecta. Revisa los ODS conectados.' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Indicador de Nivel */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold tracking-widest text-amber-400 uppercase bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-full">
          Fase 3 de 3: Bóveda de Sinergia ODS (Final)
        </span>
        <button
          onClick={() => setShowHint(!showHint)}
          className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1 transition"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          {showHint ? 'Ocultar Pistas' : 'Ver Pistas'}
        </button>
      </div>

      {/* Contenedor Principal */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 md:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Ícono de Estado */}
        <div className="flex justify-center mb-6">
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
              unlocked
                ? 'bg-amber-950/80 border-amber-500 text-amber-400 scale-105 shadow-lg shadow-amber-500/20'
                : 'bg-slate-950 border-slate-800 text-amber-400'
            }`}
          >
            {unlocked ? <Unlock className="w-10 h-10 animate-bounce" /> : <Lock className="w-10 h-10" />}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-white mb-2">
          Cerrojo de Suma: Sinergias de la Agenda 2030
        </h2>
        <p className="text-xs md:text-sm text-center text-slate-400 max-w-xl mx-auto mb-6">
          El <strong>ODS 8 (Trabajo Decente)</strong> no puede alcanzarse de forma aislada. Para abrir la bóveda definitiva, debes sumar los números de los <strong>3 ODS interconectados</strong> esenciales para erradicar la precariedad laboral.
        </p>

        {/* Tarjetas Visuales de los ODS Conectados */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {/* ODS 4 */}
          <div className="bg-slate-950/90 border border-red-900/40 rounded-2xl p-4 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 mb-2">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-white mb-1">ODS 4: Educación de Calidad</div>
            <p className="text-[11px] text-slate-400">
              Formación técnica y vocacional para acceder a empleos dignos.
            </p>
            <div className="mt-3 text-xs font-mono font-bold text-red-400 bg-red-950/60 px-2.5 py-1 rounded-lg border border-red-900/60">
              Valor ODS = 4
            </div>
          </div>

          {/* ODS 5 */}
          <div className="bg-slate-950/90 border border-orange-900/40 rounded-2xl p-4 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-2">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-white mb-1">ODS 5: Igualdad de Género</div>
            <p className="text-[11px] text-slate-400">
              Cierre de la brecha salarial e igualdad de oportunidades de liderazgo.
            </p>
            <div className="mt-3 text-xs font-mono font-bold text-orange-400 bg-orange-950/60 px-2.5 py-1 rounded-lg border border-orange-900/60">
              Valor ODS = 5
            </div>
          </div>

          {/* ODS 1 */}
          <div className="bg-slate-950/90 border border-rose-900/40 rounded-2xl p-4 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-2">
              <Coins className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-white mb-1">ODS 1: Fin de la Pobreza</div>
            <p className="text-[11px] text-slate-400">
              El empleo decente es la principal vía sostenible para superar la pobreza.
            </p>
            <div className="mt-3 text-xs font-mono font-bold text-rose-400 bg-rose-950/60 px-2.5 py-1 rounded-lg border border-rose-900/60">
              Valor ODS = 1
            </div>
          </div>
        </div>

        {/* Ecuación Visual */}
        <div className="bg-slate-950/90 rounded-2xl border border-slate-800 p-4 mb-6 text-center">
          <div className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-1">
            Ecuación de Desbloqueo:
          </div>
          <div className="font-mono text-base md:text-lg text-amber-300 font-bold flex items-center justify-center gap-2">
            <span>ODS [Educación]</span>
            <Plus className="w-4 h-4 text-slate-500" />
            <span>ODS [Género]</span>
            <Plus className="w-4 h-4 text-slate-500" />
            <span>ODS [Pobreza]</span>
            <span className="text-white">=</span>
            <span className="text-emerald-400 font-extrabold">[ ? ]</span>
          </div>
        </div>

        {/* Pistas Desplegables */}
        {showHint && (
          <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 mb-6 text-xs text-amber-200/90 space-y-2 animate-fadeIn">
            <p className="flex items-center gap-1.5 font-bold text-amber-300">
              <HelpCircle className="w-4 h-4" /> Desglose de Pistas:
            </p>
            <p>• Educación de Calidad = ODS 4.</p>
            <p>• Igualdad de Género = ODS 5.</p>
            <p>• Fin de la Pobreza = ODS 1.</p>
            <p className="font-semibold text-amber-300">• Operación: 4 + 5 + 1 = 10.</p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center">
            <label htmlFor="sumpuzzle" className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Ingresa el resultado de la suma:
            </label>
            <input
              id="sumpuzzle"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={answer}
              onChange={(e) => setAnswer(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="00"
              disabled={unlocked || loading}
              className="w-48 text-center text-3xl font-mono font-bold tracking-widest py-3 px-4 bg-slate-950 border-2 border-slate-700 rounded-2xl text-amber-400 placeholder-slate-700 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition"
              autoFocus
            />
          </div>

          {/* Mensajes */}
          {message && (
            <div
              className={`flex items-start gap-2.5 p-3.5 rounded-xl text-xs font-medium ${
                message.type === 'success'
                  ? 'bg-amber-950/80 border border-amber-500/50 text-amber-300'
                  : 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={unlocked || loading || !answer}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg ${
              unlocked
                ? 'bg-amber-600 text-white cursor-default'
                : 'bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white shadow-amber-950/40 disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Desactivando Último Protocolo...
              </span>
            ) : unlocked ? (
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> ¡Bóveda Abierta! Registrando Victoria...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Key className="w-4 h-4" /> Desactivar Cerrojo Final
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
