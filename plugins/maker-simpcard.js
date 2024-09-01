const handler = async (m, { conn }) => {
  // Determina el ID del usuario mencionado, el ID del mensaje citado, o el ID del remitente
  const who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;

  // Envía una imagen generada con la API de canvas
  await conn.sendFile(
    m.chat,
    global.API('https://some-random-api.com', '/canvas/simpcard', {
      avatar: await conn.profilePictureUrl(who, 'image').catch(() => 'https://telegra.ph/file/24fa902ead26340f3df2c.png'),
    }),
    'simpcard.png',
    'Tremendo Simp'
    // Se eliminó la traducción, se usa texto estático en lugar de texto traducido
    , 
    m
  );
};

handler.help = ['simpcard'];
handler.tags = ['maker'];
handler.command = /^(simpcard)$/i;

export default handler;
