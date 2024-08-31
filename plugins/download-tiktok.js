import axios from 'axios';
import cheerio from 'cheerio';
import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import fs from 'fs';
import { tiktokdl } from '@bochilteam/scraper';

let tiktok;
import('@xct007/frieren-scraper')
  .then((module) => {
    tiktok = module.tiktok;
  })
  .catch((error) => {
    console.error('No se pudo importar "@xct007/frieren-scraper".');
  });

const handler = async (m, { conn, text, args, usedPrefix, command }) => {
  if (!text) throw `Por favor proporciona un enlace de TikTok. Ejemplo: _${usedPrefix + command} https://vm.tiktok.com/ZM686Q4ER/_`;
  if (!/(?:https?:\/\/)?(?:www\.|m\.)?tiktok\.com\/([^\s&]+)/gi.test(text)) throw `Enlace no válido. Ejemplo: _${usedPrefix + command} https://vm.tiktok.com/ZM686Q4ER/_`;

  const texto = 'Descargando video de TikTok...';

  try {
    // Preparar y enviar mensaje de estado
    const prep = generateWAMessageFromContent(m.chat, {
      extendedTextMessage: {
        text: texto,
        contextInfo: {
          externalAdReply: {
            title: 'Descarga de TikTok',
            body: null,
            thumbnail: 'https://example.com/thumbnail.jpg', // Cambia esto por una imagen real
            sourceUrl: 'https://github.com/BrunoSobrino/TheMystic-Bot-MD',
          },
          mentionedJid: [m.sender],
        },
      },
    }, { quoted: m, userJid: conn.user.jid });
    await conn.relayMessage(m.chat, prep.message, { messageId: prep.key.id, mentions: [m.sender] });

    // Intentar obtener el video usando tiktokdl
    const dataFn = await conn.getFile(`${global.MyApiRestBaseUrl}/api/tiktokv2?url=${args[0]}&apikey=${global.MyApiRestApikey}`);
    await conn.sendMessage(m.chat, { video: dataFn.data, caption: 'Aquí está el video de TikTok.' }, { quoted: m });
  } catch (e1) {
    try {
      // Usar @xct007/frieren-scraper
      const dataF = await tiktok.v1(args[0]);
      await conn.sendMessage(m.chat, { video: { url: dataF.play }, caption: 'Aquí está el video de TikTok.' }, { quoted: m });
    } catch (e2) {
      try {
        // Usar tiktokdl
        const tTiktok = await tiktokdlF(args[0]);
        if (tTiktok.status) {
          await conn.sendMessage(m.chat, { video: { url: tTiktok.video }, caption: 'Aquí está el video de TikTok.' }, { quoted: m });
        } else {
          throw 'No se pudo obtener el video de TikTok usando el servicio alternativo.';
        }
      } catch (e3) {
        try {
          const { video } = await tiktokdl(args[0]);
          const url = video.no_watermark2 || video.no_watermark || 'https://tikcdn.net' + video.no_watermark_raw || video.no_watermark_hd;
          await conn.sendMessage(m.chat, { video: { url: url }, caption: 'Aquí está el video de TikTok.' }, { quoted: m });
        } catch (e4) {
          throw 'No se pudo obtener el video de TikTok. Asegúrate de que el enlace sea válido.';
        }
      }
    }
  }
};

handler.command = /^(tiktok|ttdl|tiktokdl|tiktoknowm|tt|ttnowm|tiktokaudio)$/i;
export default handler;

async function tiktokdlF(url) {
  if (!/tiktok/.test(url)) throw 'Enlace no válido. Ejemplo: _!tiktok https://vm.tiktok.com/ZM686Q4ER/_';

  try {
    const gettoken = await axios.get('https://tikdown.org/id');
    const $ = cheerio.load(gettoken.data);
    const token = $('#download-form > input[type=hidden]:nth-child(2)').attr('value');
    const param = { url: url, _token: token };

    const { data } = await axios.post('https://tikdown.org/getAjax?', new URLSearchParams(param), {
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'user-agent': 'Mozilla/5.0',
      },
    });

    const getdata = cheerio.load(data.html);
    if (data.status) {
      return {
        status: true,
        video: getdata('div.download-links > div:nth-child(1) > a').attr('href')
      };
    } else {
      return { status: false };
    }
  } catch (e) {
    throw 'No se pudo procesar la descarga del video.';
  }
}
