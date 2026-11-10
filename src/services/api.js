/**
 * Cliente de comunicación con la API Backend de Escape Room
 */
const rawUrl = import.meta.env.VITE_API_URL;
let cleanUrl = rawUrl ? rawUrl.trim().replace(/\/+$/, '') : '';

// Si no se definió o apunta a localhost en un despliegue en la nube (Vercel),
// redirige automáticamente a tu backend en producción en Render:
if (
  !cleanUrl ||
  (typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1' &&
    cleanUrl.includes('localhost'))
) {
  cleanUrl = 'https://ecaperoom-backend.onrender.com';
}

const API_URL = cleanUrl || 'http://localhost:5000';

if (typeof window !== 'undefined') {
  console.log('📡 Escape Room Backend API URL:', API_URL);
}

/**
 * Valida la respuesta de un nivel específico en el backend.
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
      message: `No se pudo conectar con el servidor backend (${API_URL}). Verifica que esté en ejecución.`,
    };
  }
}

/**
 * Registra el tiempo, nombre, historial de respuestas y vidas en Supabase.
 */
export async function submitScore(playerName, completionTimeSeconds, answers = [], livesRemaining = 3) {
  try {
    const res = await fetch(`${API_URL}/api/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerName,
        completionTimeSeconds,
        answers,
        livesRemaining,
      }),
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

/**
 * ==============================================================
 * FUNCIONES DEL PANEL DE ADMINISTRADOR
 * ==============================================================
 */

/**
 * Inicia sesión de Administrador
 */
export async function adminLogin(username, password) {
  try {
    const res = await fetch(`${API_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return await res.json();
  } catch (error) {
    return { success: false, message: 'No se pudo conectar con el servidor de autenticación.' };
  }
}

/**
 * Recupera todos los jugadores con su desglose de respuestas
 */
export async function getAdminPlayers(token) {
  try {
    const res = await fetch(`${API_URL}/api/admin/players`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (error) {
    return { success: false, message: 'Error al recuperar jugadores.' };
  }
}

/**
 * Elimina a un jugador individual por ID
 */
export async function deleteAdminPlayer(id, token) {
  try {
    const res = await fetch(`${API_URL}/api/admin/players/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (error) {
    return { success: false, message: 'Error al eliminar jugador.' };
  }
}

/**
 * Vacía y limpia todos los registros del juego
 */
export async function clearAdminLeaderboard(token) {
  try {
    const res = await fetch(`${API_URL}/api/admin/clear-all`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (error) {
    return { success: false, message: 'Error al vaciar los registros.' };
  }
}
