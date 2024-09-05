const handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.quoted) throw '*Debes responder a un video para convertirlo en GIF con audio.*';
  
  const q = m.quoted || m;
  const mime = (q.msg || q).mimetype || '';
  
  if (!/(mp4)/.test(mime)) throw `*El archivo debe ser un video MP4, no se puede convertir el archivo con tipo ${mime}.*`;
  
  m.reply('Por favor espera mientras convierto el video...');
  
  const media = await q.download();
  
  conn.sendMessage(m.chat, { video: media, gifPlayback: true, caption: 'Aquí tienes tu GIF.' }, { quoted: m });
};

handler.command = ['togif'];
export default handler;
