import axios from 'axios';
import cheerio from 'cheerio';
import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import { tiktokdl } from '@bochilteam/scraper';

const handler = async (m, { conn, text, args, usedPrefix, command }) => {
  if (!text) throw `Por favor, proporciona un enlace de TikTok. Usa _${usedPrefix + command} https://vm.tiktok.com/ZM686Q4ER/_`;
  if (!/(?:https?:\/\/)?(?:www\.|m\.)?tiktok\.com\/([^\s&]+)/gi.test(text)) throw `El enlace proporcionado no es válido. Usa _${usedPrefix + command} https://vm.tiktok.com/ZM686Q4ER/_`;

  const texto = `Descargando video de TikTok.`;
  const image1 = 'https://example.com/thumbnail.jpg'; // Cambia esto por una imagen real

  try {
    const aa = { quoted: m, userJid: conn.user.jid };
    const prep = generateWAMessageFromContent(m.chat, {
      extendedTextMessage: {
        text: texto,
        contextInfo: {
          externalAdReply: {
            title: 'Descarga de TikTok',
            body: null,
            thumbnail: image1,
            sourceUrl: 'https://github.com/BrunoSobrino/TheMystic-Bot-MD',
          },
          mentionedJid: [m.sender],
        },
      },
    }, aa);
    await conn.relayMessage(m.chat, prep.message, { messageId: prep.key.id, mentions: [m.sender] });

    // Prueba la API externa
    try {
      const dataFn = await conn.getFile(`${global.MyApiRestBaseUrl}/api/tiktokv2?url=${args[0]}&apikey=${global.MyApiRestApikey}`);
      await conn.sendMessage(m.chat, { video: dataFn.data, caption: 'Aquí está el video de TikTok.' }, { quoted: m });
      return;
    } catch (e) {
      console.error('Error al obtener el video desde el API Rest:', e.message);
    }

    // Prueba tiktokdl
    try {
      const { video } = await tiktokdl(args[0]);
      const url = video.no_watermark2 || video.no_watermark || 'https://tikcdn.net' + video.no_watermark_raw || video.no_watermark_hd;
      await conn.sendMessage(m.chat, { video: { url: url }, caption: 'Aquí está el video de TikTok.' }, { quoted: m });
      return;
    } catch (e) {
      console.error('Error al obtener el video desde @bochilteam/scraper:', e.message);
    }

    throw 'No se pudo obtener el video de TikTok.';
  } catch (error) {
    console.error('Error en el manejo del comando:', error.message);
    throw 'Hubo un problema al procesar tu solicitud.';
  }
};

handler.command = /^(tiktok|ttdl|tiktokdl|tiktoknowm|tt|ttnowm|tiktokaudio)$/i;
export default handler;
