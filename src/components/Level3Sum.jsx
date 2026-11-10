import React, { useState } from 'react';
import { Zap, Key, CheckCircle2, AlertCircle, FileText, X, BookOpen, HeartHandshake, Coins, Sliders, Sparkles } from 'lucide-react';
import { verifyPuzzle } from '../services/api';
import { soundFX } from '../utils/audio';

export default function Level3Sum({ onComplete }) {
  // Nivel de energía calibrado (0 a 20)
  const [energyLevel, setEnergyLevel] = useState(0);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showDocument, setShowDocument] = useState(false);
  const [shake, setShake] = useState(false);
  const [consoleState, setConsoleState] = useState('standby'); // 'standby' | 'surging' | 'doors_opening'

  const adjustEnergy = (delta) => {
    soundFX.playDialClick();
    setEnergyLevel((prev) => Math.max(0, Math.min(25, prev + delta)));
  };

  const handleEnergize = async (e) => {
    if (e) e.preventDefault();
    if (consoleState !== 'standby' || loading) return;

    setLoading(true);
    setMessage(null);

    const res = await verifyPuzzle(3, energyLevel.toString());
    setLoading(false);

    if (res.success) {
      // Secuencia física cinematográfica del Reactor:
      // 1. Sobrecarga de energía del reactor
      setConsoleState('surging');
      soundFX.playEnergyCharge();

      // 2. Apertura de las compuertas blindadas de la bóveda final
      setTimeout(() => {
        setConsoleState('doors_opening');
        soundFX.playDoorOpen();
        setMessage({ type: 'success', text: res.message });
      }, 1200);

      // 3. Pasar a la Pantalla de Victoria
      setTimeout(() => {
        onComplete();
      }, 2600);
    } else {
      soundFX.playErrorBuzzer();
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setMessage({
        type: 'error',
        text: res.message || 'Cálculo de energía incorrecto. El reactor no tiene la potencia requerida.',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 select-none">
      {/* Encabezado y botón de expediente */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
          <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase bg-amber-950/70 border border-amber-500/40 px-3 py-1 rounded-full">
            Bóveda 03 • Reactor de Sinergia (Final)
          </span>
        </div>

        <button
          onClick={() => setShowDocument(true)}
          className="text-xs font-bold text-amber-300 hover:text-amber-200 bg-amber-950/60 border border-amber-500/40 hover:border-amber-400 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition shadow-lg shadow-amber-950/40"
        >
          <FileText className="w-3.5 h-3.5 text-amber-400" />
          <span>Examinar Matriz de Sinergia</span>
        </button>
      </div>

      {/* Escenario de Bóveda: Consola del Reactor Energético */}
      <div className="relative rounded-3xl border-4 border-slate-700 bg-gradient-to-b from-slate-900 via-slate-950 to-neutral-950 p-6 md:p-8 shadow-2xl overflow-hidden min-h-[480px] flex flex-col justify-between">
        
        {/* Rayas de advertencia industrial superiores */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-[repeating-linear-gradient(45deg,#f59e0b,#f59e0b_10px,#000_10px,#000_20px)] opacity-50" />

        {/* Efecto de luz al sobrecargarse el reactor */}
        {consoleState === 'surging' && (
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/40 via-yellow-400/50 to-amber-500/40 animate-pulse pointer-events-none z-20" />
        )}
        {consoleState === 'doors_opening' && (
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/40 via-teal-400/50 to-emerald-500/40 animate-pulse pointer-events-none z-20" />
        )}

        {/* Título de la Bóveda */}
        <div className="text-center relative z-10">
          <h2 className="text-xl md:text-2xl font-black text-white tracking-wide uppercase flex items-center justify-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Consola de Sinergia Energética
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Calibra la salida total inyectando la suma exacta de los 3 ODS interdependientes.
          </p>
        </div>

        {/* 3 CÉLULAS DE ENERGÍA DE LOS ODS CONECTADOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4 relative z-10">
          
          {/* Célula ODS 4 */}
          <div className="bg-slate-950/80 border-2 border-red-500/40 rounded-2xl p-3 flex flex-col items-center text-center shadow-lg relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-red-500/60" />
            <div className="w-8 h-8 rounded-xl bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400 mb-1.5">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="text-[11px] font-bold text-white">ODS 4: Educación</div>
            <div className="mt-2 text-xs font-mono font-black text-red-400 bg-red-950/90 px-3 py-0.5 rounded-full border border-red-500/40">
              VALOR: 4 MW
            </div>
          </div>

          {/* Célula ODS 5 */}
          <div className="bg-slate-950/80 border-2 border-orange-500/40 rounded-2xl p-3 flex flex-col items-center text-center shadow-lg relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-orange-500/60" />
            <div className="w-8 h-8 rounded-xl bg-orange-950/80 border border-orange-500/40 flex items-center justify-center text-orange-400 mb-1.5">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div className="text-[11px] font-bold text-white">ODS 5: Igualdad de Género</div>
            <div className="mt-2 text-xs font-mono font-black text-orange-400 bg-orange-950/90 px-3 py-0.5 rounded-full border border-orange-500/40">
              VALOR: 5 MW
            </div>
          </div>

          {/* Célula ODS 1 */}
          <div className="bg-slate-950/80 border-2 border-rose-500/40 rounded-2xl p-3 flex flex-col items-center text-center shadow-lg relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-rose-500/60" />
            <div className="w-8 h-8 rounded-xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-1.5">
              <Coins className="w-4 h-4" />
            </div>
            <div className="text-[11px] font-bold text-white">ODS 1: Fin de la Pobreza</div>
            <div className="mt-2 text-xs font-mono font-black text-rose-400 bg-rose-950/90 px-3 py-0.5 rounded-full border border-rose-500/40">
              VALOR: 1 MW
            </div>
          </div>
        </div>

        {/* REGULADOR FÍSICO DE ENERGÍA (DIAL / PALANCA) */}
        <div
          className={`bg-slate-950/90 border-2 border-amber-600/70 rounded-2xl p-5 max-w-lg mx-auto w-full relative z-10 transition-all ${
            shake ? 'animate-bounce' : ''
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-mono text-amber-400 font-bold mb-2">
            <span>POTENCIA CALIBRADA:</span>
            <span>SUMA TOTAL: [ {energyLevel} MW ]</span>
          </div>

          {/* Medidor Digital LED Gigante */}
          <div className="bg-neutral-950 rounded-xl border border-amber-950 p-3 mb-4 flex items-center justify-between shadow-inner">
            <button
              type="button"
              onClick={() => adjustEnergy(-1)}
              disabled={consoleState !== 'standby' || energyLevel <= 0}
              className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-lg active:scale-90 disabled:opacity-30"
            >
              -
            </button>

            <div className="flex items-baseline gap-1">
              <span className="font-mono font-black text-4xl text-amber-400 tracking-wider">
                {energyLevel.toString().padStart(2, '0')}
              </span>
              <span className="text-xs font-mono text-amber-200/80">MW</span>
            </div>

            <button
              type="button"
              onClick={() => adjustEnergy(1)}
              disabled={consoleState !== 'standby'}
              className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-lg active:scale-90 disabled:opacity-30"
            >
              +
            </button>
          </div>

          {/* Deslizador Táctil */}
          <input
            type="range"
            min={0}
            max={20}
            value={energyLevel}
            onChange={(e) => {
              setEnergyLevel(Number(e.target.value));
              soundFX.playDialClick();
            }}
            disabled={consoleState !== 'standby'}
            className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />

          {/* PALANCA DE DESCARGA DE ENERGÍA */}
          <button
            type="button"
            onClick={handleEnergize}
            disabled={consoleState !== 'standby' || loading}
            className="w-full mt-4 py-3 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-amber-950/40 transition active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Zap className="w-4 h-4 fill-white" />
            )}
            <span>ACCIONAR DESCARGA AL NÚCLEO</span>
          </button>
        </div>

        {/* Puertas Blindadas Abriéndose */}
        {consoleState === 'doors_opening' && (
          <div className="text-center z-30 py-4 animate-fadeIn">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mb-2 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-emerald-300">
              ¡REACTORES AL 100%! BÓVEDA FINAL ABIERTA
            </h3>
            <p className="text-xs text-slate-300 font-mono">
              Las compuertas maestras se han abierto. Registrando victoria...
            </p>
          </div>
        )}

        {/* Mensaje de retroalimentación */}
        {message && consoleState !== 'doors_opening' && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 max-w-md mx-auto mt-3 ${
              message.type === 'success'
                ? 'bg-amber-950/80 border border-amber-500/50 text-amber-300'
                : 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}
      </div>

      {/* MODAL: Matriz de Sinergia */}
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
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-base">
                Matriz de Sinergia: Agenda 2030
              </h3>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 space-y-3">
              <p className="text-amber-300">
                📌 <strong>FÓRMULA DE LIBERACIÓN:</strong>
              </p>
              <p>
                "Para alcanzar el <strong>ODS 8 (Trabajo Decente)</strong>, el sistema requiere la energía combinada de sus 3 objetivos interdependientes:"
              </p>
              <ul className="list-disc pl-4 space-y-1.5 text-slate-400">
                <li>Educación de Calidad = <strong>ODS 4</strong></li>
                <li>Igualdad de Género = <strong>ODS 5</strong></li>
                <li>Fin de la Pobreza = <strong>ODS 1</strong></li>
              </ul>
              <div className="pt-2 border-t border-slate-800 text-amber-300 font-bold text-center">
                SUMA = 4 + 5 + 1 = [ 10 MW ]
              </div>
            </div>

            <button
              onClick={() => setShowDocument(false)}
              className="w-full mt-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition"
            >
              Cerrar y Calibrar Reactor
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
