import fetch from 'node-fetch';

const tenorApiKey = 'AIzaSyBLoTdLb1id3rpdjJNbwY8XwgjVnwvJS7I';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!m.mentionedJid || m.mentionedJid.length === 0) {
    throw `*Uso correcto: ${usedPrefix + command} @usuario*`;
  }

  const mentionedJid = m.mentionedJid[0];
  const reactionType = command.toLowerCase();
  const query = reactionType; // Personaliza la palabra clave según el comando

  // Realiza la búsqueda en Tenor
  const response = await fetch(`https://tenor.googleapis.com/v2/search?q=${query}&key=${tenorApiKey}&client_key=my_test_app&limit=1`);
  const json = await response.json();

  if (json.results && json.results.length > 0) {
    const gifUrl = json.results[0].media_formats.gif.url;
    const messageText = `@${m.sender.split('@')[0]} ${reactionType} a @${mentionedJid.split('@')[0]}!`;

    await conn.sendMessage(m.chat, {
      video: { url: gifUrl },
      caption: messageText,
      mentions: [m.sender, mentionedJid]
    });
  } else {
    throw `*No se encontró ningún GIF para ${reactionType}*`;
  }
};

handler.help = ['kiss', 'slap', 'pat']; 
handler.tags = ['fun'];
handler.command = /^(kiss|slap|pat)$/i;

export default handler;
