/**
 * Cliente de comunicación con la API Backend de Escape Room
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Valida la respuesta de un nivel específico en el backend.
 * @param {number} level - 1, 2 o 3
 * @param {string|number} answer - Respuesta propuesta por el jugador
 */
export async function verifyPuzzle(level, answer) {
  try {
    const res = await fetch(`${API_URL}/api/verify-puzzle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level, answer }),
    });

    const data = await res.json();
    return {
      status: res.status,
      ...data,
    };
  } catch (error) {
    console.error('Error al conectar con el servidor:', error);
    return {
      success: false,
      message: 'No se pudo conectar con el servidor backend. Verifica que esté en ejecución.',
    };
  }
}

/**
 * Registra el tiempo final y nombre del jugador en el leaderboard de Supabase.
 * @param {string} playerName - Nombre o apodo del jugador
 * @param {number} completionTimeSeconds - Segundos totales empleados
 */
export async function submitScore(playerName, completionTimeSeconds) {
  try {
    const res = await fetch(`${API_URL}/api/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerName, completionTimeSeconds }),
    });

    const data = await res.json();
    return {
      status: res.status,
      ...data,
    };
  } catch (error) {
    console.error('Error al guardar el puntaje:', error);
    return {
      success: false,
      message: 'No se pudo guardar el puntaje en la base de datos.',
    };
  }
}

/**
 * Recupera el Top 10 del Leaderboard desde Supabase.
 */
export async function getLeaderboard() {
  try {
    const res = await fetch(`${API_URL}/api/leaderboard`);
    const data = await res.json();
    return {
      status: res.status,
      ...data,
    };
  } catch (error) {
    console.error('Error al obtener el leaderboard:', error);
    return {
      success: false,
      leaderboard: [],
      message: 'No se pudo cargar la tabla de clasificación.',
    };
  }
}
