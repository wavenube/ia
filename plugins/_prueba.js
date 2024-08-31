import fetch from 'node-fetch';
import fs from 'fs';
import { xpRange } from '../lib/levelling.js';
import { join } from 'path';
import moment from 'moment-timezone';

const handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  try {
    const d = new Date(new Date() + 3600000);
    const locale = 'es-ES';
    const week = d.toLocaleDateString(locale, { weekday: 'long' });
    const date = d.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
    const _uptime = process.uptime() * 1000;
    const uptime = clockString(_uptime);

    // Obteniendo datos del usuario
    const user = global.db.data.users[m.sender];
    if (!user) throw new Error('No se pudo obtener los datos del usuario.');

    const { exp, limit, level, role } = user;
    const { min, xp, max } = xpRange(level, global.multiplier);
    const name = await conn.getName(m.sender);
    const totalreg = Object.keys(global.db.data.users).length;
    const rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length;

    // Usar imagen predeterminada o imagen de contacto
    const pp = global.imagen1 || './media/contact.png';
    const more = String.fromCharCode(8206);
    const readMore = more.repeat(850);

    const menuText = `
      *Bienvenido al Menú de Comandos*
      
      *Usuario:* ${name}
      *Nivel:* ${level}
      *Experiencia:* ${exp} / ${xp}
      *Rol:* ${role}
      *Limite:* ${limit}
      *Registrados:* ${totalreg} / ${rtotalreg}
      
      *Fecha:* ${week}, ${date}
      *Uptime:* ${uptime}
      
      ${readMore}
      
      *Comandos Disponibles:*
      ☆  ${_p}comando1
      ☆  ${_p}comando2
      ☆  ${_p}comando3
      
      *Made by ♡ Shizo*
    `.trim();

    // Verificar si es un chat de grupo
    if (m.isGroup) {
      await conn.sendMessage(m.chat, { image: { url: pp }, caption: menuText, mentions: [m.sender] }, { quoted: m });
    } else {
      const fkontak = {
        key: { participants: "0@s.whatsapp.net", remoteJid: "status@broadcast", fromMe: false, id: "Halo" },
        message: {
          contactMessage: {
            vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
          }
        },
        participant: "0@s.whatsapp.net"
      };
      await conn.sendMessage(m.chat, { image: { url: pp }, caption: menuText, mentions: [m.sender] }, { quoted: fkontak });
    }

  } catch (e) {
    console.error('Error en el menú:', e);
    await conn.reply(m.chat, `Hubo un error al procesar tu solicitud. Por favor, intenta de nuevo. \n\n*Detalles del error:* ${e.message}`, m);
  }
};

handler.command = /^(prueba2)$/i;
handler.exp = 50;
handler.fail = null;

export default handler;

function clockString(ms) {
  const h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
  const m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  const s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(':');
}
