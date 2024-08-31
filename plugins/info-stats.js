import fs from 'fs';
import os from 'os';
import si from 'systeminformation';
import speed from 'performance-now';
import moment from 'moment';
import { generateWAMessageFromContent, jidNormalizedUser } from '@adiwajshing/baileys';
import { runtime } from './lib/funcs_delirius.js'; // Asegúrate de que esta ruta sea correcta

let mulai = fs.statSync('./proto/src/start.txt');
let config = JSON.parse(fs.readFileSync('./proto/src/config.json'));
let { info } = JSON.parse(fs.readFileSync('./db/info.json')); // Asegúrate de que esta ruta sea correcta
let { stats } = info('stats');
let usuarios_delirius = JSON.parse(fs.readFileSync('./db/user.json'));

function times(second) {
  const days = Math.floor(second / 60 / 60 / 24);
  const hours = Math.floor(second / 60 / 60);
  const minutes = Math.floor(second / 60);
  const sec = Math.floor(second);
  return `${days} días, ${hours} horas, ${minutes} minutos, ${sec} segundos`;
}

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

export const handler = async (m, { conn, command, usedPrefix }) => {
  if (!['ping', 'stat'].includes(command)) return;

  try {
    const mtime = new Date(mulai.mtime);
    const now = new Date();
    const timestampe = speed();
    const latensie = speed() - timestampe;
    const ram = await si.mem();
    const cpu = await si.cpuCurrentSpeed();
    const disk = await si.fsSize();
    const up = await si.time();
    const botNumber = jidNormalizedUser(conn.user.id);

    let json = {
      server_time: new Date(up.current).toLocaleString('pe'),
      uptime: times(up.uptime),
      memory: `${humanFileSize(ram.free, true, 1)} libre de ${humanFileSize(ram.total, true, 1)}`,
      memory_used: humanFileSize(ram.used, true, 1),
      cpu: `${cpu.avg} GHz`,
      disk: `${humanFileSize(disk[0].available, true, 1)} libre de ${humanFileSize(disk[0].size, true, 1)}`,
      chats: {
        total: conn.chats.length,
        private: conn.chats.filter(x => x.id.includes('@s.whatsapp.net')).length,
        groups: conn.chats.filter(x => x.id.includes('@g.us')).length
      }
    };

    let txtping = `\n– B O T  S T A T\n
› Ram : ${json.memory}
› Memoria : ${json.memory_used}
› Disco : ${json.disk}
› Ejecución : ${moment.duration((now - mtime) / 1000, 'seconds').locale('es').humanize()}
› OS uptime : ${moment.duration(os.uptime(), 'seconds').locale('es').humanize()}
* *${Object.keys(usuarios_delirius).length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}* usuarios
* ${humanFileSize(stats.filesize, true)} media enviada
* ${humanFileSize(stats.bufferRecv, true)} media recibida
* *${stats.msgRecv.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}* mensajes recibidos
* *${stats.msgSent.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}* mensajes enviados
* ${json.chats.total} chats totales
* ${json.chats.private} chats privados
* ${json.chats.groups} chats grupales
* ${stats.autodownload} autodescargas
* *${stats.sticker.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}* stickers creados
› Runtime : ${runtime(process.uptime())}\n
– S Y S T E M\n
* ${config.composing ? '[ √ ]' : '[ × ]'} Autotyping
* ${config.autoRead ? '[ √ ]' : '[ × ]'} Autoread
* ${config.autoPost ? '[ √ ]' : '[ × ]'} Autopost
› CPU : ${json.cpu}
› Servidor : ${json.server_time}
› Prefix : (multi) (!./#-)\n
> Powered By Delirius (神志不清)`;

    const extendedText = generateWAMessageFromContent(
      m.chat,
      {
        extendedTextMessage: {
          text: txtping,
          contextInfo: {
            externalAdReply: {
              title: '– E S T A D I S T I C A S',
              body: runtime(process.uptime()),
              sourceUrl: config.appWeb,
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

    await conn.relayMessage(m.chat, extendedText.message, { messageId: extendedText.key.id });
  } catch (error) {
    console.error('Error en el comando stats:', error);
  }
};

handler.command = /^(ping|stat)$/i;
export default handler;
