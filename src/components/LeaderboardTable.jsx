import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Clock, Calendar, RefreshCw, AlertCircle } from 'lucide-react';
import { getLeaderboard } from '../services/api';
import { formatTime } from './Timer';

export default function LeaderboardTable({ currentPlayerName, highlightLatest = false }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchScores = async () => {
    setLoading(true);
    setError(null);
    const res = await getLeaderboard();
    setLoading(false);
    if (res.success && Array.isArray(res.leaderboard)) {
      setScores(res.leaderboard);
    } else {
      setError(res.message || 'No se pudo cargar la tabla de clasificación.');
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const getRankBadge = (index) => {
    switch (index) {
      case 0:
        return (
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 font-bold border border-amber-500/40 text-xs shadow-sm shadow-amber-500/30">
            🥇 1
          </span>
        );
      case 1:
        return (
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300/20 text-slate-200 font-bold border border-slate-300/40 text-xs">
            🥈 2
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700/20 text-amber-600 font-bold border border-amber-700/40 text-xs">
            🥉 3
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 text-slate-400 font-semibold text-xs">
            #{index + 1}
          </span>
        );
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '-';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '-';
    }
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur">
      {/* Header del Leaderboard */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-white text-sm md:text-base tracking-wide">
            Leaderboard Oficial (Top 10 Tiempos)
          </h3>
        </div>
        <button
          onClick={fetchScores}
          disabled={loading}
          className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 transition disabled:opacity-50"
          title="Actualizar tabla"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Actualizar</span>
        </button>
      </div>

      {/* Tabla de Resultados */}
      <div className="overflow-x-auto">
        {loading && scores.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 text-xs">
            <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-2" />
            <span>Consultando registros en Supabase...</span>
          </div>
        ) : error && scores.length === 0 ? (
          <div className="py-8 px-4 text-center text-rose-400 text-xs flex flex-col items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        ) : scores.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No hay puntajes registrados todavía. ¡Sé el primero en el ranking!
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-950/30 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4 text-center w-16">Puesto</th>
                <th className="py-3 px-4">Agente</th>
                <th className="py-3 px-4 text-right">Tiempo Total</th>
                <th className="py-3 px-4 text-right hidden sm:table-cell">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {scores.map((score, index) => {
                const isCurrent =
                  currentPlayerName &&
                  score.player_name.toLowerCase() === currentPlayerName.toLowerCase();

                return (
                  <tr
                    key={score.id || index}
                    className={`transition ${
                      isCurrent
                        ? 'bg-emerald-950/40 text-emerald-200'
                        : 'hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <td className="py-3 px-4 text-center">{getRankBadge(index)}</td>
                    <td className="py-3 px-4 font-bold flex items-center gap-2">
                      <span className={isCurrent ? 'text-emerald-300 font-extrabold' : 'text-white'}>
                        {score.player_name}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                          TÚ
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                      {formatTime(score.completion_time_seconds)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500 text-[11px] hidden sm:table-cell">
                      {formatDate(score.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
