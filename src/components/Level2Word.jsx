import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Key, CheckCircle2, AlertCircle, FileText, X, Building2, Sparkles } from 'lucide-react';
import { verifyPuzzle } from '../services/api';
import { soundFX } from '../utils/audio';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function Level2Word({ onComplete }) {
  // 8 cilindros del Cryptex mecánico (inicializados aleatoriamente o en A)
  const [cylinders, setCylinders] = useState(['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A']);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showDocument, setShowDocument] = useState(false);
  const [shake, setShake] = useState(false);
  const [cryptexState, setCryptexState] = useState('locked'); // 'locked' | 'aligning' | 'gate_opening'

  // Rotar un cilindro específico arriba o abajo
  const rotateCylinder = (index, delta) => {
    soundFX.playDialClick();
    setCylinders((prev) => {
      const next = [...prev];
      const currentIdx = ALPHABET.indexOf(next[index]);
      const newIdx = (currentIdx + delta + ALPHABET.length) % ALPHABET.length;
      next[index] = ALPHABET[newIdx];
      return next;
    });
  };

  // Permite escribir directamente para girar automáticamente los cilindros
  const handleQuickInput = (e) => {
    const text = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 8);
    const updated = text.padEnd(8, 'A').split('');
    setCylinders(updated);
    soundFX.playDialClick();
  };

  const handleUnlock = async (e) => {
    if (e) e.preventDefault();
    if (cryptexState !== 'locked' || loading) return;

    setLoading(true);
    setMessage(null);

    const word = cylinders.join('');
    const res = await verifyPuzzle(2, word);
    setLoading(false);

    if (res.success) {
      // Secuencia física del Cryptex:
      // 1. Alineación de los pernos mecánicos
      setCryptexState('aligning');
      soundFX.playUnlockClank();

      // 2. Apertura neumática de la compuerta de seguridad
      setTimeout(() => {
        setCryptexState('gate_opening');
        soundFX.playDoorOpen();
        setMessage({ type: 'success', text: res.message });
      }, 1000);

      // 3. Pasar a la siguiente bóveda
      setTimeout(() => {
        onComplete();
      }, 2500);
    } else {
      soundFX.playErrorBuzzer();
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setMessage({
        type: 'error',
        text: res.message || 'Palabra incorrecta. Los pernos del cryptex están trabados.',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 select-none">
      {/* Encabezado y botón de expediente */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping" />
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase bg-cyan-950/70 border border-cyan-500/40 px-3 py-1 rounded-full">
            Bóveda 02 • Cryptex Mecánico
          </span>
        </div>

        <button
          onClick={() => setShowDocument(true)}
          className="text-xs font-bold text-cyan-300 hover:text-cyan-200 bg-cyan-950/60 border border-cyan-500/40 hover:border-cyan-400 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition shadow-lg shadow-cyan-950/40"
        >
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span>Examinar Archivo 8.3</span>
        </button>
      </div>

      {/* Escenario de Bóveda: Compuerta Hidráulica con Cryptex de Bronce */}
      <div className="relative rounded-3xl border-4 border-slate-700 bg-gradient-to-b from-slate-900 via-slate-950 to-neutral-950 p-6 md:p-10 shadow-2xl overflow-hidden min-h-[480px] flex flex-col justify-between">
        
        {/* Rayas de advertencia industrial superiores */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-[repeating-linear-gradient(45deg,#06b6d4,#06b6d4_10px,#000_10px,#000_20px)] opacity-50" />

        {/* Efecto de luz al abrirse la compuerta */}
        {cryptexState === 'gate_opening' && (
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/30 via-teal-400/40 to-cyan-500/30 animate-pulse pointer-events-none z-20" />
        )}

        {/* Título de la Bóveda */}
        <div className="text-center relative z-10">
          <h2 className="text-xl md:text-2xl font-black text-white tracking-wide uppercase">
            Cryptex de Actores Productivos
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Gira los 8 tambores cilíndricos para alinear la palabra clave en la línea central.
          </p>
        </div>

        {/* CÁMARA CENTRAL: DISPOSITIVO CRYPTEX */}
        <div className="my-6 flex flex-col items-center justify-center relative">
          
          {/* Tubo de soporte del Cryptex */}
          <div
            className={`w-full max-w-2xl bg-gradient-to-r from-amber-950 via-yellow-900 to-amber-950 border-4 border-amber-600/80 rounded-3xl p-4 md:p-6 shadow-2xl relative transition-all duration-700 ${
              shake ? 'animate-bounce' : ''
            } ${
              cryptexState === 'gate_opening'
                ? '-translate-y-40 opacity-0 scale-90'
                : 'translate-y-0 opacity-100'
            }`}
          >
            {/* Grabados decorativos del Cryptex */}
            <div className="flex items-center justify-between text-[10px] font-mono text-amber-300 font-bold mb-3 border-b border-amber-700/60 pb-1.5">
              <span>MECANISMO CRYPTEX 8-PIN</span>
              <span className="flex items-center gap-1 text-cyan-300">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                LÍNEA CENTRAL ACTIVA
              </span>
            </div>

            {/* Línea de alineación central dorada */}
            <div className="absolute left-2 right-2 top-1/2 h-[2px] bg-cyan-400/60 shadow-[0_0_8px_rgba(6,182,212,0.8)] pointer-events-none z-20" />

            {/* Los 8 Cilindros Giratorios */}
            <div className="grid grid-cols-8 gap-1 md:gap-2 relative z-10">
              {cylinders.map((letter, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  {/* Botón Girar Arriba */}
                  <button
                    type="button"
                    onClick={() => rotateCylinder(idx, -1)}
                    disabled={cryptexState !== 'locked'}
                    className="p-1 rounded bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white transition active:scale-90 disabled:opacity-30 mb-1"
                  >
                    <ChevronUp className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>

                  {/* Tambor cilíndrico de letra */}
                  <div
                    className={`w-full h-14 md:h-16 rounded-xl flex items-center justify-center font-mono font-black text-xl md:text-2xl border-2 transition-all shadow-inner relative overflow-hidden ${
                      cryptexState === 'aligning' || cryptexState === 'gate_opening'
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                        : 'bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 border-amber-500/70 text-amber-200'
                    }`}
                  >
                    {/* Ranuras metálicas superior e inferior */}
                    <div className="absolute inset-x-0 top-0 h-2 bg-black/50" />
                    <div className="absolute inset-x-0 bottom-0 h-2 bg-black/50" />
                    <span className="drop-shadow-md">{letter}</span>
                  </div>

                  {/* Botón Girar Abajo */}
                  <button
                    type="button"
                    onClick={() => rotateCylinder(idx, 1)}
                    disabled={cryptexState !== 'locked'}
                    className="p-1 rounded bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white transition active:scale-90 disabled:opacity-30 mt-1"
                  >
                    <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Entrada rápida por teclado */}
            <div className="mt-4 pt-3 border-t border-amber-800/60 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="text-[11px] text-amber-200/80 font-mono">
                Atajo de teclado:
              </span>
              <input
                type="text"
                maxLength={8}
                onChange={handleQuickInput}
                placeholder="Escribe aquí para girar rápido..."
                disabled={cryptexState !== 'locked'}
                className="w-full sm:w-64 bg-slate-950/90 border border-amber-600/60 rounded-xl px-3 py-1.5 text-xs text-center text-cyan-300 font-mono uppercase tracking-widest placeholder-slate-600 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Botón Principal para Destrabar el Cryptex */}
          {cryptexState === 'locked' && (
            <button
              type="button"
              onClick={handleUnlock}
              disabled={loading}
              className="mt-6 px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-cyan-950/40 transition active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Key className="w-4 h-4" />
              )}
              <span>Desbloquear Cryptex</span>
            </button>
          )}

          {/* Animación de Compuerta Abriéndose */}
          {cryptexState === 'gate_opening' && (
            <div className="text-center z-30 py-4 animate-fadeIn">
              <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 mb-2 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-cyan-300">
                ¡COMPUERTA PRODUCTIVA LEVANTADA!
              </h3>
              <p className="text-xs text-slate-300 font-mono">
                Pernos desbloqueados. Avanzando a la Sala de Sinergia Energética...
              </p>
            </div>
          )}
        </div>

        {/* Mensaje de retroalimentación */}
        {message && cryptexState !== 'gate_opening' && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 max-w-md mx-auto ${
              message.type === 'success'
                ? 'bg-cyan-950/80 border border-cyan-500/50 text-cyan-300'
                : 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}
      </div>

      {/* MODAL: Expediente ODS 8.3 */}
      {showDocument && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border-2 border-cyan-500/50 rounded-3xl p-6 shadow-2xl relative animate-scaleIn text-left">
            <button
              onClick={() => setShowDocument(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-white text-base">
                Archivo 8.3: El Motor Productivo
              </h3>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 space-y-3">
              <p className="text-cyan-300">
                📌 <strong>INFORME DE COALICIÓN LABORAL:</strong>
              </p>
              <p>
                "Representan más del 90% del tejido productivo y generan más de 7 de cada 10 puestos de trabajo formales en el mundo."
              </p>
              <ul className="list-disc pl-4 space-y-1.5 text-slate-400">
                <li>Palabra en <strong>plural de 8 letras</strong>.</li>
                <li>Comienza con <strong className="text-white">E</strong> y termina con <strong className="text-white">S</strong>.</li>
                <li>Incluye micro, pequeñas, medianas y grandes entidades de comercio e innovación.</li>
              </ul>
              <div className="pt-2 border-t border-slate-800 text-cyan-300 font-bold text-center">
                PATRÓN: [ E - M - P - R - E - S - A - S ]
              </div>
            </div>

            <button
              onClick={() => setShowDocument(false)}
              className="w-full mt-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition"
            >
              Cerrar y Volver al Cryptex
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
