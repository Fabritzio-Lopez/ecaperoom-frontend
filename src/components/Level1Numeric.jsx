import React, { useState } from 'react';
import { Lock, Unlock, Key, HelpCircle, CheckCircle2, AlertCircle, ArrowRight, Lightbulb } from 'lucide-react';
import { verifyPuzzle } from '../services/api';

export default function Level1Numeric({ onComplete }) {
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

    const res = await verifyPuzzle(1, answer);
    setLoading(false);

    if (res.success) {
      setUnlocked(true);
      setMessage({ type: 'success', text: res.message });
      setTimeout(() => {
        onComplete();
      }, 2000);
    } else {
      setMessage({ type: 'error', text: res.message || 'Código incorrecto. Inténtalo de nuevo.' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Indicador de Nivel */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
          Fase 1 de 3: Bóveda Cuantitativa
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
        {/* Ícono de Estado del Cerrojo */}
        <div className="flex justify-center mb-6">
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
              unlocked
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400 scale-105 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-950 border-slate-800 text-rose-400'
            }`}
          >
            {unlocked ? <Unlock className="w-10 h-10 animate-bounce" /> : <Lock className="w-10 h-10" />}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-white mb-2">
          Cerrojo Numérico de Crecimiento
        </h2>
        <p className="text-xs md:text-sm text-center text-slate-400 max-w-lg mx-auto mb-6">
          Para restablecer los servidores económicos, debes ingresar el código numérico derivado de la tasa objetivo de la <strong>Meta ODS 8.1</strong> y los <strong>Ejes de Acción Laboral</strong>.
        </p>

        {/* Panel de Acertijo / Enigma */}
        <div className="bg-slate-950/90 rounded-2xl border border-slate-800 p-5 mb-6 text-xs text-slate-300 space-y-3 font-mono">
          <div className="flex items-start gap-2">
            <span className="text-emerald-400 font-bold">▶ PROTOCOLO A:</span>
            <span>Meta 8.1: Crecimiento anual del PIB recomendado para los países menos adelantados (%) = [ X ]</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-cyan-400 font-bold">▶ PROTOCOLO B:</span>
            <span>Ejes Estratégicos de la OIT para el Trabajo Decente = [ Y ]</span>
          </div>
          <div className="pt-2 border-t border-slate-800/80 text-amber-300 font-bold flex items-center justify-between">
            <span>FÓRMULA CRIPTOGRÁFICA:</span>
            <span>CÓDIGO = X × Y</span>
          </div>
        </div>

        {/* Sección de Pistas Desplegables */}
        {showHint && (
          <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 mb-6 text-xs text-amber-200/90 space-y-2 animate-fadeIn">
            <p className="flex items-center gap-1.5 font-bold text-amber-300">
              <HelpCircle className="w-4 h-4" /> Desglose de Pistas:
            </p>
            <p>• La Meta 8.1 estipula mantener un crecimiento del PIB de al menos un <strong>7%</strong> anual.</p>
            <p>• Los ejes de trabajo decente contemplan exactamente <strong>6</strong> pilares (empleo formal, erradicación del trabajo infantil, salud laboral, salarios justos, diálogo y protección social).</p>
            <p className="font-semibold text-amber-300">• Operación: 7 multiplicado por 6.</p>
          </div>
        )}

        {/* Formulario de Entrada */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center">
            <label htmlFor="numpuzzle" className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Ingresa la combinación de 2 dígitos:
            </label>
            <input
              id="numpuzzle"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={answer}
              onChange={(e) => setAnswer(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="00"
              disabled={unlocked || loading}
              className="w-48 text-center text-3xl font-mono font-bold tracking-widest py-3 px-4 bg-slate-950 border-2 border-slate-700 rounded-2xl text-emerald-400 placeholder-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition"
              autoFocus
            />
          </div>

          {/* Mensajes de Retroalimentación */}
          {message && (
            <div
              className={`flex items-start gap-2.5 p-3.5 rounded-xl text-xs font-medium ${
                message.type === 'success'
                  ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                  : 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Botón de Enviar */}
          <button
            type="submit"
            disabled={unlocked || loading || !answer}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg ${
              unlocked
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/40 disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verificando con Servidor...
              </span>
            ) : unlocked ? (
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Desbloqueado. Avanzando...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Key className="w-4 h-4" /> Validar Cerrojo
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
