import uploadFile from '../lib/uploadFile.js';
import uploadImage from '../lib/uploadImage.js';
import axios from 'axios';

const handler = async (m) => {
  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || '';
  
  if (!mime) throw '*Debes responder a una imagen o video para convertirlo en un enlace.*';
  
  const media = await q.download();
  const isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime);
  const link = await (isTele ? uploadImage : uploadFile)(media);
  
  try {
    // Enviar la solicitud a la API para acortar el enlace
    const apiUrl = `https://deliriusapi-official.vercel.app/shorten/tinyurl?url=${encodeURIComponent(link)}`;
    const response = await axios.get(apiUrl);
    const shortUrl = response.data.result; // El enlace acortado está en 'result'
    
    // Enviar el enlace acortado como respuesta
    m.reply(`*Aquí tienes tu enlace acortado:* ${shortUrl}`);
  } catch (e) {
    m.reply(`Ocurrió un error al acortar el enlace: ${e.message}`);
  }
};

handler.help = ['tourl <reply image>'];
handler.tags = ['sticker'];
handler.command = /^(upload|tourl)$/i;

export default handler;
