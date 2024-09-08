const schedule = require('node-schedule');

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (args.length < 3) {
    return conn.sendMessage(m.chat, { text: '❌ Uso incorrecto. Ejemplo: .msgtime 5m 123456789 mensaje o archivo' }, { quoted: m });
  }

  // Parsear tiempo
  const timeArg = args[0];
  const number = args[1];
  const timeMatch = timeArg.match(/^(\d+)([mhd])$/);

  if (!timeMatch) {
    return conn.sendMessage(m.chat, { text: '❌ Formato de tiempo inválido. Usa m (minutos), h (horas), o d (días).' }, { quoted: m });
  }

  const amount = parseInt(timeMatch[1]);
  const unit = timeMatch[2];
  let delay;

  if (unit === 'm') delay = amount * 60 * 1000;
  if (unit === 'h') delay = amount * 60 * 60 * 1000;
  if (unit === 'd') delay = amount * 24 * 60 * 60 * 1000;

  const content = args.slice(2).join(' ');

  // Programar el envío del mensaje o archivo
  conn.sendMessage(m.chat, { text: `✅ Mensaje programado para enviarse en ${amount}${unit} al número ${number}.` }, { quoted: m });

  setTimeout(async () => {
    const quotedMsg = { quoted: m };

    if (m.hasMedia) {
      const media = await conn.downloadMediaMessage(m);
      await conn.sendMessage(number + '@s.whatsapp.net', { 
        document: media || content, 
        caption: content || null, 
        mimetype: m.mimetype || null, 
        fileName: m.filename || null 
      }, quotedMsg);
    } else {
      await conn.sendMessage(number + '@s.whatsapp.net', { text: content }, quotedMsg);
    }

    conn.sendMessage(m.chat, { text: `✅ Mensaje enviado a ${number}` }, { quoted: m });
  }, delay);
};

handler.command = /^(msgtime)$/i;
export default handler;
