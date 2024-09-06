import fetch from 'node-fetch';
import { sticker } from '../src/libraries/sticker.js';

const handler = async (m, {conn, text, usedPrefix, command}) => {
  if (!text) throw `Usa el comando de esta forma: ${usedPrefix + command} https://getstickerpack.com/stickers/flork-memes-4-1`;
  
  try {
    const url = text;
    const res = await fetch(`https://api.akuari.my.id/downloader/stickerpack?link=${url}`);
    const json = await res.json();
    
    for (const data of (json.result || json)) {
      const stikers = await sticker(false, data, global.packname, global.author);
      conn.sendFile(m.chat, stikers, null, {asSticker: true}, m, true, {contextInfo: {'forwardingScore': 200, 'isForwarded': true}}, {quoted: m});
    }
  } catch {
    await m.reply("Hubo un error al descargar el paquete de stickers. Verifica el enlace y vuelve a intentarlo.");
  }
};

handler.command = /^stickerpack$/i;
export default handler;
