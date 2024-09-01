const handler = async (m, { conn }) => {
  // Determina el ID del usuario mencionado o el ID del remitente
  const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;

  // Envía una imagen generada con la API de canvas
  await conn.sendFile(
    m.chat, 
    global.API('https://some-random-api.com', '/canvas/gay', {
      avatar: await conn.profilePictureUrl(who, 'image').catch(() => 'https://telegra.ph/file/24fa902ead26340f3df2c.png'),
    }), 
    'error.png', 
    'Aquí está tu imagen', // Texto en lugar de la traducción
    m
  );

handler.help = ['gay'];
handler.tags = ['maker'];
handler.command = /^(gay)$/i;

export default handler;
