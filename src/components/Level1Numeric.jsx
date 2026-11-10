import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Key, HelpCircle, CheckCircle2, AlertCircle, FileText, X } from 'lucide-react';
import { verifyPuzzle } from '../services/api';
import { soundFX } from '../utils/audio';

export default function Level1Numeric({ onComplete }) {
  // Ruedas mecánicas de 2 dígitos (0-9)
  const [digit1, setDigit1] = useState(0);
  const [digit2, setDigit2] = useState(0);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showDocument, setShowDocument] = useState(false);
  const [shake, setShake] = useState(false);

  // Estados de animación física del candado y la puerta
  const [lockState, setLockState] = useState('locked'); // 'locked' | 'unshackled' | 'falling' | 'door_opening'

  const changeDigit = (wheelIndex, delta) => {
    soundFX.playDialClick();
    if (wheelIndex === 1) {
      setDigit1((prev) => (prev + delta + 10) % 10);
    } else {
      setDigit2((prev) => (prev + delta + 10) % 10);
    }
  };

  const handleUnlock = async (e) => {
    if (e) e.preventDefault();
    if (lockState !== 'locked' || loading) return;

    setLoading(true);
    setMessage(null);

    const combination = `${digit1}${digit2}`;
    const res = await verifyPuzzle(1, combination);
    setLoading(false);

    if (res.success) {
      // Secuencia física cinematográfica del Escape Room:
      // 1. Destrabe del grillete metálico
      setLockState('unshackled');
      soundFX.playUnlockClank();

      // 2. Caída del candado fuera de la puerta
      setTimeout(() => {
        setLockState('falling');
        soundFX.playLockDrop();
      }, 600);

      // 3. Apertura hidráulica de la puerta blindada
      setTimeout(() => {
        setLockState('door_opening');
        soundFX.playDoorOpen();
        setMessage({ type: 'success', text: res.message });
      }, 1300);

      // 4. Transición a la siguiente cámara
      setTimeout(() => {
        onComplete();
      }, 2600);
    } else {
      soundFX.playErrorBuzzer();
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setMessage({
        type: 'error',
        text: res.message || 'Combinación incorrecta. El candado sigue atrancado.',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 select-none">
      {/* Encabezado y botón de documento clasificado */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <span className="text-xs font-mono font-bold tracking-widest text-rose-400 uppercase bg-rose-950/70 border border-rose-500/40 px-3 py-1 rounded-full">
            Bóveda 01 • Cerrojo Físico
          </span>
        </div>

        <button
          onClick={() => setShowDocument(true)}
          className="text-xs font-bold text-amber-300 hover:text-amber-200 bg-amber-950/60 border border-amber-500/40 hover:border-amber-400 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition shadow-lg shadow-amber-950/40"
        >
          <FileText className="w-3.5 h-3.5 text-amber-400" />
          <span>Examinar Expediente ODS 8</span>
        </button>
      </div>

      {/* Marco de la Puerta Blindada / Escenario de Escape Room */}
      <div className="relative rounded-3xl border-4 border-slate-700 bg-gradient-to-b from-slate-900 via-slate-950 to-neutral-950 p-6 md:p-10 shadow-2xl overflow-hidden min-h-[460px] flex flex-col justify-between">
        
        {/* Rayas de advertencia industrial superiores */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-[repeating-linear-gradient(45deg,#eab308,#eab308_10px,#000_10px,#000_20px)] opacity-60" />

        {/* Remaches decorativos en las 4 esquinas */}
        <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-slate-600 border border-slate-400 shadow-inner" />
        <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-slate-600 border border-slate-400 shadow-inner" />
        <div className="absolute bottom-4 left-4 w-3 h-3 rounded-full bg-slate-600 border border-slate-400 shadow-inner" />
        <div className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-slate-600 border border-slate-400 shadow-inner" />

        {/* Efecto de luz cuando la puerta se abre */}
        {lockState === 'door_opening' && (
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 via-teal-400/50 to-emerald-500/30 animate-pulse pointer-events-none z-20" />
        )}

        {/* Panel Superior: Título de la Bóveda */}
        <div className="text-center relative z-10">
          <h2 className="text-xl md:text-2xl font-black text-white tracking-wide uppercase">
            Bóveda de Crecimiento Económico
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Gira las ruedas mecánicas del candado para alinear los engranajes internos.
          </p>
        </div>

        {/* Escenario Central: Cerrojo, Aldaba y Candado Físico */}
        <div className="relative my-6 flex flex-col items-center justify-center">
          
          {/* Aldaba de acero en la puerta (Hasp / Staple) */}
          <div className="w-24 h-5 bg-gradient-to-r from-zinc-600 via-zinc-400 to-zinc-700 rounded-md border border-zinc-500 shadow-lg relative z-0 mb-[-12px]">
            <div className="absolute left-3 top-1 w-2 h-2 rounded-full bg-zinc-800" />
            <div className="absolute right-3 top-1 w-2 h-2 rounded-full bg-zinc-800" />
            <div className="w-6 h-6 mx-auto rounded-full border-4 border-zinc-400 bg-zinc-950 mt-1" />
          </div>

          {/* CANDADO FÍSICO INTERACTIVO */}
          <div
            className={`relative z-10 transition-all duration-700 ease-in-out ${
              shake ? 'animate-bounce' : ''
            } ${
              lockState === 'falling' || lockState === 'door_opening'
                ? 'translate-y-96 rotate-45 opacity-0 scale-75 pointer-events-none'
                : 'translate-y-0 rotate-0 opacity-100'
            }`}
          >
            {/* Grillete metálico (Shackle) */}
            <div className="relative w-28 h-20 mx-auto">
              <div
                className={`w-24 h-20 mx-auto rounded-t-full border-[10px] border-slate-300 bg-transparent transition-all duration-300 shadow-md ${
                  lockState === 'unshackled'
                    ? '-translate-y-4 -rotate-6'
                    : 'translate-y-0'
                }`}
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 100% 85%, 70% 85%, 70% 30%, 30% 30%, 30% 85%, 0 85%)',
                  filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.6))',
                }}
              />
            </div>

            {/* Cuerpo de latón/acero del candado */}
            <div className="w-56 bg-gradient-to-b from-amber-600 via-amber-700 to-amber-900 border-2 border-amber-400/80 rounded-3xl p-4 shadow-2xl relative">
              {/* Reflejo metálico superior */}
              <div className="absolute top-1 left-6 right-6 h-1 bg-amber-300/40 rounded-full" />

              {/* Logo / Emblema ODS 8 en el candado */}
              <div className="flex items-center justify-between px-2 mb-3">
                <span className="text-[10px] font-mono font-bold text-amber-200 tracking-wider">
                  ODS-8 LOCK
                </span>
                <span className="text-[9px] bg-amber-950/80 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/40 font-mono">
                  SERIE 2030
                </span>
              </div>

              {/* RUEDAS MECÁNICAS DE COMBINACIÓN */}
              <div className="flex justify-center gap-4 bg-neutral-950/90 p-3 rounded-2xl border border-amber-950 shadow-inner">
                
                {/* Rueda 1 (Decenas) */}
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => changeDigit(1, 1)}
                    disabled={lockState !== 'locked'}
                    className="p-1 rounded bg-slate-800 hover:bg-amber-600 text-slate-300 hover:text-white transition active:scale-95 disabled:opacity-30"
                  >
                    <ChevronUp className="w-5 h-5" />
                  </button>

                  <div className="w-14 h-16 my-1 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-2 border-slate-700 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-3 bg-black/40" />
                    <div className="absolute inset-x-0 bottom-0 h-3 bg-black/40" />
                    <span className="font-mono font-black text-3xl text-amber-400 drop-shadow">
                      {digit1}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => changeDigit(1, -1)}
                    disabled={lockState !== 'locked'}
                    className="p-1 rounded bg-slate-800 hover:bg-amber-600 text-slate-300 hover:text-white transition active:scale-95 disabled:opacity-30"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>

                {/* Separador de eje */}
                <div className="w-[2px] bg-slate-800 self-stretch my-2" />

                {/* Rueda 2 (Unidades) */}
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => changeDigit(2, 1)}
                    disabled={lockState !== 'locked'}
                    className="p-1 rounded bg-slate-800 hover:bg-amber-600 text-slate-300 hover:text-white transition active:scale-95 disabled:opacity-30"
                  >
                    <ChevronUp className="w-5 h-5" />
                  </button>

                  <div className="w-14 h-16 my-1 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-2 border-slate-700 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-3 bg-black/40" />
                    <div className="absolute inset-x-0 bottom-0 h-3 bg-black/40" />
                    <span className="font-mono font-black text-3xl text-amber-400 drop-shadow">
                      {digit2}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => changeDigit(2, -1)}
                    disabled={lockState !== 'locked'}
                    className="p-1 rounded bg-slate-800 hover:bg-amber-600 text-slate-300 hover:text-white transition active:scale-95 disabled:opacity-30"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>

              </div>

              {/* Botón de destrabar dentro del candado */}
              <button
                type="button"
                onClick={handleUnlock}
                disabled={lockState !== 'locked' || loading}
                className="w-full mt-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-950/40 transition active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Key className="w-3.5 h-3.5" />
                )}
                <span>Probar Combinación</span>
              </button>
            </div>
          </div>

          {/* Puerta Abriéndose (Animación de éxito) */}
          {lockState === 'door_opening' && (
            <div className="text-center z-30 py-4 animate-fadeIn">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mb-2 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-emerald-300">
                ¡BÓVEDA DESBLOQUEADA!
              </h3>
              <p className="text-xs text-slate-300 font-mono">
                El candado cayó. Las compuertas blindadas se están abriendo...
              </p>
            </div>
          )}
        </div>

        {/* Mensaje de retroalimentación inferior */}
        {message && lockState !== 'door_opening' && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 max-w-md mx-auto ${
              message.type === 'success'
                ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}
      </div>

      {/* MODAL: Expediente ODS 8 (Pistas temáticas del Escape Room) */}
      {showDocument && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl relative animate-scaleIn text-left">
            <button
              onClick={() => setShowDocument(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-base">
                Expediente Clasificado: Meta 8.1
              </h3>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 space-y-3">
              <p className="text-amber-300">
                📌 <strong>NOTA DE INTELIGENCIA:</strong>
              </p>
              <p>
                "Para romper el cerrojo de la bóveda, el operador debe multiplicar dos constantes clave del desarrollo sostenible:"
              </p>
              <ul className="list-disc pl-4 space-y-1.5 text-slate-400">
                <li>
                  <strong>Tasa ODS 8.1:</strong> Crecimiento del PIB de al menos un <strong className="text-emerald-400">7%</strong> anual en los países menos adelantados.
                </li>
                <li>
                  <strong>Ejes de Trabajo Decente (OIT):</strong> Exactamente <strong className="text-cyan-400">6</strong> pilares fundamentales.
                </li>
              </ul>
              <div className="pt-2 border-t border-slate-800 text-amber-300 font-bold text-center">
                CÓDIGO = 7 × 6 = [ ? ]
              </div>
            </div>

            <button
              onClick={() => setShowDocument(false)}
              className="w-full mt-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition"
            >
              Cerrar y Volver al Candado
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
