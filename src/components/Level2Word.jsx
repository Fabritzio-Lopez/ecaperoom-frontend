import React, { useState } from 'react';
import { Lock, Unlock, Key, HelpCircle, CheckCircle2, AlertCircle, Lightbulb, Building2 } from 'lucide-react';
import { verifyPuzzle } from '../services/api';

export default function Level2Word({ onComplete }) {
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

    const res = await verifyPuzzle(2, answer);
    setLoading(false);

    if (res.success) {
      setUnlocked(true);
      setMessage({ type: 'success', text: res.message });
      setTimeout(() => {
        onComplete();
      }, 2000);
    } else {
      setMessage({ type: 'error', text: res.message || 'Palabra incorrecta. Revisa las pistas.' });
    }
  };

  // Renderiza cajitas para las 8 letras
  const targetLength = 8;
  const currentChars = answer.toUpperCase().padEnd(targetLength, ' ').slice(0, targetLength).split('');

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Indicador de Nivel */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-full">
          Fase 2 de 3: Bóveda de Actores Clave
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
                ? 'bg-cyan-950/80 border-cyan-500 text-cyan-400 scale-105 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-950 border-slate-800 text-cyan-400'
            }`}
          >
            {unlocked ? <Unlock className="w-10 h-10 animate-bounce" /> : <Building2 className="w-10 h-10" />}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-white mb-2">
          Cerrojo de Palabra: El Ecosistema Productivo
        </h2>
        <p className="text-xs md:text-sm text-center text-slate-400 max-w-lg mx-auto mb-6">
          Para restablecer las cadenas de valor laborales, descifra el sustantivo plural de <strong>8 letras</strong> que designa al sector que crea más de 7 de cada 10 empleos formales en el mundo.
        </p>

        {/* Visualizador de Ranuras de Letras */}
        <div className="flex justify-center gap-1.5 md:gap-2 mb-6">
          {currentChars.map((char, idx) => (
            <div
              key={idx}
              className={`w-9 h-12 md:w-12 md:h-14 rounded-xl flex items-center justify-center font-mono font-bold text-lg md:text-xl border-2 transition-all ${
                char !== ' '
                  ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 shadow-md shadow-cyan-500/20'
                  : 'border-slate-800 bg-slate-950 text-slate-600'
              }`}
            >
              {char !== ' ' ? char : '•'}
            </div>
          ))}
        </div>

        {/* Enigma / Protocolo */}
        <div className="bg-slate-950/90 rounded-2xl border border-slate-800 p-5 mb-6 text-xs text-slate-300 space-y-2 font-mono">
          <div className="text-cyan-400 font-bold">▶ ARCHIVO CONFIDENCIAL ODS 8.3:</div>
          <p className="text-slate-400">
            "Organizaciones socioeconómicas con personería jurídica o física dedicadas a la producción, comercio y prestación de servicios. Incluyen micro, pequeñas, medianas y grandes..."
          </p>
        </div>

        {/* Pistas Desplegables */}
        {showHint && (
          <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 mb-6 text-xs text-amber-200/90 space-y-2 animate-fadeIn">
            <p className="flex items-center gap-1.5 font-bold text-amber-300">
              <HelpCircle className="w-4 h-4" /> Desglose de Pistas:
            </p>
            <p>• Comienza con la letra <strong>E</strong> y termina con la letra <strong>S</strong>.</p>
            <p>• En singular es "Empresa", en plural son las entidades que dinamizan la economía.</p>
            <p className="font-semibold text-amber-300">• Respuesta: E-M-P-R-E-S-A-S</p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center">
            <label htmlFor="wordpuzzle" className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Ingresa la palabra clave:
            </label>
            <input
              id="wordpuzzle"
              type="text"
              maxLength={8}
              value={answer}
              onChange={(e) => setAnswer(e.target.value.toUpperCase())}
              placeholder="E M P R E S A S"
              disabled={unlocked || loading}
              className="w-full max-w-sm text-center text-lg md:text-xl font-mono font-bold tracking-widest py-3 px-4 bg-slate-950 border-2 border-slate-700 rounded-2xl text-cyan-300 placeholder-slate-700 focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 uppercase transition"
              autoFocus
            />
          </div>

          {/* Mensajes */}
          {message && (
            <div
              className={`flex items-start gap-2.5 p-3.5 rounded-xl text-xs font-medium ${
                message.type === 'success'
                  ? 'bg-cyan-950/80 border border-cyan-500/50 text-cyan-300'
                  : 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
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
                ? 'bg-cyan-600 text-white cursor-default'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-950/40 disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Validando Palabra Clave...
              </span>
            ) : unlocked ? (
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Desbloqueado. Avanzando a la Fase Final...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Key className="w-4 h-4" /> Abrir Cerrojo
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
