import process from 'process';
import performanceNow from 'performance-now';

// Función para formatear el tamaño de archivo
function humanFileSize(bytes, si = true, dp = 1) {
  const thresh = si ? 1000 : 1024;
  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }
  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** dp;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
  return Math.round(bytes * r) / r + ' ' + units[u];
}

// Función para formatear el tiempo de actividad
function formatUptime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${days} días, ${hours} horas, ${minutes} minutos, ${secs} segundos`;
}

// Manejador del comando
export const handler = async (m, { conn, command }) => {
  if (!['ping', 'stats'].includes(command)) return;

  try {
    // Medir el tiempo de respuesta
    const start = performanceNow();
    // Medir el uso de RAM
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;

    // Calcular el tiempo de respuesta
    const responseTime = (performanceNow() - start).toFixed(2); // en milisegundos

    // Crear el mensaje
    const messageText = `
*Estadísticas del Bot*

› Tiempo de Respuesta: ${responseTime} ms
› RAM Usada: ${humanFileSize(usedMemory)}
› RAM Total: ${humanFileSize(totalMemory)}
› RAM Libre: ${humanFileSize(freeMemory)}
    `;

    // Enviar el mensaje
    await conn.sendMessage(m.chat, { text: messageText }, { quoted: m });
  } catch (error) {
    console.error('Error en el comando stats:', error);
  }
};

// Expresión regular para los comandos
handler.command = /^(ping|stats)$/i;
export default handler;
