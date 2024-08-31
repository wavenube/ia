let handler = async (m, { conn, usedPrefix, command, text }) => {
  let number;
  
  if (isNaN(text) && !text.match(/@/g)) {
    // Nada que hacer si no es un número o un @tag
  } else if (isNaN(text)) {
    number = text.split`@`[1];
  } else if (!isNaN(text)) {
    number = text;
  }

  if (!text && !m.quoted) return conn.reply(m.chat, `🛸 Usa el comando de la siguiente manera: \n *${usedPrefix + command}* @tag`, m);
  if (number.length > 13 || (number.length < 11 && number.length > 0)) return conn.reply(m.chat, `️🛸 Número incorrecto`, m);

  try {
    let user;
    if (text) {
      user = number + '@s.whatsapp.net';
    } else if (m.quoted && m.quoted.sender) {
      user = m.quoted.sender;
    } else if (m.mentionedJid) {
      user = number + '@s.whatsapp.net';
    }

    // Obtener la lista de administradores del grupo
    const groupMetadata = await conn.groupMetadata(m.chat);
    const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);

    // Verificar si el usuario es administrador
    if (admins.includes(user)) {
      return conn.reply(m.chat, `🚫 No puedes degradar a otro administrador.`, m);
    }

    // Proceder con la degradación si no es administrador
    await conn.groupParticipantsUpdate(m.chat, [user], 'demote');
    m.reply(`✅ El usuario ha sido degradado.`);
    
  } catch (e) {
    console.error(e);
  }
}

handler.help = ['promote (@tag)'];
handler.tags = ['group'];
handler.command = ['promote', 'daradmin']; 
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
handler.fail = null;

export default handler;
