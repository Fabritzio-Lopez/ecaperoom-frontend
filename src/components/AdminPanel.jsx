import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, LogOut, Trash2, Eye, X, RefreshCw, CheckCircle2, AlertCircle, Clock, Heart, Users } from 'lucide-react';
import { adminLogin, getAdminPlayers, deleteAdminPlayer, clearAdminLeaderboard } from '../services/api';
import { formatTime } from './Timer';
import { QUESTIONS } from '../data/questions';

export default function AdminPanel({ isOpen, onClose, onLeaderboardChanged }) {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token') || null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const [players, setPlayers] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [selectedPlayerForDetails, setSelectedPlayerForDetails] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  // Cargar jugadores cuando hay token
  const loadPlayers = async (authToken) => {
    setDataLoading(true);
    setActionMessage(null);
    const res = await getAdminPlayers(authToken || token);
    setDataLoading(false);
    if (res.success && Array.isArray(res.players)) {
      setPlayers(res.players);
    }
  };

  useEffect(() => {
    if (isOpen && token) {
      loadPlayers(token);
    }
  }, [isOpen, token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    const res = await adminLogin(username, password);
    setLoginLoading(false);

    if (res.success && res.token) {
      setToken(res.token);
      localStorage.setItem('admin_token', res.token);
      loadPlayers(res.token);
    } else {
      setLoginError(res.message || 'Usuario o contraseña incorrectos.');
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('admin_token');
    setPlayers([]);
    setPassword('');
  };

  const handleDeletePlayer = async (id, name) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el registro de "${name}"?`)) return;

    const res = await deleteAdminPlayer(id, token);
    if (res.success) {
      setActionMessage({ type: 'success', text: `Jugador "${name}" eliminado.` });
      loadPlayers(token);
      if (onLeaderboardChanged) onLeaderboardChanged();
    } else {
      setActionMessage({ type: 'error', text: res.message });
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('⚠️ ¿Estás seguro de borrar TODOS los registros del juego? Esta acción no se puede deshacer.')) return;

    const res = await clearAdminLeaderboard(token);
    if (res.success) {
      setActionMessage({ type: 'success', text: 'Todos los registros han sido borrados de Supabase.' });
      setPlayers([]);
      if (onLeaderboardChanged) onLeaderboardChanged();
    } else {
      setActionMessage({ type: 'error', text: res.message });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-4xl w-full bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 md:p-8 shadow-2xl relative animate-scaleIn my-8 max-h-[90vh] flex flex-col justify-between">
        
        {/* Botón cerrar modal */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          title="Cerrar panel"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ============================================================== */}
        {/* CASO 1: FORMULARIO DE INICIO DE SESIÓN DE ADMINISTRADOR */}
        {/* ============================================================== */}
        {!token ? (
          <div className="max-w-md mx-auto w-full py-8 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 mb-4 shadow-lg shadow-amber-500/20">
              <Lock className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black text-white tracking-wide uppercase mb-1">
              Acceso Restringido • Administrador
            </h2>
            <p className="text-xs text-slate-400 font-mono mb-6">
              Inicia sesión con credenciales de control para auditar respuestas y gestionar la base de datos.
            </p>

            <form onSubmit={handleLogin} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-left space-y-4 shadow-inner">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-400 uppercase mb-1">
                  Usuario Administrador:
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingresa tu usuario..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-400 uppercase mb-1">
                  Contraseña de Seguridad:
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition active:scale-95 disabled:opacity-50"
              >
                {loginLoading ? 'Verificando...' : 'Iniciar Sesión'}
              </button>
            </form>
          </div>
        ) : (
          /* ============================================================== */
          /* CASO 2: PANEL DE CONTROL DE AUDITORÍA Y MONITOREO              */
          /* ============================================================== */
          <div className="flex-1 flex flex-col">
            {/* Header del Panel */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white uppercase tracking-wide">
                    Panel de Auditoría • Administrador
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    Monitoreo en vivo de respuestas de jugadores y limpieza de Supabase
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => loadPlayers(token)}
                  disabled={dataLoading}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition"
                  title="Recargar datos"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${dataLoading ? 'animate-spin' : ''}`} />
                  Actualizar
                </button>

                <button
                  onClick={handleClearAll}
                  className="px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-xs font-mono text-rose-300 flex items-center gap-1.5 transition"
                  title="Vaciar todo el leaderboard"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Vaciar Todo
                </button>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5 transition"
                  title="Cerrar sesión de admin"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Salir
                </button>
              </div>
            </div>

            {/* Mensajes de acción */}
            {actionMessage && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold mb-4 flex items-center gap-2 ${
                  actionMessage.type === 'success'
                    ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950 border border-rose-500/40 text-rose-300'
                }`}
              >
                {actionMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{actionMessage.text}</span>
              </div>
            )}

            {/* Métricas rápidas */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
                <Users className="w-5 h-5 text-cyan-400" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Agentes Jugados</span>
                  <span className="text-lg font-black text-white">{players.length}</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
                <Clock className="w-5 h-5 text-emerald-400" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Mejor Tiempo</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">
                    {players.length > 0 ? formatTime(players[0].completion_time_seconds) : '--:--'}
                  </span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center gap-3 col-span-2 sm:col-span-1">
                <Heart className="w-5 h-5 text-rose-500" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Estado BD</span>
                  <span className="text-xs font-bold text-emerald-400">Supabase Online</span>
                </div>
              </div>
            </div>

            {/* TABLA DE JUGADORES Y RESPUESTAS */}
            <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950/70">
              {dataLoading && players.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-xs font-mono">
                  Consultando registros en Supabase...
                </div>
              ) : players.length === 0 ? (
                <div className="py-16 text-center text-slate-500 text-xs font-mono">
                  No hay partidas registradas actualmente.
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase font-mono">
                      <th className="py-3 px-4">Agente</th>
                      <th className="py-3 px-4">Tiempo</th>
                      <th className="py-3 px-4">Vidas</th>
                      <th className="py-3 px-4">Fecha</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {players.map((p, idx) => (
                      <tr key={p.id || idx} className="hover:bg-slate-800/40 text-slate-300 transition">
                        <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                          <span className="text-xs font-mono text-amber-400">#{idx + 1}</span>
                          <span>{p.player_name}</span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                          {formatTime(p.completion_time_seconds)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-0.5">
                            {[1, 2, 3].map((h) => (
                              <span key={h} className="text-xs">
                                {h <= (p.lives_remaining ?? 3) ? '❤️' : '🖤'}
                              </span>
                            ))}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-[11px] font-mono">
                          {p.created_at ? new Date(p.created_at).toLocaleString('es-ES') : '-'}
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          {/* Botón Ver Respuestas */}
                          <button
                            onClick={() => setSelectedPlayerForDetails(p)}
                            className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-mono text-[11px] inline-flex items-center gap-1 transition"
                            title="Ver cómo respondió este jugador"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Ver Respuestas
                          </button>

                          {/* Botón Eliminar Individual */}
                          <button
                            onClick={() => handleDeletePlayer(p.id, p.player_name)}
                            className="p-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-400 hover:text-white transition"
                            title="Eliminar registro"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL SECUNDARIO: AUDITORÍA DE CÓMO RESPONDIÓ EL JUGADOR       */}
        {/* ============================================================== */}
        {selectedPlayerForDetails && (
          <div className="fixed inset-0 bg-black/90 z-60 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-slate-900 border-2 border-cyan-500/60 rounded-3xl p-6 shadow-2xl relative max-h-[85vh] flex flex-col animate-scaleIn">
              <button
                onClick={() => setSelectedPlayerForDetails(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
                <Eye className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="font-bold text-white text-base">
                    Auditoría de Respuestas: <span className="text-cyan-400">{selectedPlayerForDetails.player_name}</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Tiempo Total: {formatTime(selectedPlayerForDetails.completion_time_seconds)} | Vidas Restantes: {selectedPlayerForDetails.lives_remaining ?? 3}/3
                  </span>
                </div>
              </div>

              {/* Desglose de las 7 Preguntas y Respuestas */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-left">
                {QUESTIONS.map((q) => {
                  const playerAnswers = Array.isArray(selectedPlayerForDetails.answers)
                    ? selectedPlayerForDetails.answers
                    : [];
                  const playerAnsObj = playerAnswers.find((a) => a.questionId === q.id);
                  const answeredText = playerAnsObj ? playerAnsObj.answer : 'No registrada';
                  const isCorrect = playerAnsObj ? playerAnsObj.isCorrect : true;

                  return (
                    <div key={q.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
                      <div className="flex items-center justify-between text-slate-400 font-bold mb-1">
                        <span>BÓVEDA {q.id} ({q.type === 'boolean' ? 'Verdadero/Falso' : 'Opción Múltiple'})</span>
                        <span className={isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {isCorrect ? '✓ Acertada' : '✗ Fallada'}
                        </span>
                      </div>
                      <p className="text-slate-200 mb-2 font-sans font-medium text-xs">
                        {q.question}
                      </p>
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-400">Respuesta del Agente:</span>
                        <span className="font-black text-cyan-300">{answeredText}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setSelectedPlayerForDetails(null)}
                className="w-full mt-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition"
              >
                Volver al Panel de Control
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
