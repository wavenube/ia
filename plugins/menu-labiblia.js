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
    const pp = './media/abyss.png';
    const more = String.fromCharCode(8206);
    const readMore = more.repeat(850);

    const menuText = `
*Bienvenido a el infierno*
      
👤 *Usuario:* ${name}
🔢 *Nivel:* ${level}
🎓 *Experiencia:* ${exp} / ${xp}
🛡️ *Rol:* ${role}
📊 *Limite:* ${limit}
👥 *Registrados:* ${totalreg} / ${rtotalreg}
      
📅 *Fecha:* ${week}, ${date}
⏰ *Uptime:* ${uptime}
${readMore}
      
*+18:*
> hentai
> boobs
>pack_
>pack2_
>pack3_
>videoxxx_
>videolesbixxx_
>tetas_
>booty_
>ecchi_
>furro_
>imagenlesbians_
>panties_
>pene_
>porno_
>randomxxx_
>pechos_
>yaoi_
>yaoi2_
>yuri_
>yuri2_
>trapito_
>hentai_
>nsfwloli_
>nsfworgy_
>nsfwfoot_
>nsfwass_
>nsfwbdsm_
>nsfwcum_
>nsfwero_
>nsfwfemdom_
>nsfwglass_
>hentaipdf *<texto>*_
>hentaisearch *<texto>*_


Made by ♡ ZephyrByte
          `.trim();

    const fkontak = {
      key: { participants: "0@s.whatsapp.net", remoteJid: "status@broadcast", fromMe: false, id: "Halo" },
      message: {
        contactMessage: {
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
        }
      },
      participant: "0@s.whatsapp.net"
    };

    const contextInfo = {
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363318622514917@newsletter",
        serverMessageId: 1,
        newsletterName: "Abyss Bot"
      },
      externalAdReply: {
        mediaUrl: "https://whatsapp.com/channel/0029VakDx9I0gcfFXnzZIX2v",
        mediaType: 'VIDEO',
        description: 'canal del grupo',
        title: 'Abyss Bot',
        body: "By: ZephyrByte",
        thumbnailUrl: "https://i.ibb.co/Qjf1sdk/abyss-profile.png",
        sourceUrl: "https://whatsapp.com/channel/0029VakDx9I0gcfFXnzZIX2v"
      }
    };

    // Verificar si es un chat de grupo
    if (m.isGroup) {
      await conn.sendMessage(m.chat, {
        image: { url: pp },
        caption: menuText,
        mentions: [...menuText.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net'),
        contextInfo
      }, { quoted: fkontak });
    } else {
      await conn.sendMessage(m.chat, {
        image: { url: pp },
        caption: menuText,
        mentions: [...menuText.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net'),
        contextInfo
      }, { quoted: fkontak });
    }

  } catch (e) {
    console.error('Error en el menú:', e);
    await conn.reply(m.chat, `Hubo un error al procesar tu solicitud. Por favor, intenta de nuevo. \n\n*Detalles del error:* ${e.message}`, m);
  }
};

handler.command = /^(labiblia)$/i;
handler.exp = 50;
handler.fail = null;

export default handler;

function clockString(ms) {
  const h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
  const m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  const s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(':');
}
