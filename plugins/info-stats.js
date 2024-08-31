import fs from 'fs';
import os from 'os';
import performanceNow from 'performance-now';
import { generateWAMessageFromContent, jidNormalizedUser } from '@adiwajshing/baileys';

// Archivo que registra el inicio
const startFile = './proto/src/start.txt';
const startTime = fs.existsSync(startFile) ? fs.statSync(startFile).mtime : new Date();

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

// Función para formatear el tiempo de ejecución
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
    const start = performanceNow();
    const ram = os.totalmem() - os.freemem(); // Usado - Libre RAM
    const uptime = os.uptime(); // Tiempo de actividad en segundos
    const elapsed = performanceNow() - start; // Tiempo de respuesta

    const botNumber = jidNormalizedUser(conn.user.id);

    let statsText = `
* Estadísticas del Bot *

› Tiempo de Respuesta: ${elapsed.toFixed(2)} ms
› RAM Usada: ${humanFileSize(ram)}
› Uptime: ${formatUptime(uptime)}

* Sistema *
› CPU: ${os.cpus()[0].model}
› Memoria Total: ${humanFileSize(os.totalmem())}
› Memoria Libre: ${humanFileSize(os.freemem())}
› Plataforma: ${os.platform()} (${os.release()})
› Arquitectura: ${os.arch()}
› Nodo: ${process.version}
    `;

    const message = generateWAMessageFromContent(
      m.chat,
      {
        extendedTextMessage: {
          text: statsText,
          contextInfo: {
            externalAdReply: {
              title: 'Estadísticas del Bot',
              body: 'Información del bot y el sistema',
              mediaType: 1,
              renderLargerThumbnail: true,
              showAdAttribution: true,
              thumbnailUrl: 'https://i.ibb.co/K6kXPc0/image.jpg'
            }
          }
        }
      },
      { userJid: botNumber, quoted: m }
    );

    await conn.relayMessage(m.chat, message.message, { messageId: message.key.id });
  } catch (error) {
    console.error('Error en el comando stats:', error);
  }
};

// Expresión regular para los comandos
handler.command = /^(ping|stats)$/i;
export default handler;
