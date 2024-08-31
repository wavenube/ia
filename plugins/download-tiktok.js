import axios from 'axios';
import cheerio from 'cheerio';
import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import { tiktokdl } from '@bochilteam/scraper';
import fs from 'fs';

const handler = async (m, { conn, text, args, usedPrefix, command }) => {
  const datas = global;
  const idioma = datas.db.data.users[m.sender].language;
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
  const tradutor = _translate.plugins.descargas_tiktok;

  if (!text) throw `${tradutor.texto1} _${usedPrefix + command} https://vm.tiktok.com/ZM686Q4ER/_`;
  if (!/(?:https?:\/\/)?(?:www\.|m\.)?tiktok\.com\/([^\s&]+)/gi.test(text)) throw `${tradutor.texto2} _${usedPrefix + command} https://vm.tiktok.com/ZM686Q4ER/_`;

  const texto = `${tradutor.texto3}`;
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

    throw `${tradutor.texto9}`;
  } catch (error) {
    console.error('Error en el manejo del comando:', error.message);
    throw 'Hubo un problema al procesar tu solicitud.';
  }
};

handler.command = /^(tiktok|ttdl|tiktokdl|tiktoknowm|tt|ttnowm|tiktokaudio)$/i;
export default handler;
