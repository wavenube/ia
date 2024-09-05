import axios from 'axios';
import {generateWAMessageFromContent} from "@whiskeysockets/baileys";

const handler = async (m, {conn, text, args, usedPrefix, command}) => {
  if (!text) throw `Debes proporcionar un enlace de TikTok. Ejemplo: _${usedPrefix + command} https://www.tiktok.com/@user/video/1234567890_`;
  if (!/(?:https?:\/\/)?(?:www\.)?(?:tiktok\.com\/)/i.test(text)) throw 'Enlace de TikTok no válido. Asegúrate de usar un enlace válido.';

  // Mostrar mensaje de espera
  const aa = {quoted: m, userJid: conn.user.jid};
  const prep = generateWAMessageFromContent(m.chat, {extendedTextMessage: {text: 'Procesando tu video, espera un momento...', contextInfo: {mentionedJid: [m.sender]}}}, aa);
  await conn.relayMessage(m.chat, prep.message, {messageId: prep.key.id, mentions: [m.sender]});

  try {
    // Llamada a la API de savefrom.net para descargar el video
    const response = await axios.get(`https://api.savefrom.net/1/info?url=${encodeURIComponent(args[0])}&type=json`);
    const { title, url } = response.data;

    if (!url) throw 'Error al descargar el video. Verifica el enlace y vuelve a intentarlo.';

    // Enviar video al chat
    await conn.sendMessage(m.chat, {video: {url: url}, caption: `Aquí está tu video descargado de TikTok: ${title}`}, {quoted: m});
  } catch (err) {
    console.error(err);
    throw 'Error al descargar el video. Verifica el enlace y vuelve a intentarlo.';
  }
};

handler.command = /^(tiktok|ttdl|tiktokdl|tiktoknowm|tt|ttnowm)$/i;
export default handler;
