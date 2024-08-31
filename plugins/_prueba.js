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

    const { exp, limit, level, role } = global.db.data.users[m.sender];
    const { min, xp, max } = xpRange(level, global.multiplier);
    const name = await conn.getName(m.sender);
    const totalreg = Object.keys(global.db.data.users).length;
    const rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length;

    const pp = global.imagen1 || './media/abyss.png';  // Imagen predeterminada
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
      ☆  %cmd 
      
      *Made by ♡ Shizo*
    `.trim();

    if (m.isGroup) {
      conn.sendMessage(m.chat, { image: { url: pp }, caption: menuText.replace(/%cmd/g, usedPrefix), mentions: [m.sender] }, { quoted: m });
    } else {
      const fkontak = { key: { participants: "0@s.whatsapp.net", remoteJid: "status@broadcast", fromMe: false, id: "Halo" }, message: { contactMessage: { vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` } }, participant: "0@s.whatsapp.net" };
      conn.sendMessage(m.chat, { image: { url: pp }, caption: menuText.replace(/%cmd/g, usedPrefix), mentions: [m.sender] }, { quoted: fkontak });
    }
  } catch (e) {
    conn.reply(m.chat, "Hubo un error al procesar tu solicitud. Por favor, intenta de nuevo.", m);
  }
};

handler.command = /^(prueba)$/i;
handler.exp = 50;
handler.fail = null;

export default handler;

function clockString(ms) {
  const h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
  const m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  const s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(':');
}
