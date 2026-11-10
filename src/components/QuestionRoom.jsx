import React, { useState } from 'react';
import { Lock, Unlock, Key, FileText, CheckCircle2, AlertCircle, X, Check, HelpCircle, Heart, Sparkles } from 'lucide-react';
import { verifyPuzzle } from '../services/api';
import { soundFX } from '../utils/audio';

export default function QuestionRoom({
  questionData,
  currentLevel,
  totalLevels,
  lives,
  onCorrectAnswer,
  onWrongAnswer,
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [shake, setShake] = useState(false);
  const [roomState, setRoomState] = useState('locked'); // 'locked' | 'unlocked'

  const handleSelectAnswer = async (answerKey) => {
    if (loading || roomState === 'unlocked') return;

    soundFX.playDialClick();
    setSelectedOption(answerKey);
    setLoading(true);
    setFeedback(null);

    const res = await verifyPuzzle(currentLevel, answerKey);
    setLoading(false);

    if (res.success) {
      setRoomState('unlocked');
      soundFX.playUnlockClank();
      setFeedback({ type: 'success', text: res.message });

      setTimeout(() => {
        setRoomState('locked');
        setSelectedOption(null);
        setFeedback(null);
        onCorrectAnswer();
      }, 2000);
    } else {
      soundFX.playErrorBuzzer();
      soundFX.playHeartLoss();
      setShake(true);
      setTimeout(() => setShake(false), 500);

      setFeedback({
        type: 'error',
        text: res.message || 'Respuesta incorrecta. El cerrojo se atranca y pierdes 1 vida.',
      });

      onWrongAnswer();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 select-none">
      {/* Barra de estado superior: Nivel actual y vidas */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase bg-emerald-950/70 border border-emerald-500/40 px-3 py-1 rounded-full">
            Bóveda {currentLevel} de {totalLevels}
          </span>
        </div>

        {/* Indicador de Vidas en la cámara */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700 px-3 py-1 rounded-full shadow-lg">
          <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold mr-1">
            Vidas:
          </span>
          {[1, 2, 3].map((heartIndex) => (
            <span
              key={heartIndex}
              className={`text-base transition-all duration-300 ${
                heartIndex <= lives
                  ? 'text-rose-500 scale-100 drop-shadow-[0_0_8px_rgba(244,63,94,0.7)] animate-pulse'
                  : 'text-slate-600 scale-90 opacity-40'
              }`}
            >
              {heartIndex <= lives ? '❤️' : '💔'}
            </span>
          ))}
        </div>

        {/* Botón de pistas */}
        <button
          onClick={() => setShowHint(true)}
          className="text-xs font-bold text-amber-300 hover:text-amber-200 bg-amber-950/60 border border-amber-500/40 hover:border-amber-400 px-3 py-1 rounded-xl flex items-center gap-1.5 transition"
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Pista</span>
        </button>
      </div>

      {/* Escenario de Bóveda Blindada */}
      <div
        className={`relative rounded-3xl border-4 bg-gradient-to-b from-slate-900 via-slate-950 to-neutral-950 p-6 md:p-8 shadow-2xl transition-all duration-500 overflow-hidden ${
          shake ? 'animate-shake border-rose-600 shadow-rose-950/80' : ''
        } ${
          roomState === 'unlocked'
            ? 'border-emerald-500 shadow-emerald-950/60 bg-emerald-950/20'
            : 'border-slate-700'
        }`}
      >
        {/* Rayas de seguridad industrial */}
        <div className="absolute top-0 inset-x-0 h-2 bg-[repeating-linear-gradient(45deg,#38bdf8,#38bdf8_10px,#000_10px,#000_20px)] opacity-40" />

        {/* Encabezado del Cerrojo */}
        <div className="flex flex-col items-center text-center mb-6">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 mb-3 ${
              roomState === 'unlocked'
                ? 'bg-emerald-950 border-emerald-400 text-emerald-400 scale-110 shadow-lg shadow-emerald-500/30'
                : 'bg-slate-950 border-slate-700 text-cyan-400'
            }`}
          >
            {roomState === 'unlocked' ? (
              <Unlock className="w-8 h-8 animate-bounce" />
            ) : (
              <Lock className="w-8 h-8" />
            )}
          </div>

          <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-bold">
            {questionData.title}
          </span>
          <h2 className="text-lg md:text-xl font-black text-white mt-1 max-w-xl leading-snug">
            {questionData.question}
          </h2>
        </div>

        {/* ======================================================== */}
        {/* CASO 1: VERDADERO O FALSO (DOS BOTONES TÁCTICOS GIGANTES) */}
        {/* ======================================================== */}
        {questionData.type === 'boolean' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto my-6">
            {/* Botón VERDADERO */}
            <button
              type="button"
              onClick={() => handleSelectAnswer('VERDADERO')}
              disabled={loading || roomState === 'unlocked'}
              className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition-all duration-200 transform active:scale-95 shadow-xl ${
                selectedOption === 'VERDADERO' && roomState === 'unlocked'
                  ? 'bg-emerald-600 border-emerald-300 text-white shadow-emerald-500/50 scale-105'
                  : 'bg-gradient-to-b from-slate-900 to-slate-950 border-emerald-600/70 hover:border-emerald-400 text-emerald-300 hover:bg-emerald-950/40 hover:shadow-emerald-900/40'
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Check className="w-7 h-7" />
              </div>
              <span className="font-mono font-black text-xl tracking-wider uppercase">
                Verdadero
              </span>
              <span className="text-[11px] text-emerald-400/80 font-mono">
                [ Protocolo Válido ]
              </span>
            </button>

            {/* Botón FALSO */}
            <button
              type="button"
              onClick={() => handleSelectAnswer('FALSO')}
              disabled={loading || roomState === 'unlocked'}
              className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition-all duration-200 transform active:scale-95 shadow-xl ${
                selectedOption === 'FALSO' && roomState === 'unlocked'
                  ? 'bg-rose-600 border-rose-300 text-white shadow-rose-500/50 scale-105'
                  : 'bg-gradient-to-b from-slate-900 to-slate-950 border-rose-600/70 hover:border-rose-400 text-rose-300 hover:bg-rose-950/40 hover:shadow-rose-900/40'
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <X className="w-7 h-7" />
              </div>
              <span className="font-mono font-black text-xl tracking-wider uppercase">
                Falso
              </span>
              <span className="text-[11px] text-rose-400/80 font-mono">
                [ Protocolo Nulo ]
              </span>
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* CASO 2: SELECCIÓN MÚLTIPLE (4 BOTONES TÁCTICOS A, B, C, D) */}
        {/* ======================================================== */}
        {questionData.type === 'multiple' && (
          <div className="space-y-3 max-w-xl mx-auto my-4">
            {questionData.options.map((opt) => {
              const isSelected = selectedOption === opt.key;
              const isSuccess = isSelected && roomState === 'unlocked';

              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handleSelectAnswer(opt.key)}
                  disabled={loading || roomState === 'unlocked'}
                  className={`w-full p-4 rounded-2xl border-2 text-left flex items-center gap-3.5 transition-all duration-200 transform active:scale-[0.98] shadow-lg ${
                    isSuccess
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-emerald-500/30 ring-2 ring-emerald-400'
                      : 'bg-slate-950/80 border-slate-800 hover:border-cyan-500/80 hover:bg-slate-900 text-slate-200'
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  <span
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-black text-sm shrink-0 border transition-all ${
                      isSuccess
                        ? 'bg-emerald-500 text-slate-950 border-emerald-300'
                        : 'bg-slate-900 border-slate-700 text-cyan-400'
                    }`}
                  >
                    {opt.key}
                  </span>
                  <span className="text-xs md:text-sm font-medium leading-relaxed flex-1">
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Mensajes de retroalimentación en vivo */}
        {feedback && (
          <div
            className={`mt-4 p-3.5 rounded-2xl text-xs font-semibold flex items-start gap-2.5 max-w-xl mx-auto animate-fadeIn ${
              feedback.type === 'success'
                ? 'bg-emerald-950/80 border border-emerald-500/60 text-emerald-300'
                : 'bg-rose-950/80 border border-rose-500/60 text-rose-300'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <span className="block font-bold">
                {feedback.type === 'success'
                  ? '¡Cerrojo Superado!'
                  : '¡Alarma de Intrusión! -1 Vida'}
              </span>
              <span>{feedback.text}</span>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE PISTA */}
      {showHint && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 shadow-2xl relative animate-scaleIn text-left">
            <button
              onClick={() => setShowHint(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-base">
                Pista de Seguridad • Bóveda {currentLevel}
              </h3>
            </div>

            <p className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs font-mono text-amber-200/90 leading-relaxed">
              {questionData.hint}
            </p>

            <button
              onClick={() => setShowHint(false)}
              className="w-full mt-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition"
            >
              Volver a la Bóveda
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
