import uploadImage from '../src/libraries/uploadImage.js';
import fetch from 'node-fetch';

const handler = async (m, { conn }) => {
  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || '';

  if (!mime) throw 'Por favor, responde a una imagen con un código QR para leerlo.';

  const img = await q.download?.();
  const url = await uploadImage(img);
  const response = await fetch(`https://api.lolhuman.xyz/api/read-qr?apikey=${lolkeysapi}&img=${url}`);
  const json = await response.json();

  await m.reply(`El código QR dice: ${json.result}`);
};

handler.command = /^(readqr)$/i;
export default handler;
