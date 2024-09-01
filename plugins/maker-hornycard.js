const handler = async (m, { conn }) => {
  // Determina el ID del usuario mencionado, el ID del mensaje citado, o el ID del remitente
  const who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;

  // Envía una imagen generada con la API de canvas
  await conn.sendFile(
    m.chat,
    global.API('https://some-random-api.com', '/canvas/horny', {
      avatar: await conn.profilePictureUrl(who, 'image').catch(() => 'https://telegra.ph/file/24fa902ead26340f3df2c.png'),
    }),
    'hornycard.png',
    'Tener una licensiapara estar Hot, no te da derecho a estarlo siempre'
    // Se eliminó la traducción, se usa texto estático en lugar de texto traducido
    , 
    m
  );
};

handler.help = ['hornycard', 'hornylicense'];
handler.tags = ['maker'];
handler.command = /^(horny(card|license))$/i;

export default handler;
