const handler = async (m, { conn, text }) => {
  // Verifica si el texto está presente
  if (!text) throw 'No Text';

  // Define el avatar de la foto respondida, si existe
  const quotedMessage = m.quoted ? m.quoted : null;
  let imageUrl;

  // Si hay un mensaje citado y contiene una imagen, usa esa imagen
  if (quotedMessage && quotedMessage.message && quotedMessage.message.imageMessage) {
    imageUrl = quotedMessage.message.imageMessage.url;
  } else {
    // Si no hay imagen, usa el perfil del usuario como fallback
    imageUrl = await conn.profilePictureUrl(m.sender, 'image').catch(() => 'https://telegra.ph/file/24fa902ead26340f3df2c.png');
  }

  // Envía una imagen generada con la API de canvas
  await conn.sendFile(
    m.chat,
    global.API('https://some-random-api.com', '/canvas/pixelate', {
      avatar: imageUrl,
      comment: text,
      username: conn.getName(m.sender),
    }),
    'pixelate.png',
    'Aquí está tu imagen pixelada'
    // Se eliminó la traducción, se usa texto estático en lugar de texto traducido
    , 
    m
  );
};

handler.help = ['pixel', 'difuminar'];
handler.tags = ['maker'];
handler.command = /^(pixel|pixelar|difuminar)$/i;

export default handler;
