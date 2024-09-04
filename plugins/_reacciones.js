import fetch from 'node-fetch';

const reactionGifs = {
  kiss: 'https://nekos.life/api/v2/img/kiss',
  slap: 'https://nekos.life/api/v2/img/slap',
  pat: 'https://nekos.life/api/v2/img/pat',
  // Agrega más acciones y sus URLs según sea necesario
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
  // Verifica si se ha mencionado a alguien
  if (!m.mentionedJid || m.mentionedJid.length === 0) {
    throw `*Uso correcto: ${usedPrefix + command} @usuario*`;
  }

  const mentionedJid = m.mentionedJid[0];
  const reactionType = command.toLowerCase();
  const reactionUrl = reactionGifs[reactionType];

  if (!reactionUrl) {
    throw `*Reacción no reconocida: ${reactionType}*`;
  }

  const reactionGif = await fetch(reactionUrl).then(res => res.json()).then(json => json.url);
  const messageText = `@${m.sender.split('@')[0]} ${reactionType} a @${mentionedJid.split('@')[0]}!`;

  await conn.sendMessage(m.chat, {
    image: { url: reactionGif },
    caption: messageText,
    mentions: [m.sender, mentionedJid]
  });
};

handler.help = ['kiss', 'slap', 'pat']; // Agrega más comandos aquí
handler.tags = ['fun'];
handler.command = /^(kiss|slap|pat)$/i; // Expande con más comandos si es necesario

export default handler;
