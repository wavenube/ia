const handler = async (m, { conn, text }) => {
  // Verifica si el texto está presente
  if (!text) throw 'No Text';

  // Envía una imagen generada con la API de canvas
  await conn.sendFile(
    m.chat,
    global.API('https://some-random-api.com', '/canvas/youtube-comment', {
      avatar: await conn.profilePictureUrl(m.sender, 'image').catch(() => 'https://telegra.ph/file/24fa902ead26340f3df2c.png'),
      comment: text,
      username: conn.getName(m.sender),
    }),
    'youtube-comment.png',
    'Aquí está tu comentario'
    // Se eliminó la traducción, se usa texto estático en lugar de texto traducido
    , 
    m
  );
};

handler.help = ['ytcomment <comment>'];
handler.tags = ['maker'];
handler.command = /^(ytcomment)$/i;

export default handler;
