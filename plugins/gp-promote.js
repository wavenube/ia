const handler = async (m, { conn, usedPrefix, text }) => {
  let number;
  
  if (isNaN(text) && !text.match(/@/g)) {
    // Si no es un número ni un @tag
  } else if (isNaN(text)) {
    number = text.split`@`[1];
  } else if (!isNaN(text)) {
    number = text;
  }

  if (!text && !m.quoted) {
    return conn.reply(m.chat, `🛸 Usa el comando de la siguiente manera:\n\n*┯┷*\n*┠≽ ${usedPrefix}daradmin @tag*\n*┠≽ ${usedPrefix}darpoder responder a un mensaje*\n*┷┯*`, m);
  }

  if (number && (number.length > 13 || (number.length < 11 && number.length > 0))) {
    return conn.reply(m.chat, `⚠️ El número es incorrecto.`, m);
  }

  try {
    let user;
    if (text) {
      user = number + '@s.whatsapp.net';
    } else if (m.quoted && m.quoted.sender) {
      user = m.quoted.sender;
    } else if (m.mentionedJid) {
      user = number + '@s.whatsapp.net';
    }

    // Promover a administrador
    await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
    conn.reply(m.chat, `✅ El usuario ha sido promovido a administrador.`, m);

  } catch (e) {
    console.error(e);
  }
};

handler.help = ['*593xxx*', '*@usuario*', '*responder chat*'].map(v => 'promote ' + v);
handler.tags = ['group'];
handler.command = /^(promote|daradmin|darpoder)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
handler.fail = null;

export default handler;
