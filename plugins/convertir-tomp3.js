import {toAudio} from '../lib/converter.js';

const handler = async (m, {conn, usedPrefix, command}) => {
  const q = m.quoted ? m.quoted : m;
  const mime = (q || q.msg).mimetype || q.mediaType || '';
  if (!/video|audio/.test(mime)) throw '*El formato no es válido. Por favor, responde a un video o audio.*';
  
  const media = await q.download();
  if (!media) throw '*Error al descargar el archivo. Intenta de nuevo.*';
  
  const audio = await toAudio(media, 'mp4');
  if (!audio.data) throw '*Error al convertir el archivo a MP3.*';
  
  conn.sendMessage(m.chat, {audio: audio.data, mimetype: 'audio/mpeg'}, {quoted: m});
};

handler.alias = ['tomp3', 'toaudio'];
handler.command = /^to(mp3|audio)$/i;
export default handler;
