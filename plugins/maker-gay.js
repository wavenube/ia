const handler = async (m, { conn }) => {
  // Define el archivo de audio que se enviará
  const vn = './src/assets/audio/01J673A5RN30C5EYPMKE5MR9XQ.mp3';

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

  // Envía un mensaje de audio
  await conn.sendMessage(
    m.chat, 
    { audio: { url: vn }, fileName: 'error.mp3', mimetype: 'audio/mpeg', ptt: true }, 
    { quoted: m }
  );
};

handler.help = ['gay'];
handler.tags = ['maker'];
handler.command = /^(gay)$/i;

export default handler;
