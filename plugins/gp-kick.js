let handler = async (m, { conn, participants, usedPrefix, command }) => {
  let kickte = `🛸 Correct use of the command\n*${usedPrefix + command}* @tag`;

  if (!m.mentionedJid[0] && !m.quoted) return m.reply(kickte, m.chat, { mentions: conn.parseMention(kickte) });

  let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;

  // Obtener la foto de perfil del usuario que se va a expulsar
  let pp = await conn.profilePictureUrl(user).catch(_ => null);
  if (!pp) return m.reply('No se pudo obtener la foto de perfil.');

  // URL de la API para generar la imagen
  let apiUrl = `https://deliriusapi-official.vercel.app/canvas/delete?url=${pp}`;

  // Enviar la imagen generada
  await conn.sendFile(m.chat, apiUrl, 'delete.jpg', 'Este usuario será expulsado...', m);

  // Expulsar al usuario
  await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
  m.reply(`✅ Usuario expulsado...`);
};

handler.help = ['kick @user'];
handler.tags = ['group'];
handler.command = ['kick'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
